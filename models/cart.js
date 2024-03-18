const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    try {
      // Fetch the previous cart synchronously
      let fileContent = fs.readFileSync(p, 'utf8');
      let cart = { products: [], totalPrice: 0 };

      // Check if file content is not empty
      if (fileContent) {
        cart = JSON.parse(fileContent);
      }

      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        prod => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;

      // Write updated cart back to file
      fs.writeFileSync(p, JSON.stringify(cart));
    } catch (error) {
      console.log('Error reading or writing cart file:', error);
    }
  }
};
