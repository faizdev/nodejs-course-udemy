const mongodb = require('mongodb')
const Product = require("../../models/product")

const {
    debugControllerLog,
    debugControllerError
} = require('../../utils/debugger')

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            debugControllerLog("Fetching product")
            res.render("admin/products", {
                products: products,
                pageTitle: "Admin Products",
                path: "/admin/products",
            })
        }).catch(err => {
            debugControllerError("Fetching products error")
        })
}

exports.getAddProduct = (req, res, next) => {
    debugControllerLog("Opening page get add product")
    res.render("admin/add-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product"
    })
}

exports.postAddProduct = (req, res, next) => {
    const productId = req.body.productId
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description
    const product = new Product({
        title: title, 
        price: price,
        description: description,
        imageUrl: imageUrl
    })

    product.save()
        .then(result => {
            debugControllerLog("Sequelize insert succeed")
        })
        .catch(err => debugControllerError('Sequelize insert product failed', err))
    res.redirect(301, "/admin/products")
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit
    const productId = req.params.productId
    Product.findById(productId)
        .then(product => {
            debugControllerLog("Fetching product for editing", product)
            if (product) {
                debugControllerLog('Product: ', product)
                res.render("admin/edit-product", {
                    pageTitle: "Edit Product",
                    path: "/admin/products",
                    product: product
                })
            } else
                next()

        })
        .catch(
            e => {
                debugControllerError('fetching:', e)
                res.redirect('admin/products')
            })
}

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description

    Product.findById(productId)
        .then(productData => {
            const product = new Product(title, price, description, imageUrl, new mongodb.ObjectID(productId))
            return product.save()
        })
        .then(result => {
            debugControllerLog("Product updated successfully")
            res.redirect(`/admin/products`)
        })
        .catch(err => debugControllerError("Fetch product failed", err))

}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId
    Product.deleteById(productId)
        .then(result => {
            debugControllerLog("Product deleted successfully")
            res.redirect('/admin/products')
        })
        .catch(e => debugControllerError("Deleting product failed", e))
}