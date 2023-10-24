import { Router } from "express";
import ProductManager from "../dao/database/productManager.js";
import { productModel } from "../dao/models/product.model.js";
import { cartModel } from "../dao/models/cart.model.js";
import CartManager from "../dao/database/cartManager.js";
import publicRoutes from "../middlewares/publicRoutes.js";
import privateRoutes from "../middlewares/privateRoutes.js";
import bcrypt from "bcrypt";

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

router.get("/products", privateRoutes, async (req, res) => {
  try {
    const options = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
      sort: req.query.sort || {},
    };

    const { first_name, last_name, email, age } = req.session;

    const products = await productManager.getProducts({}, options);

    res.render("products", { first_name, last_name, products });
  } catch (error) {
    console.error("Error al obtener y renderizar productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/carts/:cid", privateRoutes, async (req, res) => {
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

router.get("/login", publicRoutes, (req, res) => {
  res.render("login");
});

router.get("/signup", publicRoutes, (req, res) => {
  res.render("signup");
});

router.get("/profile", privateRoutes, (req, res) => {
  const { first_name, last_name, email, age, rol } = req.session;

  res.render("profile", { first_name, last_name, email, age, rol });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

router.get("/recover", publicRoutes, (req, res) => {
  res.render("recover");
});

router.get("/loginJwt", publicRoutes, (req, res) => {
  res.render("loginJwt");
});

export default router;
