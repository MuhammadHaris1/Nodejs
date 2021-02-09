var express = require('express');
var router = express.Router();


var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt'),
  User = require("../modals/users");

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function (req, res, next) {
  var newUser = new User(req.body);
  newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
  newUser.save(function (err, user) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      user.hash_password = undefined;
      return res.json(user);
    }
  });
})

router.post('/login', function (req, res, next) {
  if (!req.body.email) {
    res.json({ status: false, message: "email is required" })
  } else {
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        return res.json({ status: false, error: err })
      }

      if (!user) {
        return res.status(404).send({ status: false, message: "User Not found." });
      }

      console.log("compare", req.body.password, user.hash_password)

      let passwordIsValid = bcrypt.compareSync(req.body.password, user.hash_password)

      console.log("Password is valid", passwordIsValid)

      if (!passwordIsValid) {
        return res.status(404).json({ status: false, message: "invalid" })
      }


      var token = jwt.sign({ id: user.id }, "auth-key", {
        expiresIn: 86400 // 24 hours
      });

      res.status(200).send({
        status: true,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          accessToken: token
        }
      });

    })
  }
})

module.exports = router;
