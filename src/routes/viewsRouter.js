import { Router } from "express";
import ProductManager from "../dao/filesystem/ProductManager.js";

const productManager = new ProductManager();
const router = Router();

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {});
});

router.get("/chat", async (req, res) => {
  res.render("chat", {});
});

export default router;
