import { Router } from "express";
import { uploader } from "../middlewares/multer.js";
import { isAdmin } from "../middlewares/currentAuth.js";

import {
  getProducts,
  getProductsById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsMocks,
} from "../controllers/product.controller.js";

const router = Router();

router.get("/", getProducts);
router.get("/mockingproducts", getProductsMocks);
router.get("/:pid", getProductsById);
router.post("/", isAdmin, uploader.single("file"), createProduct);
router.put("/:pid", isAdmin, updateProduct);
router.delete("/:pid", isAdmin, deleteProduct);

export default router;
