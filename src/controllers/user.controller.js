import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserService from "../services/user.service.js";

dotenv.config();

const userService = new UserService();

export const signupLocal = async (req, res) => {
  return res.redirect("/login");
};

export const loginLocal = async (req, res) => {
  req.session.first_name = req.user.first_name;
  req.session.last_name = req.user.last_name;
  req.session.email = req.user.email;
  req.session.age = req.user.age;
  req.session.isLogged = true;
  req.session.cart = req.user.cart;

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

  const user = await userService.getUsersByEmail(email);

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
    req.session.rol = "User";
  }

  res.redirect("/profile");
};

export const loginJwt = async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.getUserByEmail(email);

  console.log(user);

  if (!user) {
    return res.send("Correo electrónico no válido");
  }

  req.session.first_name = user.first_name;
  req.session.last_name = user.last_name;
  req.session.email = user.email;
  req.session.age = user.age;
  req.session.isLogged = true;
  if (
    req.session.email === "adminCoder@coder.com" &&
    req.body.password === "adminCod3r123"
  ) {
    req.session.rol = "Admin";
  } else {
    req.session.rol = "User";
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: "24h",
  });
  console.log(process.env.JWT_PRIVATE_KEY);
  console.log(token);

  res
    .cookie("coderCookieToken", token, { maxAge: 1000000000, httpOnly: true })
    .send("logueado");
};

export const getCookies = (req, res) => {
  res.send(req.cookies);
};

export const current = async (req, res) => {
  const userDTO = {
    Name: req.user.first_name,
    LastName: req.user.last_name,
    email: req.user.email,
    rol: req.user.email === "adminCoder@coder.com" ? "Admin" : req.user.rol,
    cart: req.user.cart._id,
  };
  console.log(req.user);
  res.send(userDTO);
};
