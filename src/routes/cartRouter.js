import { Router } from "express";
//import CartManager from "../dao/filesystem/CartManager.js";
import CartManager from "../dao/database/cartManager.js";
import ProductManager from "../dao/filesystem/ProductManager.js";

const cartManager = new CartManager();
const productManager = new ProductManager();
const router = Router();

router.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.json(carts);
  } catch (error) {
    restart.status(500).json({ error: "Not found" });
  }
});

router.post("/", async (req, res) => {
  const newCart = await cartManager.createCart();

  res.status(200).json(newCart);
});

router.get("/:cid", async (req, res) => {
  const id = req.params.cid;
  const findCartId = await cartManager.getCartsById(id);

  if (!findCartId) {
    res.status(404).send("Carrito no encontrdo");
  } else {
    res.status(200).send(findCartId);
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
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
