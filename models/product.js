const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id,title, imageUrl, description, price) {
    if(id)
    {
      this.id =id;
    }else
    {
      this.id = Math.floor(Math.random()*20000000000);
    }
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
  static editProduct(editedProduct, successCB, errCB)
  {
    this.fetchAll((products)=>{
      let newProducts = [...products];
      var productExists = false;
      for(let i=0; i<newProducts.length;i++)
      {
        if(newProducts[i].id == editedProduct.id)
        {
          newProducts[i] = {...editedProduct};
          productExists = true;
          break;
        }
      }
      if(productExists)
      {
        fs.writeFile(p, JSON.stringify(newProducts), err => {
          console.log(err);
        });
        successCB();
      }else
      {
        errCB('Product Not Found!');
      }
    });
    
  }

  static findProductByID(id, cb)
  {
    getProductsFromFile((products)=>{
      products.forEach(p => {
        if(p.id == id)
        {
          cb(p);
          return false; 
        }
        
      });
      
    });
  }
};
