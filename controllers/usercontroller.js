var express = require ('express')
var router = express.Router()
var sequelize = require('../db');
var User = sequelize.import('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const validateSession = require('../middleware/validate-session');

router.post('/register', function(req,res){
    var username = req.body.username;
    var pass = req.body.password;

    User.create({
        username: username,
        passwordhash: bcrypt.hashSync(pass, 10) 
    }).then(
        function createSuccess(user){
            var token = jwt.sign({id:user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});            
            res.json({
                user: user,
                message: 'created',
                token: token 
            });
        },
        function createError(err) {
            res.send(500, err.message);
        }
    )
})

//router.post('/login', function(req,res){
router.post('/authenticate', function(req,res){
    User.findOne({where:{username:req.body.username}}) 
    .then(
        function(user) {
            if (user){
                bcrypt.compare(req.body.password, user.passwordhash, function (err, matches){
                    if (matches){
                        var token = jwt.sign({id:user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
                        //var token = 'fake-token';
                        res.json({
                            user: user,
                            message: "successfully authenticated",
                            sessionToken: token
                        });
                    }else{
                        res.status(502).send({ error: "you failed, yo"});
                    }
                });
            } else {
                res.status(500).send({ error: "failed to authenticate"});
            }
        },
        function (err) {
            res.status(501).send({ error: "you failed, yo"});
        }
    )
})

router.get('/getuser', validateSession, (req, res) => {
    User.findAll({ 
        // where: {
        //     owner:req.user.id
        // }, 
        include: ['food', 'shopping']
    })
        .then(info => res.status(200).json(info))
        .catch(err => res.status(500).json(err))
})



module.exports = router;