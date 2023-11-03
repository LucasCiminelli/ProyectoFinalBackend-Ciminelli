import { Router } from "express";
import UserManager from "../dao/database/userManager.js";
import passport from "passport";
import {
  signupLocal,
  loginLocal,
  recoverLocal,
  githubLogin,
  loginJwt,
  getCookies,
  current,
} from "../controllers/user.controller.js";



const router = Router();


router.post(
  "/signup",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  signupLocal
);
router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/login" }),
  loginLocal
);
router.post("/recover", recoverLocal);
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/login",
  }),
  githubLogin
);
router.post("/loginJwt", loginJwt);
router.get("/cookies", getCookies);
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  current
);

export default router;
