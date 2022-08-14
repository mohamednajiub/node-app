const Product = require('../models/product');

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
    req.user.createProduct(
        {
            title,
            description,
            price,
            imageUrl
        })
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
    req.user.getProducts({ where: { id: prodId } })
        // Product.findByPk(prodId)
        .then(products => {
            const product = products[0]
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
    Product.findByPk(id)
        .then(product => {
            product.title = title,
                product.imageUrl = imageUrl,
                product.price = price;
            product.description = description
            return product.save()
        }).then(result => {
            res.redirect('/admin/products');
        })
        .catch(error => {
            console.log(error)
        })
};

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productId;
    Product.destroy({
        where: {
            id: id
        }
    }).then(result => {
        res.redirect('/admin/products');
    }).catch(error => {
        console.log(error)
    })
};

exports.getProducts = (req, res, next) => {
    req.user.getProducts()
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
