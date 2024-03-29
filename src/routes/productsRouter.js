import { Router } from "express";
import { uploader } from "../middlewares/multer.js";
import { isAdmin, isPremium } from "../middlewares/currentAuth.js";
import { addLogger } from "../utils/logger.js";

import {
  getProducts,
  getProductsById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsMocks,
} from "../controllers/product.controller.js";

const router = Router();

router.use(addLogger);

router.get("/", getProducts);
router.get("/mockingproducts", getProductsMocks);
router.get("/:pid", getProductsById);
router.post("/", uploader.single("file"), isAdmin, isPremium, createProduct);
router.put("/:pid", updateProduct);
router.delete("/:pid", isAdmin, isPremium, deleteProduct);

export default router;
