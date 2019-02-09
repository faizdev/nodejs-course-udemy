const debug = require('debug')('http:shopController')
const Product = require("../../models/product")

const {
    debugControllerLog,
    debugControllerError
} = require('../../utils/debugger')

exports.getIndex = (req, res, next) => {
    debug("Woooyeah")
    res.render("shop/index", {
        pageTitle: "Shop",
        path: "/"
    })
}

exports.getProducts = (req, res, next) => {
    debugControllerLog("Fetching product")
    Product.fetchAll()
        .then(products => {
            res.render("shop/product-list", {
                products: products,
                pageTitle: "Products",
                path: "/products",
            })
        }).catch(err => {
            debugControllerError("Fetching products error")
        })
}

exports.getProductDetail = (req, res, next) => {
    const productId = req.params.productId

    Product.findById(productId)
        .then(product => {
            console.log(product)
            if (!product) {
                next()
            } else {
                debugControllerLog('Succesfully fetch product')
                res.render("shop/product-detail", {
                    pageTitle: "Product Detail",
                    path: "/products",
                    product: product
                })
            }

        })
        .catch(e => debugControllerError('Failed fetching Product with id: %o', e))
}

// // CART SECTION
exports.getCart = (req, res, next) => {

    req.user.getCart()
        .then(products => {
            debugControllerLog(products)
            res.render("shop/cart", {
                pageTitle: "Cart",
                path: "/cart",
                products: products
            })
        })
        .catch(err => {
            debugControllerError("Fetching cart failed", err)
            next()
        })
}

exports.postAddToCart = (req, res, next) => {
    const productId = req.body.productId
    debugControllerLog("Add to cart: ",productId)
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product)
        })
        .then(result => {
            debugControllerLog("success add product to cart", result)
            res.redirect('/cart')
        })
}

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId
    req.user.deleteItemFromCart(productId)
        .then(result => {
            res.redirect('/cart')
        })
        .catch(err => debugControllerError("fetch cart failed", err))
}


// // CHECKOUT SECTION
// exports.getCheckout = (req, res, next) => {
//     res.render("shop/checkout", {
//         pageTitle: "Checkout",
//         path: "/checkout"
//     })
// }

// // ORDER SECTION
exports.getOrders = (req, res, next) => {
    req.user.getOrders()
        .then(orders => {
            // orders.forEach((order) => {
            //     console.log(order)
            // })
            res.render("shop/orders", {
                pageTitle: "Orders",
                path: "/orders",
                orders: orders
            })
        })
        .catch(err => {
            debugControllerError("Get Order error", err)
        })
}

exports.postOrder = (req, res, next) => {
    let fetchedCart
    req.user.addOrder()
        .then(result => {
            res.redirect('/orders')
        })
        .catch(err => debugControllerError("Post Order error", err))
}
