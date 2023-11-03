import { Router } from "express";
import publicRoutes from "../middlewares/publicRoutes.js";
import privateRoutes from "../middlewares/privateRoutes.js";
import {
  renderHome,
  RenderRealTimeProducts,
  renderChat,
  renderProducts,
  renderCart,
  renderLogin,
  renderSignup,
  renderProfile,
  destroySession,
  renderRecover,
  renderLoginJwt,
} from "../controllers/views.controller.js";

const router = Router();

router.get("/", renderHome);
router.get("/realtimeproducts", RenderRealTimeProducts);
router.get("/chat", renderChat);
router.get("/products", privateRoutes, renderProducts);
router.get("/carts/:cid", privateRoutes, renderCart);
router.get("/login", publicRoutes, renderLogin);
router.get("/signup", publicRoutes, renderSignup);
router.get("/profile", privateRoutes, renderProfile);
router.get("/logout", destroySession);
router.get("/recover", publicRoutes, renderRecover);
router.get("/loginJwt", publicRoutes, renderLoginJwt);

export default router;
