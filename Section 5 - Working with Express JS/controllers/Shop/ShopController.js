const debug = require('debug')('http:shopController')
const Product = require("../../models/product")
const Cart = require("../../models/cart")
const {debugControllerLog, debugControllerError} = require('../../utils/debugger')

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
        .then(([rows]) => {
            debugControllerLog("SQL Finished")
            res.render("shop/product-list", {
                products: rows,
                pageTitle: "Products",
                path: "/products",
                hasProduct: rows.length > 0
            })
        })
        .catch()
}

exports.getProductDetail = (req, res, next) => {
    const productId = req.params.productId

    Product.findById(productId)
        .then(([product]) => {
            debugControllerLog('Succesfully fetch product', product[0])
            if(product.length > 0) {
                res.render("shop/product-detail", {
                    pageTitle: "Product Detail",
                    path: "/products",
                    product: product[0]
                })
            } else 
                next()
            
        })
        .catch(e => debugControllerError('Failed fetching Product with id: %o', productId))
}

// CART SECTION
exports.getCart = (req, res, next) => {
    Cart.getCart()
        .then(cart => {
            Product.fetchAll(products => {
                let cartProducts = []
                for (product of products) {
                    const cartProductData = cart.products.find(prod => prod.id === product.id)
                    if (cartProductData) {
                        cartProducts.push({productData: product, qty: cartProductData.qty})
                    }
                }
                res.render("shop/cart", {
                    pageTitle: "Cart",
                    path: "/cart",
                    products: cartProducts
                })
            })
        })
        .catch(e => {
            debugControllerError("failed get cart", e)
            res.redirect("/")
        })
}

exports.postAddToCart = (req, res, next) => {
    const productId = req.body.productId
    Product.findById(productId)
        .then(product => {
            debug(" Product add to cart", product)
            Cart.addProduct(product.id, product.price)
        })
        .then(() => {
            debug("Redirecting to /cart")
            res.redirect('/cart')
        })
}


// CHECKOUT SECTION
exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        pageTitle: "Checkout",
        path: "/checkout"
    })
}

// ORDER SECTION
exports.getOrders = (req, res, next) => {
    res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders"
    })
}