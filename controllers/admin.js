const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null,title,imageUrl,description,price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const productID = req.query.productID;
  if (productID) {
    console.log("Product ID: ", productID);
    Product.findProductByID(productID, (product) => {
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        formsCSS: true,
        productCSS: true,
        product: product
      });
    });

  } else {
    res.redirect('/');

  }
};
exports.postEditProduct = (req, res, next) => {
  console.log('PostEdit');
  const productID = req.body.productID;
  const newTitle = req.body.title;
  const newImgUrl = req.body.imageUrl;
  const newPrice = req.body.price;
  const newDesc = req.body.description;
  Product.editProduct(new Product(productID, newTitle, newImgUrl, newDesc, newPrice), () => {

    Product.fetchAll(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
  }, (err) => {
    console.log(err);
  })

};
exports.postDeleteProduct = (req, res, next) => {
  const productID = req.body.productID;
  console.log('id: ' , productID);
  Product.deleteProductByID(productID,()=>{
    console.log('Deletion Done!');
    res.redirect('products');
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};
