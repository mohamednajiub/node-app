const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {

      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    }).catch(error => {
      console.log(error)
    })

};


exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    }).catch(error => {
      console.log(error)
    })
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/product-detail'
      });
    }).catch(error => {
      console.log(error)
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(error => {
      console.log(error)
    })
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product)
    }).then(result => {
      res.redirect('/cart')
    }).catch(error => {
      console.log(error)
    })
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart')
    })
    .catch(error => {
      console.log(error)
    })
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders()
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(error => {
      console.log(error)
    })
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(product => {
        return { quantity: product.quantity, product: { ...product.productId._doc } }
      })

      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user._id
        },
        products: products
      })

      return order.save()
    }).then(result => {
      return req.user.clearCart()
    }).then(result => {
      res.redirect('/orders')
    }).catch(error => {
      console.log(error)
    })
};
