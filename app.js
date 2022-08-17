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
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    User.findById('62fd08118f8f7a02e1f020dd')
        .then(user => {
            req.user = user
            next()
        })
        .catch(error => {
            console.log(error)
        });

})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
    .connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(result => {
        return User.findOne()
    }).then(user => {
        if (!user) {
            const user = new User(
                {
                    name: 'Mohamed Najiub',
                    email: 'mohamed.najiub@webkeyz.com',
                    cart: {
                        items: []
                    }
                }
            )
            user.save()
        }
        app.listen(3000)
    }).catch(error => {
        console.log(error)
    })
