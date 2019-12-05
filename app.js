require('dotenv').config()
var express = require('express'); 
var app = express(); 
var user = require('./controllers/usercontroller');
var sequelize = require('./db');
var food = require('./controllers/foodcontroller');
var shopping = require('./controllers/shoppingcontroller')

sequelize.sync();

app.use(express.json());

app.use(require('./middleware/headers'))

app.use('/users', user);
app.use('/food', food);
app.use('/shopping', shopping);
app.use(require('./middleware/validate-session'))

app.listen(process.env.PORT, () => console.log(`App is listening on ${process.env.PORT}`))

