import { Router } from "express";
import ProductManager from "../ProductManager.js";

const productManager = new ProductManager();
const router = Router();

router.get("/", async (req, res) => {
  const limit = req.query.limit;
  const products = await productManager.getProducts();

  if (limit) {
    return res.send(products.slice(0, limit));
  }
  return res.send(products);
});

router.get("/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid, 10);
  const product = await productManager.getProductsById(productId);

  if (product === undefined) {
    return res.status(404).send();
  }

  res.send(product);
});

router.post("/", async (req, res) => {
  const uniqueId = productManager.generateUniqueId();

  try {
    const { title, description, code, price, stock, category, thumbnails } =
      req.body;

    if (
      !title ||
      !description ||
      !code ||
      !price ||
      !stock ||
      !category ||
      !thumbnails
    ) {
      return res.status(400).send("Faltan completar campos obligatorios");
    }

    const product = {
      id: uniqueId,
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails: thumbnails || [],
      status: true,
    };

    await productManager.addProduct(product);

    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).send("Producto no agregado");
  }
});

router.put("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid, 10);
  const prodActualizado = req.body;

  const updatedProduct = await productManager.updateProduct(
    id,
    prodActualizado
  );

  if (updatedProduct) {
    res.status(200).send(updatedProduct);
  } else {
    res.status(404).send("producto no encontrado");
  }
});

router.delete("/:pid", async (req, res) => {
  const prodId = parseInt(req.params.pid, 10);

  const deletedProduct = await productManager.deleteProduct(prodId);

  if (deletedProduct) {
    res.status(200).send(`Producto Eliminado Correctamente: ${deletedProduct}`);
  } else {
    res.status(404).send("Producto no encontrado");
  }
});

export default router;
