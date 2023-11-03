import ProductManager from "../dao/database/productManager.js";
import CartManager from "../dao/database/cartManager.js";

const productManager = new ProductManager();
const cartManager = new CartManager();

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

export const renderProducts = async (req, res) => {
  try {
    const options = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
      sort: req.query.sort || {},
    };

    const { first_name, last_name, email, age } = req.session;

    const products = await productManager.getProducts({}, options);

    res.render("products", { first_name, last_name, products });
  } catch (error) {
    console.error("Error al obtener y renderizar productos:", error);
    res.status(500).send("Error interno del servidor");
  }
};

export const renderCart = async (req, res) => {
  const cid = req.params.cid;

  try {
    const cart = await cartManager.getCartsById(cid);

    if (!cart) {
      res.status(404).send("Carrito no encontrado");
      return;
    }

    const cartProducts = cart.products.map((prod) => ({
      title: prod.product.title,
      quantity: prod.quantity,
    }));

    res.render("cart", { products: cartProducts });
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
