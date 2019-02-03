const fs = require('fs')
const path = require('path')
const debug = require('debug')("debug:all")
const p = path.join(
    path.dirname(process.mainModule.filename),
    "data",
    "cart.json"
)

const getCartFromFile = callback => {
    fs.readFile(p, (err, fileContent) => {
        let cart = {
            products: [],
            totalPrice: 0
        }
        if (!err) {
            try {
                callback(JSON.parse(fileContent))
            } catch (e) {
                callback(cart)
            }
        } else {
            callback(cart)
        }
    })
}

module.exports = class Cart {
    static addProduct(id, productPrice) {
        // fetch product
        getCartFromFile(cart => {
            debug("cart fetch", cart)
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id)
            let updatedProduct = {}
            if (existingProductIndex > -1) {
                const existingProduct = cart.products[existingProductIndex]
                updatedProduct = { ...existingProduct }
                updatedProduct.qty = updatedProduct.qty + 1
                // cart.products = [...cart.products]
                cart.products[existingProductIndex] = updatedProduct
            } else {
                updatedProduct = { id: id, qty: 1 }
                // cart.products = [...cart.products]
                cart.products.push(updatedProduct)
            }
            cart.totalPrice = parseInt(cart.totalPrice) + parseInt(productPrice)
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err)
            })
        })
    }

    static getCart() {
        return new Promise((resolve, callback) => {
            getCartFromFile(cart => {
                resolve(cart)
            })
        })
    }
}