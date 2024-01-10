import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserService from "../services/user.service.js";
import { multerUploader } from "../utils/multerUploader.js";

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

  await userService.updateLastConnection(user._id, {
    last_connection: new Date(),
  });

  req.session.first_name = user.first_name;
  req.session.last_name = user.last_name;
  req.session.email = user.email;
  req.session.age = user.age;
  req.session.isLogged = true;
  req.session.last_connection = user.last_connection;

  console.log("el id del usuario es:", user._id.toJSON());

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
    tickets: req.user.tickets,
  };
  console.log(req.user);
  res.send(userDTO);
};

export const uploadUserDocuments = (req, res) => {
  const userId = req.params.uid;

  const user = userService.getUserById(userId);

  if (!user) {
    res.status(500).send("No se ha encontrado al usuario");
  }

  const documentType = req.body.documentType;

  let folderName;

  if (documentType === "profile") {
    folderName = "profiles";
  } else if (documentType === "products") {
    folderName = "products";
  } else {
    folderName = "documents";
  }

  const uploadMiddleware = uploader(folderName).array("documents", 5);

  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(500).send("Error al cargar los documentos");
    }

    user.documents.push({
      type: documentType,
      filenames: req.files.map((file) => file.filename),
    });

    await user.save();
    res.status(200).send("Documentos cargados exitosamente");
  });
};

export const userToPremium = async (req, res) => {
  const uid = req.params.uid;

  const user = await userService.getUserById(uid);

  console.log("el user es:", user);
  console.log("los documentos del usuario son:", user.documents);

  if (!user) {
    res.status(500).send("Usuario no encontrado");
  }

  const requiredDocuments = [
    "Identificacion",
    "Comprobante de domicilio",
    "Comprobante de estado de cuenta",
  ];

  const hasRequiredDocuments = requiredDocuments.every((doc) => {
    user.documents.some((d) => d.type === doc);
  });

  if (user.rol === "Premium") {
    return res.status(500).send("El usuario ya es Premium");
  }

  if (!hasRequiredDocuments) {
    user.rol = "User";
    await user.save();
    return res.status(400).send("El usuario debe cargar todos los documentos");
  }

  user.rol = "Premium";
  await user.save();
  return res.status(200).send("Usuario Actualizado a Premium");
};
