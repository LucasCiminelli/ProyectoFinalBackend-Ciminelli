import { Router } from "express";
import ProductManager from "../dao/database/productManager.js";
//import ProductManager from "../dao/filesystem/ProductManager.js";
import { uploader } from "../middlewares/multer.js";

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
  const productId = req.params.pid;
  const product = await productManager.getProductsById(productId);

  if (product === undefined) {
    return res.status(404).send();
  }

  res.send(product);
});

router.post("/", uploader.single("file"), async (req, res) => {
  try {
    const product = req.body;

    if (
      !product.title ||
      !product.description ||
      !product.code ||
      !product.price ||
      !product.stock ||
      !product.category ||
      !product.thumbnails
    ) {
      return res.status(400).send("Faltan completar campos obligatorios");
    }

    await productManager.addProduct({ ...product, status: true });
    const products = await productManager.getProducts();
    req.context.socketServer.emit("update_products", products);

    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).send("Producto no agregado");
  }
});

router.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const prodActualizado = req.body;

  const updatedProduct = await productManager.updateProduct(
    id,
    prodActualizado
  );
  const products = await productManager.getProducts();
  req.context.socketServer.emit("update_products", products);

  if (updatedProduct) {
    res.status(200).send(updatedProduct);
  } else {
    res.status(404).send("producto no encontrado");
  }
});

router.delete("/:pid", async (req, res) => {
  const prodId = req.params.pid;

  const deletedProduct = await productManager.deleteProduct(prodId);
  const products = await productManager.getProducts();
  req.context.socketServer.emit("update_products", products);

  if (deletedProduct) {
    res.status(200).send(`Producto Eliminado Correctamente.`);
  } else {
    res.status(404).send("Producto no encontrado");
  }
});

export default router;
