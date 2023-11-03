import UserManager from "../dao/database/userManager.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const userManager = new UserManager();

export const signupLocal = async (req, res) => {
  return res.redirect("/login");
};

export const loginLocal = async (req, res) => {
  req.session.first_name = req.user.first_name;
  req.session.last_name = req.user.last_name;
  req.session.email = req.user.email;
  req.session.age = req.user.age;
  req.session.isLogged = true;

  if (
    req.user.email === "adminCoder@coder.com" &&
    req.body.password === "adminCod3r123"
  ) {
    req.session.rol = "Admin";
    return res.redirect("/products");
  } else {
    req.session.rol = "User";
  }

  res.redirect("/products");
};

export const recoverLocal = async (req, res) => {
  const { email, password } = req.body;

  const user = await userManager.getUsersByEmail(email);

  if (!user) {
    return res.send(
      "Si tu correo existe en nuestros registros, recibiras un mail con la informacion para recuperar la constraseña"
    );
  }

  user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  await userModel.updateOne({ email }, user);

  res.redirect("/login");
};

export const githubLogin = (req, res) => {
  req.session.first_name = req.user.first_name;
  req.session.last_name = req.user.last_name;
  req.session.email = req.user.email;
  req.session.age = req.user.age;
  req.session.isLogged = true;

  if (
    req.user.email === "adminCoder@coder.com" &&
    req.body.password === "adminCod3r123"
  ) {
    req.session.rol = "Admin";
    return res.redirect("/products");
  } else {
    req.session.rol = "Usuario";
  }

  res.redirect("/profile");
};

export const loginJwt = async (req, res) => {
  const { email, password } = req.body;

  const user = await userManager.getUsersByEmail(email);

  console.log(user);

  if (!user) {
    return res.send("Correo electrónico no válido");
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: "24h",
  });
  console.log(process.env.JWT_PRIVATE_KEY);
  console.log(token);

  res
    .cookie("coderCookieToken", token, { maxAge: 1000000, httpOnly: true })
    .send("logueado");
};

export const getCookies = (req, res) => {
  res.send(req.cookies);
};

export const current = async (req, res) => {
  console.log(req.user);
  res.send(req.user);
};
