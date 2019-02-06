const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorsController = require('./controllers/errors')
const sequelize = require('./utils/database')
const {
    debugGeneralLog,
    debugGeneralError
} = require('./utils/debugger')

// MODAL
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const Order = require('./models/order')
const OrderItem = require('./models/order-item')

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById(1)
        .then(user => {
            req.user = user
            debugGeneralLog("Fetch dummy user success")
            next()
        })
        .catch(err => {
            debugGeneralError("Fetch dummy user failed", err)
        })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404Page);


// DB RELATION
Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
})
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, { through: CartItem})
Product.belongsToMany(Cart, { through: CartItem})
User.hasMany(Order)
Order.belongsTo(User)
Order.belongsToMany(Product, {through: OrderItem})
Product.belongsToMany(Order, {through: OrderItem})  


// sequelize
//     // .sync({force: true})
//     .sync()
//     .then(result => {
//         return User.findById(1)
//         debugGeneralLog("Database tables successfully synced")
//     })
//     .then(user => {
//         if (!user) {
//             return User.create({
//                 name: "Faiz",
//                 email: "a.faizmail@gmail.com"
//             })
//         } else
//             return user
//     })
//     .then(user => {
//         // debugGeneralLog("Dummy User: ",user)
//         return user.createCart();
//     })
//     .then(user => app.listen(8090))
//     .catch(err => debugGeneralLog("Database tables failed to sync", err))