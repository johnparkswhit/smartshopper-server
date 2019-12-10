var express = require ('express')
var router = express.Router()
var sequelize = require('../db');
var User = sequelize.import('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const validateSession = require('../middleware/validate-session');

//CREATE A USER
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

//AUTHENTICATE A USER
router.post('/authenticate', function(req,res){
    User.findOne({where:{username:req.body.username}}) 
    .then(
        function(user) {
            if (user){
                bcrypt.compare(req.body.password, user.passwordhash, function (err, matches){
                    if (matches){
                        var token = jwt.sign({id:user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
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

//GET ALL USERS
router.get('/getall', validateSession, (req, res,) => {
    User.findAll({
        
    })
        .then(info => res.status(200).json(info))
        .catch(err => res.status(500).json(err))
})

//GET ONE USER BY ID
router.get('/getuser/:id', (req, res) => {
    User.findOne({ 
        where: {
            id: req.params.id
        }, 
    })
        .then(info => res.status(200).json(info))
        .catch(err => res.status(500).json(err))
})

//DELETE ONE USER BY ID
router.delete('/delete/:id', validateSession, (req, res) => {
    User.destroy({ 
        where: {
            id: req.params.id
        }, 
    })
        .then(info => res.status(200).json(info))
        .catch(err => res.status(500).json(err))
})

//UPDATE ONE USER BY ID
router.put('/update/:id', validateSession, (req, res) => {
    User.update({
        username: req.body.username,
        password: req.body.password
    },     
    {where: {
        id: req.params.id
        }, returning: true
    })
        .then(info => res.status(200).json(info))
        .catch(err => res.status(500).json(err))
})

module.exports = router;