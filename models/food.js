module.exports = function (sequelize, DataTypes){
    return sequelize.define('food', {
    food: DataTypes.STRING, 
    quantity: DataTypes.INTEGER, 
    expiration: DataTypes.STRING,
    brand: DataTypes.STRING,
    owner: DataTypes.INTEGER
    })
    }
    