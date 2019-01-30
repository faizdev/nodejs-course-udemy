const express = require("express")
const router = express.Router()

const productsController = require('../controllers/products')

// # ROUTERS # -------------

// /shop or /
router.get("/", productsController.getProducts)

module.exports = router
