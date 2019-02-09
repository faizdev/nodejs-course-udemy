const {
    getDb
} = require('../utils/database')
const mongodb = require('mongodb')
const {
    debugModelLog,
    debugModelError
} = require('../utils/debugger')

class User {
    constructor(username, email, cart, id) {
        this.username = username
        this.email = email
        if (id)
            this._id = mongodb.ObjectID(id)
        this.cart = cart // {items; []}
    }

    save() {
        const db = getDb()
        let dbOp
        if (this._id) {
            dbOp = db.collection('users')
                .updateOne({
                    _id: this._id
                }, {
                    $set: this
                })
        } else {
            dbOp = db.collection('users')
                .insertOne(this)
        }

        return dbOp
            .then(result => {
                debugModelLog("Success saving user to db")
            })
            .catch(err => {
                debugModelError("Error saving user to db")
            })

    }

    getCart() {
        const db = getDb()
        const productIds = this.cart.items.map(p => p.productId)
        return db.collection('products')
            .find({
                _id: {
                    $in: productIds
                }
            })
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString()
                        }).quantity
                    }
                })
            })
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString()
        })

        let newQuantity = 1
        const updatedCartItems = [...this.cart.items]

        if (cartProductIndex >= 0) {
            console.log("updating old product")
            newQuantity = this.cart.items[cartProductIndex].quantity += 1
            updatedCartItems[cartProductIndex].quantity = newQuantity
        } else {
            console.log("adding old product")
            updatedCartItems.push({
                productId: product._id,
                quantity: newQuantity
            })
        }

        const db = getDb()
        return db.collection('users').updateOne({
            _id: this._id
        }, {
            $set: {
                cart: {
                    items: updatedCartItems
                }
            }
        })
    }

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(i => i.productId.toString() !== productId.toString())
        const db = getDb()
        return db.collection('users').updateOne({
            _id: this._id
        }, {
            $set: {
                cart: {
                    items: updatedCartItems
                }
            }
        })
    }


    addOrder() {
        const db = getDb()

        return this.getCart()
            .then(cartProducts => {

                const productIds = cartProducts.map(p => p._id)
                debugModelLog("IDS:", productIds)
                // filter cart product so it contiains valid product data from db
                return db.collection('products')
                    .find({_id: {$in: productIds}})
                    .toArray()
                    .then(products => {
                        debugModelLog("Cart Products",products)
                        let filteredProducts = cartProducts.filter( cp => {
                            debugModelLog("filtering products")
                            const productIndexFromDB = products.findIndex( pdb => {
                                debugModelLog("FIltering: ",pdb._id.toString(), cp._id.toString())
                                return pdb._id.toString() === cp._id.toString()
                            })
                            if(productIndexFromDB >= 0)
                                return true
                            else return false
                        })
                        const order = {
                            items: filteredProducts,
                            user: {
                                _id: new mongodb.ObjectID(this._id),
                                username: this.username,
                                email: this.email
                            }
                        }
                        return db.collection('orders').insertOne(order)
                    })

            })
            .then(result => {
                this.cart = {
                    items: []
                }
                return db.collection('users').updateOne({
                    _id: this._id
                }, {
                    $set: {
                        cart: this.cart
                    }
                })
            })
    }

    getOrders() {
        const db = getDb()
        return db.collection('orders').find({'user._id': new mongodb.ObjectID(this._id)}).toArray()
    }

    static findById(userId) {
        const db = getDb()
        return db.collection('users')
            .find({
                _id: mongodb.ObjectID(userId)
            })
            .next()
            .then(user => {
                debugModelLog("Success find user by id")
                return user
            })
            .catch(err => {
                debugModelError("Failed find user by id", err)
            })
    }


}

module.exports = User