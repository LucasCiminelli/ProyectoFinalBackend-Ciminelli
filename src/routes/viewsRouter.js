import { Router } from "express";
import ProductManager from "../dao/database/productManager.js";
import { productModel } from "../dao/models/product.model.js";
import { cartModel } from "../dao/models/cart.model.js";
import CartManager from "../dao/database/cartManager.js";

const productManager = new ProductManager();
const cartManager = new CartManager();
const router = Router();

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {});
});

router.get("/chat", (req, res) => {
  res.render("chat", {});
});

router.get("/products", async (req, res) => {
  try {
    const options = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
      sort: req.query.sort || {},
    };

    const products = await productManager.getProducts({}, options);

    res.render("products", { products });
  } catch (error) {
    console.error("Error al obtener y renderizar productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/carts/:cid", async (req, res) => {
  const cid = req.params.cid;

  try {
    const cart = await cartManager.getCartsById(cid);

    if (!cart) {
      res.status(404).send("Carrito no encontrado");
      return;
    }

    const cartProducts = cart.products.map((prod) => ({
      title: prod.product.title,
      quantity: prod.quantity,
    }));

    res.render("cart", { products: cartProducts });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});
export default router;
