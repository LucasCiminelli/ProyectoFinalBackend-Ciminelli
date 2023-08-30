import { Router } from "express";
import CartManager from "../CartManager.js";
import ProductManager from "../ProductManager.js";

const cartManager = new CartManager();
const productManager = new ProductManager();
const router = Router();

router.post("/", async (req, res) => {
  const newCart = await cartManager.createCart();

  res.status(200).json(newCart);
});

router.get("/:cid", async (req, res) => {
  const id = parseInt(req.params.cid, 10);
  const findCartId = await cartManager.getCartsById(id);

  if (!findCartId) {
    res.status(404).send("Carrito no encontrdo");
  } else {
    res.status(200).send(`Carrito: ${findCartId}`);
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cid = parseInt(req.params.cid, 10);
  const pid = parseInt(req.params.pid, 10);
  const quantity = req.body.quantity;

  const findCart = await cartManager.getCartsById(cid);

  if (!findCart) {
    res.status(404).send("Carrito no encontrado");
  }

  const findProd = await productManager.getProductsById(pid);

  if (!findProd) {
    res.status(404).send("Producto no encontrado");
  }

  const addProdToCart = await cartManager.addProductToCart(cid, pid, quantity);

  if (addProdToCart) {
    res.status(200).send("Producto añadido al carrito correctamente");
  } else {
    res.status(500).send("Error al agregar producto al carrito");
  }
});

export default router;
