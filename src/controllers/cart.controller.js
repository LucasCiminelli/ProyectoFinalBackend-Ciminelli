import ProductService from "../services/product.service.js";
import CartService from "../services/cart.service.js";
import UserService from "../services/user.service.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateCartErrorInfo } from "../services/errors/info.js";
import { transporter } from "../utils/emailService.js";
import dotenv from "dotenv";

dotenv.config();

const cartService = new CartService();
const productService = new ProductService();
const userService = new UserService();

export const getCarts = async (req, res) => {
  try {
    const carts = await cartService.getCarts();
    res.send({ status: "success", payload: carts });
  } catch (error) {
    res.status(500).json({ error: "Not found" });
  }
};

export const getCartsById = async (req, res) => {
  const id = req.params.cid;

  try {
    const findCartId = await cartService.getCartsById(id);

    if (!findCartId) {
      CustomError.createError({
        name: "Cart not found",
        cause: generateCartErrorInfo(id),
        message: "Error trying to find cart",
        code: EErrors.DATABASE_ERROR,
      });
    }
    return res.status(200).send(findCartId);
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).send("Error al obtener el carrito");
  }
};

export const createCart = async (req, res) => {
  try {
    const newCart = await cartService.createCart();

    res.send({ status: "success", payload: newCart });
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

    const findProd = await productService.getProductsById(pid);

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
    const user = await userService.getUserByCartId(cid);

    if (!user) {
      return res.status(404).send("Usuario no encontrado");
    }

    const deleteProductInCart = await cartService.deleteProductInCart(pid, cid);

    if (user.rol === "Premium") {
      const message = {
        from: {
          name: "E-commerce",
          address: process.env.AUTH_EMAIL,
        },
        to: `${user.email}`,
        subject: "Producto eliminado de tu carrito",
        text: "Producto eliminado de tu carrito",
        html: `<p><b>Hola ${user.first_name} </b> el producto con id: ${pid} fue eliminado de tu carrito con id: ${cid}</p>`,
      };
      await transporter.sendMail(message);

      return res
        .status(200)
        .send(
          "Producto eliminado correctamente del carrito de un usuario Premium"
        );
    }

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
      payload: updatedCart,
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

    const deletedCart = await cartService.deleteCart(cid);

    if (!deletedCart) {
      res.status(404).send("Carrito no encontrado");
      return;
    }

    res.send({
      status: "success",
      message: "Carrito eliminado correctamente",
      payload: deletedCart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

export const endPurchase = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartService.getCartsById(cartId);
    const user = await userService.getUserByCartId(cartId);

    console.log(user);

    if (!cart) {
      res.status(404).send("Carrito no encontrado");
      return null;
    }

    const userId = user._id;

    const productsNotPurchased = await cartService.endPurchase(cartId, userId);
    if (productsNotPurchased.length === 0) {
      const message = {
        from: {
          name: "E-commerce",
          address: process.env.AUTH_EMAIL,
        },
        to: `${user.email}`,
        subject: "Tu compra fue realizada con exito!",
        text: "Tu compra fue realizada con exito!",
        html: `<p><b>Hola ${user.first_name} </b> 
        Tu compra fue realizada con éxito. 
        Gracias por comprar en E-commerce</p>`,
      };
      await transporter.sendMail(message);

      return res
        .status(200)
        .send({ message: "Compra realizada con exito", success: true });
    } else {
      return res.status(500).json({
        error: "Algunos productos no pudieron ser comprados",
        productsNotPurchased,
      });
    }
  } catch (error) {
    console.error("Error al procesar la compra", error);
    res.status(500).send("Error interno del servidor");
  }
};
