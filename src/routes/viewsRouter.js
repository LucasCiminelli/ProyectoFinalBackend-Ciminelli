import { Router } from "express";
import ProductManager from "../ProductManager.js";
import { Server } from "socket.io";

const productManager = new ProductManager();
const router = Router();

const viewsRouter = (io) => {
  router.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("home", { products });
  });

  io.on("connection", (socket) => {
    console.log("se conecto un cliente");
  });

  return router;
};
export default viewsRouter;
