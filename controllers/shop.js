const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getProduct = (req, res, next) => {

  const productID= req.params.productID;
  Product.findProductByID(productID,(product) => {
    res.render('shop/product-detail',{
      pageTitle: product.title,
      path: '/products',
      product: product,
  
    });
  })
  
  
};


exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart'
  });
};
exports.addToCart = (req,res,next) =>{
console.log('Product Added: ', req.body.productID);
Cart.addProduct(req.body.productID);


res.render('shop/cart', {
  path: '/cart',
  pageTitle: 'Your Cart'
});
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
