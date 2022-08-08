const products = [];

exports.getAddProduct = (req, res, next) => {
    res.render("add-product", {
        docTitle: "Add Product",
        path: "/admin/add-product",
        activeAddProduct: true,
    });
}

exports.postAddProduct = (req, res, next) => {
    products.push({ title: req.body.title });
    res.redirect("/");
}

exports.getProducts = (req, res, next) => {
    res.render("shop", {
        products: products,
        docTitle: "Shop",
        path: "/",
        hasProducts: products.length > 0,
        activeShop: true,
    });
}

