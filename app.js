const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
require('dotenv').config()

const mongoose = require('mongoose')
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use((req, res, next) => {
//     User.findUserById('62fbb142a62c1c7cf309ea5b')
//         .then(user => {
//             req.user = new User(user.name, user.email, user.cart, user._id)
//             next()
//         })
//         .catch(error => {
//             console.log(error)
//         });

// })

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
    .connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(result => {
        app.listen(3000)
    }).catch(error => {
        console.log(error)
    })
