module.exports = function (sequelize, DataTypes){
    return sequelize.define('shopping', {
    food: DataTypes.STRING, 
    quantity: DataTypes.INTEGER,
    brand: DataTypes.STRING,
    owner: DataTypes.INTEGER
    })
    }
    