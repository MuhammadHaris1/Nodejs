var express = require('express');
const Users = require('../modals/users'),
    jwt = require('jsonwebtoken');
var router = express.Router();

// router.use(function (req, res, next) {
//     res.header(
//         "Access-Control-Allow-Headers",
//         "x-access-token, Origin, Content-Type, Accept"
//     );
//     next();
// })

router.get("/allUsers", async (req, res, next) => {
    var authHeader = req.headers.authorization
    jwt.verify(authHeader.split(' ')[1], "auth-key", async (err, user) => {
        if (err) {
            return res.json({
                status: false,
                message: "Autherization error"
            })
        }
        try {
            let allUsers = await Users.find().where("_id").ne(user.id)

            res.json({
                status: true,
                users: allUsers
            })

        } catch (error) {
            res.json({
                status: false,
                error: error.message
            })
        }
    })
})

module.exports = router