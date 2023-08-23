const express = require("express");
const ProductManager = require("./ProductManager.js");
const productManager = new ProductManager();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
  const limit = req.query.limit;
  const products = await ProductManager.getProducts();

  if (limit) {
    return res.send(products.slice(0, limit));
  }
  return res.send(products);
});

app.get("/products/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid, 10);
  const product = await ProductManager.getProductsById(productId);

  res.send(product);
});
