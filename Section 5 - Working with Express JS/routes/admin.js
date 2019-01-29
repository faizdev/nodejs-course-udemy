const express = require("express")
const path = require('path')
const rootDir = require('../utils/path')

const router = express.Router()

// VARIABLES //
let products = []

router.get("/add-product", (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle : "Add Product", 
        path: "/admin/add-product",
        activeProduct: true,
        productCSS:true,
        formsCSS: true
    })
})

router.post("/add-product", (req, res, next) => {
    products.push({title: req.body.title})
    res.redirect('/')
})

exports.routes = router
exports.products = products
