const fs = require("fs")
const {debugModelLog, debugModelError} = require('../utils/debugger')
const db = require('../utils/database')

module.exports = class Product {

    constructor(id, title, imageUrl, description, price) {
        this.id = id
        this.title = title
        this.imageUrl = imageUrl
        this.description = description
        this.price = price

        this.tableName = 'product'
    }
    

    save() {
        debugModelLog("saving product")
        return db.execute(`INSERT INTO product (title, price, imageUrl, description) VALUES (?, ?, ?, ?)`,
        [this.title, this.price, this.imageUrl, this.description])
    }

    static findById(id) {
        return db.execute("SELECT * FROM product WHERE id = ? ",[id])
    }

    static fetchAll() {
        debugModelLog("Fetching product")
        return db.execute(`SELECT * FROM  product`)
    }

    static delegeById(id) {
        return db.execute("DELETE FROM product WHERE id = ?", [id])
    }
}
