module.exports = function (sequelize, DataTypes){
    return sequelize.define('user', {
    username: DataTypes.STRING, 
    passwordhash: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    adminStatus: DataTypes.BOOLEAN
    })
    }