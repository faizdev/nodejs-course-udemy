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
    req.user.getProducts()
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

    req.user.getProducts({
            where: {
                id: productId
            }
        })
        .then(products => {
            const product = products[0]
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

// CART SECTION
exports.getCart = (req, res, next) => {

    req.user.getCart()
        .then(cart => {
            return cart.getProducts()
        })
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
    let fetchedCart
    let newQuantity = 1
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart
            return cart.getProducts({
                where: {
                    id: productId
                }
            })
        })
        .then(products => {
            let product
            if (products.length > 0) {
                product = products[0]
            }
            if (product) {
                const oldQuantity = product.cartItem.quantity
                newQuantity = oldQuantity + 1
                return product
            }
            return Product.findById(productId)
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: {
                    quantity: newQuantity
                }
            })
        })
        .then(() => {
            res.redirect('/cart')
        })
        .catch(err => debugControllerError("failed get cart", err))
}

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({where: {id:productId}})
        })
        .then(products => {
            const product = products[0]
            return product.cartItem.destroy()
        })
        .then(result => {
            res.redirect('/cart')
        })
        .catch(err => debugControllerError("fetch cart failed", err))
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
    req.user.getOrders({include: ['products']})
        .then(orders => {
            orders.forEach((order) => {
                console.log(order)
            })
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
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart
            return cart.getProducts()
        })
        .then(products => {
            return req.user
                .createOrder()
                .then(order => {
                    return order.addProduct(products.map(product => {
                        product.orderItem = {quantity: product.cartItem.quantity}
                        return product
                    }))
                })
                .then(result => {
                    return fetchedCart.setProducts(null)
                })
                .then(result => {
                    res.redirect('/orders')
                })
                .catch(err => {
                    debugControllerError("create order fails", err)
                })
        })
        .catch(err => debugControllerError("Post Order error", err))
}
