import { Router } from "express";
import publicRoutes from "../middlewares/publicRoutes.js";
import privateRoutes from "../middlewares/privateRoutes.js";
import { isUser, isAdmin } from "../middlewares/currentAuth.js";
import jwtAuthMiddleware from "../middlewares/jwtAuth.js";
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
  renderControlPanel,
} from "../controllers/views.controller.js";

const router = Router();

router.get("/", renderHome);
router.get("/realtimeproducts", RenderRealTimeProducts);
router.get("/chat", isUser, renderChat);
router.get("/products", jwtAuthMiddleware, privateRoutes, renderProducts);
router.get("/carts/:cid", jwtAuthMiddleware, privateRoutes, renderCart);
router.get("/login", publicRoutes, renderLogin);
router.get("/signup", publicRoutes, renderSignup);
router.get("/profile", privateRoutes, renderProfile);
router.get("/logout", destroySession);
router.get("/recover", publicRoutes, renderRecover);
router.get("/loginJwt", publicRoutes, renderLoginJwt);
router.get("/adminControlPanel", isAdmin, renderControlPanel);

export default router;
