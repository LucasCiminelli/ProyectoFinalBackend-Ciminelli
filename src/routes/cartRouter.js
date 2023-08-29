import { Router } from "express";
import CartManager from "../CartManager.js";

const cartManager = new CartManager();
const router = Router();

router.post("/", async (req, res) => {
  const newCart = await cartManager.createCart();

  res.status(200).json(newCart);
});

router.get("/:cid", async (req, res) => {
  const id = parseInt(req.params.cid);
  const findCartId = await cartManager.getCartsById(id);

  if (!findCartId) {
    res.status(404).send("Carrito no encontrdo");
  } else {
    res.status(200).send(`Carrito: ${findCartId}`);
  }
});

router.post("/:cid/product/:pid", (req, res) => {
    


});

export default router;
