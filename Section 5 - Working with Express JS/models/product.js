const fs = require("fs")
const path = require("path")

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
                console.log(e)
                callback([])
            }
        } else {
            callback([])
        }
    })
}

module.exports = class Product {
    constructor(t) {
        this.title = t
    }

    save() {
        getProductFromFile(products => {
            products.push(this)
            fs.writeFile(p, JSON.stringify(products), err => {
                if (err) console.log("Writing: ", err)
            })
        })
    }

    static fetchAll(callback) {
        getProductFromFile(callback)
    }
}
