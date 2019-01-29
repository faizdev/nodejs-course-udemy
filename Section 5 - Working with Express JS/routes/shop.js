const express = require("express")
const path = require("path")
const rootDir = require("../utils/path")
const router = express.Router()

// VARIABLES //
const { products } = require('./admin')

router.get("/", (req, res, next) => {

    res.render('shop/index', {products: products, pageTitle: 'Shop', path: "/"});
    // res.sendFile(path.join(rootDir, "views/shop", "index.html"))
})

module.exports = router
