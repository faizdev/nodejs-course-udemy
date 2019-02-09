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

    // // /product-detail  => GET
    router.get("/product/:productId", shopController.getProductDetail)

    // // /cart  => GET
    router.get("/cart", shopController.getCart)

    // // /cart  => POST
    router.post("/cart", shopController.postAddToCart)

    // // /cart/delete-product  => POST
    router.post("/cart/delete-product", shopController.postCartDeleteProduct)

    // // /orders  => GET
    router.get("/orders", shopController.getOrders)

    // // /orders  => POST
    router.post("/create-order", shopController.postOrder)

    // // /checkout  => GET
    // router.get("/checkout", shopController.getCheckout)

    module.exports = router
