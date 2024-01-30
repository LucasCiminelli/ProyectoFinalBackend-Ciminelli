import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserService from "../services/user.service.js";
import { multerUploader } from "../utils/multerUploader.js";
import { logger } from "../utils/logger.js";
import { transporter } from "../utils/emailService.js";

dotenv.config();

const userService = new UserService();

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    if (!users) {
      return res.status(400).send("Usuarios no encontrados");
    }
    const userDTO = users.map((user) => ({
      name: user.first_name,
      lastname: user.last_name,
      email: user.email,
      rol: user.rol,
    }));
    return res.send({ status: "success", payload: userDTO });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener usuarios");
  }
};

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

  if (req.user.email === "adminCoder@coder.com") {
    req.session.rol = "Admin";
    return res.redirect("/adminControlPanel");
  } else {
    req.session.rol = "User";
    res.redirect("/products");
  }
};

export const recoverLocal = async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.getUserByEmail(email);

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

  if (req.user.email === "adminCoder@coder.com") {
    req.session.rol = "Admin";
    return res.redirect("/profile");
  }
  req.session.rol = "User";
  return res.redirect("/profile");
};

export const loginJwt = async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.getUserByEmail(email);

  console.log(user);

  if (!user) {
    return res.send("Correo electrónico no válido");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.send("Credenciales inválidas");
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

  if (email === "adminCoder@coder.com" && isPasswordValid) {
    res
      .cookie("coderCookieToken", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .redirect("/adminControlPanel");
  } else {
    res
      .cookie("coderCookieToken", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .redirect("/products");
  }
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

export const deleteInactiveUsers = async (req, res) => {
  try {
    const deletedUsers = await userService.deleteInactiveUsers();
    for (const user of deletedUsers) {
      const message = {
        from: {
          name: "E-commerce",
          address: process.env.AUTH_EMAIL,
        },
        to: `${user.email}`,
        subject: "Cuenta eliminada",
        text: "Tu cuenta fue eliminada.",
        html: `<p><b>Hola ${user.first_name} </b> tu cuenta fue eliminada por inactividad</p>`,
      };
      await transporter.sendMail(message);
    }
    res
      .status(200)
      .send("Usuarios eliminados y correos enviados correctamente!");
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send("Error al eliminar usuarios y enviar correos: ", err.message);
  }
};

export const adminDelete = async (req, res) => {
  try {
    const id = req.params.uid;
    const deleteUser = await userService.adminDelete(id);
    return res.status(200).send(deleteUser);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error al eliminar al usuario");
  }
};

export const updateRolByAdmin = async (req, res) => {
  try {
    const id = req.params.uid;
    const rol = req.body.rol;
    const updatedUser = await userService.updateRolByAdmin(id, rol);
    return res.status(200).send(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error al actualizar el rol del usuario");
  }
};
