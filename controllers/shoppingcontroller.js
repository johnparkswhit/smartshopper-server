var router = require('express').Router();
var Shopping = require('../db').import('../models/shopping');
const validateSession = require('../middleware/validate-session');

module.exports = router;

router.post('/create', validateSession, (req,res) => {
    Shopping.create({
        food: req.body.food,
        quantity: req.body.quantity,
        brand: req.body.brand,
        owner: req.user.id,
        userId: req.user.id
    }).then(
        function createSuccess(shopping){
            res.status(200).json({
                shopping: shopping,
                message: 'Shopping Item Created',
            });
        },
        function createError(err) {
            res.send(500, err.message);
        }
    )
})


router.put('/update/:id', validateSession, (req, res) => {
    Shopping.update({ 
        food: req.body.food,
        quantity: req.body.quantity,
        brand: req.body.brand,
        owner: req.user.id,
        userId: req.user.id
    },
    {
        where: {
            id : req.params.id,
            owner: req.user.id
        }
    })
        .then(
            updateSuccess = recordsChanged => {
                res.status(200).json({message:'Shopping Item updated'})
            },
            updateFail = err => {
                res.status(500).json({message:'Update failed', error:err})
            }
        );
});


router.get('/getall', validateSession, (req,res) => {
    Shopping.findAll({
        where: {
            owner: req.user.id
          },
        include:'user'
    })
        .then(shopping => res.status(200).json(shopping))   
        .catch(err => res.status(500).json({error:err}))
})

router.get('/getone/:id', validateSession, (req,res) => {
    Shopping.findOne({
        where: {
            id : req.params.id,
            owner: req.user.id
        }, 
        include: 'user'
    })
        .then(shopping => res.status(200).json(shopping))
        .catch(err => res.status(500).json({error:err}))
})


router.delete('/delete/:id', validateSession, (req, res) => {
    Shopping.destroy({
        where: {
            id : req.params.id,
            owner: req.user.id
        }
    })
      .then(
        deleteSuccess = recordsChanged => {  
            res.status(200).json({message: `${recordsChanged} record(s) deleted.`})
        },
        deleteFail = err => {
            res.status(500).json({ message: 'Failed to delete', error:err})
        }
)});