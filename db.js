
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres'
});

sequelize.authenticate()
.then(() => console.log('Connected to postgres database'))
.catch(err => console.log(err))

User = sequelize.import('./models/user')
Food = sequelize.import('./models/food')
Shopping = sequelize.import('./models/shopping')



Food.belongsTo(User);
User.hasMany(Food);

Shopping.belongsTo(User);
User.hasMany(Shopping)

module.exports = sequelize;
