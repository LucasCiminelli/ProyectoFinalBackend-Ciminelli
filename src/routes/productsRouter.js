import { Router } from "express";
import { uploader } from "../middlewares/multer.js";

import {
  getProducts,
  getProductsById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";


const router = Router();

router.get("/", getProducts);
router.get("/:pid", getProductsById);
router.post("/", uploader.single("file"), createProduct);
router.put("/:pid", updateProduct);
router.delete("/:pid", deleteProduct);


export default router;
