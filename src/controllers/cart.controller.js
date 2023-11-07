import ProductManager from "../dao/database/productManager.js";
import CartService from "../services/cart.service.js";

const cartService = new CartService();
const productManager = new ProductManager();

export const getCarts = async (req, res) => {
  try {
    const carts = await cartService.getCarts();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: "Not found" });
  }
};

export const getCartsById = async (req, res) => {
  const id = req.params.cid;
  const findCartId = await cartService.getCartsById(id);

  if (!findCartId) {
    res.status(404).send("Carrito no encontrdo");
  } else {
    res.status(200).send(findCartId);
  }
};

export const createCart = async (req, res) => {
  try {
    const newCart = await cartService.createCart();

    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = parseInt(req.body.quantity, 10);

    const findCart = await cartService.getCartsById(cid);

    if (!findCart) {
      res.status(404).send("Carrito no encontrado");
      return;
    }

    const findProd = await productManager.getProductsById(pid);

    if (!findProd) {
      res.status(404).send("Producto no encontrado");
      return;
    }

    const addProdToCart = await cartService.addProductToCart(
      cid,
      pid,
      quantity
    );

    if (addProdToCart) {
      res.status(200).send("Producto añadido al carrito correctamente");
    } else {
      res.status(500).send("Error al agregar producto al carrito");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

export const deleteProductInCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const deleteProductInCart = await cartService.deleteProductInCart(pid, cid);
    

    if (deleteProductInCart) {
       res.status(200).send("Producto eliminado correctamente del carrito");
    } else {
       res.status(500).send("Error al eliminar producto del carrito");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

export const updateProductsInCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const updatedProducts = req.body.products;

    const findCartId = await cartService.getCartsById(cid);

    if (!findCartId) {
      res.status(404).send("Carrito no encontrdo");
    }

    const updatedCart = await cartService.updateProductsInCart(
      cid,
      updatedProducts
    );
    if (!updatedCart) {
      res.status(404).send("No se pudo encontrar el carrito o actualizarlo.");
      return;
    }
    res.status(200).send({
      status: "success",
      updatedCart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

export const updateQuantityProdInCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;

    const cart = await cartService.getCartsById(cid);

    if (!cart) {
      res.status(404).send("Carrito no encontrdo");
      return;
    }

    const findProductInCart = cart.products.findIndex(
      (prod) => prod.product.toString() === pid
    );

    if (findProductInCart === -1) {
      res.status(404).send("Producto no encontrado en el carrito");
      return;
    }

    cart.products[findProductInCart].quantity = quantity;

    await cart.save();

    console.log(cart);

    res.status(200).send({
      status: "success",
      updatedCart: cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

export const deleteCart = async (req, res) => {
  try {
    const cid = req.params.cid;

    const cart = await cartService.getCartsById(cid);

    if (!cart) {
      res.status(404).send("Carrito no encontrado");
      return;
    }

    cart.products = [];

    await cart.save();

    res.status(200).send({
      status: "success",
      message: "todos los productos fueron eliminados del carrito",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};
