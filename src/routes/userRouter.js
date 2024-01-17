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
  getAllUsers,
  deleteInactiveUsers,
  adminDelete,
  updateRolByAdmin,
} from "../controllers/user.controller.js";
import { isAdmin } from "../middlewares/currentAuth.js";

const router = Router();

router.get("/users", getAllUsers);

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
router.delete("/users", deleteInactiveUsers);
router.delete("/adminDelete/:uid", isAdmin, adminDelete);
router.put("/updateUserRol/:uid", isAdmin, updateRolByAdmin);

export default router;
