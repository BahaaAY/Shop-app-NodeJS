
const fs = require('fs');
const path = require('path');
const { findProductByID, deleteProductByID } = require('./product');
const Product = require('./product');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);


module.exports = class Cart {
    static getCart(cb) {

        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [] };
            if (!err) {
                cart = JSON.parse(fileContent);
                if (!cart.products) {
                    cart = { products: [] };
                }
                console.log("CartCartjs: ", cart);
                
                let cartProducts = { products: [] };
                if(cart.products.length>0)
                {
                    Product.fetchAll((products)=>{
                        const cartProducts = [];
                        for(let product of products ){
                            const cartProductData = cart.products.find(prod => prod.id == product.id);
                            if(cartProductData)
                            {
                                cartProducts.push({productData: product,qty: cartProductData.qty});
                            }

                        }
                        cb(cartProducts);
                    });
                    // console.log(cart.products.length, "Items in cart");
                    // for (let i=0;i< cart.products.length;i++) {
                    //     var product = cart.products[i];
                    //     console.log("item:", product );

                    //     Product.findProductByID(product.id, (currProductData) => {
                    //         console.log("Find CallBack!!");
                    //         cartProducts.products.push({ productData: currProductData, productQty: product.qty });
                    //         if(i==cartProducts.products.length-1) //Check if last element
                    //         {
                    //            // cb(cartProducts);
                    //         }
                    //      });
                    // }
                }else
                {
                    console.log("No Items in Cart!");
                    cb(cartProducts);
                }
                
            } else {
                console.log('Error Reading Cart.json', err.message);
            }



        });
    }
    static getCartPrice(cartProducts)
    {
        var total = 0.0;
        for(let product of cartProducts)
        {
            total =total + +product.productData.price * product.qty;
        }
        return total;
    }

    static addProduct(id) {

        fs.readFile(p, (err, fileContent) => {
            //Get old CART if exists else get empty cart
            let cart = { products: [] };
            if (!err) {
                cart = JSON.parse(fileContent);
                if (!cart.products) {
                    cart = { products: [] };
                }
                console.log("Cart: ", cart);
            } else {
                console.log('Error Reading Cart.json', err.message);
            }
            //Check if product already exitst
            var productExists = false;
            for (let i = 0; i < cart.products.length; i++) {
                if (cart.products[i].id == id) {
                    console.log('Product already exists');
                    cart.products = [...cart.products];
                    cart.products[i].qty += 1;
                    productExists = true;
                    fs.writeFile(p, JSON.stringify(cart), (err) => {
                        console.log('Error Writing Cart: ', err.message);
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
    static deleteProductByID(id, successCB, errCB) {
        fs.readFile(p, (err, fileContent) => {

            if (err) {
                console.log('Error Reading Cart!');
                errCB();
            } else {
                let cart = JSON.parse(fileContent);
                console.log("D Cart: ", cart);
                let updatedCart = cart.products.filter(product => product.id != id);
                console.log('New Cart D: ', updatedCart);
                fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
                    console.log('Error Writing Cart: ', err);
                    errCB();
                });
                successCB();

            }

        });

    }




};