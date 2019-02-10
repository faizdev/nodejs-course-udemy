const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    imageUrl: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Product', productSchema)

// const mongodb = require('mongodb')
// const {
//     getDb
// } = require('../utils/database')

// class Product {
//     constructor(title, price, description, imageUrl, id, userId) {
//         this.title = title
//         this.price = price
//         this.description = description
//         this.imageUrl = imageUrl
//         this._id = id ? new mongodb.ObjectID(id) : null
//         this.userId = userId
//     }

//     save() {
//         const db = getDb()
//         let dbOp
//         if(this._id) {
//             dbOp = db.collection('products')
//                     .update({_id: this._id}, {$set: this})
//         } else {
//             dbOp = db.collection('products')
//                     .insertOne(this)
//         }

//         return dbOp.then(result => {
//                 console.log("RESULT: ", result)
//             })
//             .catch(err => {
//                 console.warn("Insert DB Error", err)
//             })
//     }

//     static fetchAll() {
//         const db = getDb()
//         return db
//             .collection('products')
//             .find()
//             .toArray()
//             .then(products => {
//                 console.log(products)
//                 return products
//             })
//             .catch(err => {
//                 console.log(err)
//             })
//     }

//     static findById(productId) {
//         const db = getDb()
//         return db
//             .collection('products')
//             .find({
//                 _id: new mongodb.ObjectID(productId)
//             })
//             .next()
//             .then(product => {
//                 console.log("Successfull fetching product",product)
//                 return product
//             })
//             .catch(err => {
//                 console.log("error fetching product by id", err)
//             })
//     }

//     static deleteById(productId) {
//         const db = getDb()
//         return db
//             .collection('products')
//             .deleteOne({_id: mongodb.ObjectID(productId)})
//     }
// }
// module.exports = Product