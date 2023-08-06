
const fs = require('fs');
const path = require('path');
const { findProductByID } = require('./product');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);


module.exports = class Cart {

    static addProduct(id) {

        fs.readFile(p, (err, fileContent) => {
            //Get old CART if exists else get empty cart
            let cart = { products: [] };
            if (!err) {
                cart = JSON.parse(fileContent);
                console.log("Cart: ", cart);
            } else {
                console.log('Error Reading Cart.json', err.message);
            }
            //Check if product already exitst
            var productExists = false;
            for (let i = 0; i < cart.products.length; i++) {
                if (cart.products[i].id == id) {
                    console.log('Product already exists');
                    cart.products=[...cart.products];
                    cart.products[i].qty +=1;
                    productExists = true;
                    fs.writeFile(p, JSON.stringify(cart), (err) => {
                        console.log('Error Writing Cart: ', err);
                    });
                    break;
                }

            }
            if (!productExists) {
                console.log('product doesnt exist!');
                let newProduct;
                //Verify that product to be added is a real product!
                findProductByID(id, (product) => {
                    newProduct = { ...product };
                    console.log('new Product: ', newProduct);
                    cart.products = [...cart.products, { id: newProduct.id, qty: 1 }];
                    console.log("New Cart: ", cart);
                    fs.writeFile(p, JSON.stringify(cart), (err) => {
                        console.log('Error Writing Cart: ', err);
                    });
                });

            }

        });

    }



};