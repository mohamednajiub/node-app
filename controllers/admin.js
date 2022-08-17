const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        }).catch(error => {
            console.log(error)
        })
};

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({ title, price, description, imageUrl })

    product.save()
        .then((result) => {
            res.redirect('/admin/products');
        }).catch((error) => {
            console.log(error)
        })
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit

    if (!editMode) {
        return res.redirect('/')
    }

    const prodId = req.params.productId
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/')
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/add-product',
                editing: editMode,
                product: product
            });
        })
        .catch(error => {
            console.log(error)
        })
};

exports.postEditProduct = (req, res, next) => {
    const id = req.body.id;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product(title, price, description, imageUrl, id)
    product.save()
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(error => {
            console.log(error)
        })
};

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productId;
    Product.delete(id)
        .then(() => {
            res.redirect('/admin/products');
        }).catch(error => {
            console.log(error)
        })
};
