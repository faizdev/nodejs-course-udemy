// # REQUIRES # -------------

    const express = require("express")
    const router = express.Router()

// # CONTROLLERS # -------------

    const shopController = require('../controllers/shop/ShopController')


// # ROUTERS # -------------

    // /shop or /  => GET
    router.get("/", shopController.getIndex)

    // /products  => GET
    router.get("/products", shopController.getProducts)

    // /product-detail  => GET
    router.get("/product/:productId", shopController.getProductDetail)

    // /cart  => GET
    router.get("/cart", shopController.getCart)

    // /cart  => POST
    router.post("/cart", shopController.postAddToCart)

    // /orders  => GET
    router.get("/orders", shopController.getOrders)

    // /checkout  => GET
    router.get("/checkout", shopController.getCheckout)

    module.exports = router
