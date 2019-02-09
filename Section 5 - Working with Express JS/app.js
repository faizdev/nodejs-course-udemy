const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorsController = require('./controllers/errors')
const mongoConnect = require('./utils/database').monggoConnect

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
const User = require('./models/user')

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById("5c5ba02c5b8b3a3c56d64f4e")
        .then(user => {
            if (user) {
                debugGeneralLog("User found", user)
                req.user = new User(user.username, user.email, user.cart, user._id)
                next()
            } else {
                debugGeneralLog("User not found, creating new user")
                const user = new User("alfian faiz", "a.faizmail@gmail.com")
                user.save()
                    .then(result => {
                        debugGeneralLog("Success add dummy user to db")
                        next()
                    })
                    .catch(err => {
                        debugGeneralError("Failed add dummy user to db")
                    })
            }
        })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404Page);

mongoConnect(() => {
    console.log("listening 3000")
    app.listen(3000)
})