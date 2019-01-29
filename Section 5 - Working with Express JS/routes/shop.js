const express = require("express")
const path = require("path")
const rootDir = require("../utils/path")
const router = express.Router()

// VARIABLES //
const { products } = require('./admin')

router.get("/", (req, res, next) => {

    res.render('shop/index', {
        products: products, 
        pageTitle: 'Shop', 
        path: "/",
        hasProduct: products.length > 0,
        activeShop: true,
        productCSS:true,
        shopCSS:true
    });
    // res.sendFile(path.join(rootDir, "views/shop", "index.html"))
})

module.exports = router
