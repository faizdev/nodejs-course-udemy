const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const errorsController = require('./controllers/errors')


const {
    debugGeneralLog,
    debugGeneralError
} = require('./utils/debugger')

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// MODELS

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    next()
    // User.findById("5c5e7ddbdb2b8b07d7752817")
    //     .then(user => {
    //         if (user) {
    //             debugGeneralLog("User found", user)
    //             req.user = new User(user.username, user.email, user.cart, user._id)
    //             next()
    //         } else {
    //             debugGeneralLog("User not found, creating new user")
    //             const user = new User("alfian faiz", "a.faizmail@gmail.com")
    //             user.save()
    //                 .then(result => {
    //                     debugGeneralLog("Success add dummy user to db")
    //                     next()
    //                 })
    //                 .catch(err => {
    //                     debugGeneralError("Failed add dummy user to db")
    //                 })
    //         }
    //     })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404Page);

mongoose.connect("mongodb://localhost:27017/shop?retryWrites=true")
    .then(result => {
        app.listen(3000)
    })
    .catch(err => debugGeneralError("DB Connection Error", err)) 