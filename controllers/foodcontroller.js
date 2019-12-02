var router = require('express').Router();
var Food = require('../db').import('../models/food');
const validateSession = require('../middleware/validate-session');

module.exports = router;

router.post('/create', validateSession, (req,res) => {
    Food.create({
        food: req.body.food,
        quantity: req.body.quantity,
        expiration: req.body.expiration, 
        brand: req.body.brand,
        owner: req.user.id,
        userId: req.user.id
    }).then(
        function createSuccess(food){
            res.status(200).json({
                food: food,
                message: 'Food Created',
            });
        },
        function createError(err) {
            res.send(500, err.message);
        }
    )
})


router.put('/update/:id', validateSession, (req, res) => {
    Food.update({ 
        food: req.body.food,
        quantity: req.body.quantity,
        expiration: req.body.expiration, 
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
                res.status(200).json({message:'Food updated'})
            },
            updateFail = err => {
                res.status(500).json({message:'Update failed', error:err})
            }
        );
});


router.get('/getall', validateSession, (req,res) => {
    Food.findAll({
        where: {
            owner: req.user.id
          },
        include:'user'
    })
        .then(food => res.status(200).json(food))   
        .catch(err => res.status(500).json({error:err}))
})

router.get('/getone/:id', validateSession, (req,res) => {
    Food.findOne({
        where: {
            id : req.params.id,
            owner: req.user.id
        }, 
        include: 'user'
    })
        .then(food => res.status(200).json(food))
        .catch(err => res.status(500).json({error:err}))
})


router.delete('/delete/:id', validateSession, (req, res) => {
    Food.destroy({
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