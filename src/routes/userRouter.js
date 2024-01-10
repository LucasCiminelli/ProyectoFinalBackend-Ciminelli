import { Router } from "express";
import passport from "passport";
import {
  signupLocal,
  loginLocal,
  recoverLocal,
  githubLogin,
  loginJwt,
  getCookies,
  current,
  userToPremium,
  uploadUserDocuments,
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

router.post("/premium/:uid", userToPremium);
router.post("/:uid/documents", uploadUserDocuments);

export default router;
