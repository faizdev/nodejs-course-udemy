const Product = require("../../models/product")
const {debugControllerLog, debugControllerError} = require('../../utils/debugger')

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render("admin/products", {
            products: products,
            pageTitle: "Admin Products",
            path: "/admin/products",
            hasProduct: products.length > 0
        })
    })
}

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
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
    const product = new Product(productId ,title, imageUrl, description, price)
    // res.json(product)

    product.save()
    res.redirect(301,"/admin/products")
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit
    Product.findById(req.params.productId)
        .then(product => {
            debugControllerLog('Product: ',product)
            res.render("admin/edit-product", {
                pageTitle: "Edit Product",
                path: "/admin/products",
                product: product
            })
        })
        .catch(
            e=>{
                debugControllerError('fetching:',e)
                res.redirect('admin/products')
        })
}

exports.postEditProduct = (req, res, next) => {
    const productId = req.params.productId
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description

    const product = new Product(productId, title, imageUrl, description, price)
    product.save()

    res.redirect(`admin/edit-product/${productId}`)
}

exports.postDeleteProduct = (req, res, next) => {
    res.redirect("admin/products")
}