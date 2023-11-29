import { Router } from "express";
import { isUser } from "../middlewares/currentAuth.js";
import { addLogger } from "../utils/logger.js";

import {
  getCarts,
  getCartsById,
  createCart,
  addProductToCart,
  deleteProductInCart,
  updateProductsInCart,
  updateQuantityProdInCart,
  deleteCart,
} from "../controllers/cart.controller.js";

const router = Router();

router.use(addLogger);

router.get("/", getCarts);
router.post("/", createCart);
router.get("/:cid", getCartsById);
router.post("/:cid/product/:pid", isUser, addProductToCart);
router.delete("/:cid/product/:pid", deleteProductInCart);
router.put("/:cid", updateProductsInCart);
router.put("/:cid/product/:pid", updateQuantityProdInCart);
router.delete("/:cid", deleteCart);
router.post("/:cid/purchase");

export default router;
