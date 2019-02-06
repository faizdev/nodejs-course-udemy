const Product = require("../../models/product")
const {
    debugControllerLog,
    debugControllerError
} = require('../../utils/debugger')

exports.getProducts = (req, res, next) => {
    req.user.getProducts()
        .then(products => {
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

    // console.log(req.body.productId)
    req.user.createProduct({
            title: title,
            imageUrl: imageUrl,
            price: price,
            description: description
        })
        .then(result => {
            debugControllerLog("Sequelize insert succeed")
        })
        .catch(err => debugControllerError('Sequelize insert product failed', err))
    res.redirect(301, "/admin/products")
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit
    req.user.getProducts({where: {id: req.params.productId}})
        .then(products => {
            const product = products[0]
            debugControllerLog("Fetching product for editing", product)
            if(product) {
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

    req.user.getProducts({where: {id:productId}})
        .then(product => {
            product.title = title
            product.imageUrl = imageUrl
            product.price = price
            product.description = description
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
    req.user.getProducts({where: {id:productId}})
        .then(products => {
            const product = products[0]
            if(product)
                return product.destroy()
            else 
                next()
        })
        .then(result => {
            debugControllerLog("Product deleted successfully")
            res.redirect('/admin/products')
        })
        .catch(e => debugControllerError("Deleting product failed", e))
}