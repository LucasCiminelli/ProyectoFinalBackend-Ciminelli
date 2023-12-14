import ProductManager from "../dao/database/productManager.js";
import CartManager from "../dao/database/cartManager.js";
import UserManager from "../dao/database/userManager.js";

const productManager = new ProductManager();
const cartManager = new CartManager();
const userManager = new UserManager();

export const renderHome = async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
};

export const RenderRealTimeProducts = async (req, res) => {
  res.render("realTimeProducts", {});
};

export const renderChat = (req, res) => {
  res.render("chat", {});
};

// En viewsController.js

export const renderProducts = async (req, res) => {
  try {
    const options = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
      sort: req.query.sort || {},
    };

    const { first_name, last_name, email, age } = req.session;

    const user = await userManager.getUsersByEmail(email);

    if (!user || !user.cart || !user.cart._id) {
      res.status(404).send("Usuario o carrito no encontrado");
      return;
    }
    console.log("el usuario completo es:", user);

    const cartId = user.cart._id.toString();
    const rol = req.session.rol;

    // Obtener productos y enviar cartId a la vista
    const products = await productManager.getProducts({}, options);
    console.log("cartId en el contexto de Handlebars:", cartId);
    res.render("products", { first_name, last_name, products, cartId, rol });
  } catch (error) {
    console.error("Error al obtener y renderizar productos:", error);
    res.status(500).send("Error interno del servidor");
  }
};

export const renderCart = async (req, res) => {
  console.log("la sesion es:", req.session);
  console.log("el user es:", req.user);

  try {
    const userEmail = req.user.email;
    const user = await userManager.getUsersByEmail(userEmail);

    if (!user || !user.cart || !user.cart._id) {
      res.status(404).send("Usuario o carrito no encontrado");
      return;
    }

    const cartId = user.cart._id;
    const cid = cartId; // Asignas el valor de cartId a cid
    const cart = await cartManager.getCartsById(cartId);

    if (!cart) {
      res.status(404).send("Carrito no encontrado");
      return;
    }

    const cartProducts = cart.products.map((prod) => ({
      title: prod.product.title,
      quantity: prod.quantity,
      price: prod.product.price,
      subtotal: prod.product.price * prod.quantity,
    }));

    res.render("cart", { products: cartProducts, cid });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

export const renderLogin = (req, res) => {
  res.render("login");
};

export const renderSignup = (req, res) => {
  res.render("signup");
};

export const renderProfile = (req, res) => {
  const { first_name, last_name, email, age, rol } = req.session;

  res.render("profile", { first_name, last_name, email, age, rol });
};

export const destroySession = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};

export const renderRecover = (req, res) => {
  res.render("recover");
};

export const renderLoginJwt = (req, res) => {
  res.render("loginJwt");
};
