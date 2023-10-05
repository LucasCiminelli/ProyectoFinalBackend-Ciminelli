import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";
import bcrypt from "bcrypt";

const router = Router();

router.post("/signup", async (req, res) => {
  if (req.session.isLogged) {
    return res.redirect("/profile");
  }

  const { first_name, last_name, email, age, password } = req.body;

  const userExists = await userModel.findOne({ email });

  if (userExists) {
    return res.send("Ya estás registrado");
  }

  const user = await userModel.create({
    first_name,
    last_name,
    email,
    age,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
  });

  req.session.first_name = user.first_name;
  req.session.last_name = user.last_name;
  req.session.email = user.email;
  req.session.age = user.age;
  req.session.isLogged = true;

  res.redirect("/profile");
});

router.post("/login", async (req, res) => {
  if (req.session.isLogged) {
    return res.redirect("/profile");
  }

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).lean();

  if (!user) {
    return res.send(
      "El correo o contraseña ingresada no corresponde con nuestros registros"
    );
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.send(
      "El correo o contraseña ingresada no corresponde con nuestros registros"
    );
  }

  req.session.first_name = user.first_name;
  req.session.last_name = user.last_name;
  req.session.email = user.email;
  req.session.age = user.age;
  req.session.isLogged = true;

  if (user.email === "adminCoder@coder.com" && password === "adminCod3r123") {
    req.session.rol = "Admin";
    return res.redirect("/products");
  } else {
    req.session.rol = "Usuario";
  }

  res.redirect("/products");
});

router.post("/recover", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).lean();

  if (!user) {
    return res.send(
      "Si tu correo existe en nuestros registros, recibiras un mail con la informacion para recuperar la constraseña"
    );
  }

  user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  await userModel.updateOne({ email }, user);

  res.redirect("/login");
});

export default router;
