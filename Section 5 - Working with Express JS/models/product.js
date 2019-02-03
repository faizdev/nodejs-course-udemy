const fs = require("fs")
const path = require("path")
const uuidv4 = require('uuid/v4')
const {debugModelLog, debugModelError} = require('../utils/debugger')

const p = path.join(
    path.dirname(process.mainModule.filename),
    "data",
    "products.json"
)

const getProductFromFile = callback => {
    fs.readFile(p, (err, fileContent) => {
        if (!err) {
            try {
                callback(JSON.parse(fileContent))
            } catch (e) {
                callback([])
            }
        } else {
            callback([])
        }
    })
}

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id
        this.title = title
        this.imageUrl = imageUrl
        this.description = description
        this.price = price
    }

    save() {
        getProductFromFile(products => {
            if(this.id) {
                debugModelLog("editing product",this)
                const productIndex = products.findIndex(p => p.id === this.id)    
                
                if(productIndex > -1) {
                    products[productIndex] = this
                    fs.writeFile(p, JSON.stringify(products),err => {
                        if(err) 
                            debugModelError("Product.Update: Failed write to file",err)
                    })
                }
            } else {
                this.id = uuidv4()
                debugModelLog("adding product")
                products.push(this)
                fs.writeFile(p, JSON.stringify(products), err => {
                    if (err) console.log("Writing: ", err)
                })
            }
        })
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            getProductFromFile(products => {
                const product = products.find(p => p.id === id)
                if(product) {
                    debugModelLog('Prouduct.FindByID: result', products)
                    resolve(product)
                } else {
                    debugModelError('Prouduct.FindByID: Product not found')
                    reject({err:"product not found"})
                }
                
            })
        })
    }

    static fetchAll(callback) {
        getProductFromFile(callback)
    }
}
