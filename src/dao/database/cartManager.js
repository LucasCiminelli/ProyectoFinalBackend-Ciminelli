import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";
import { userModel } from "../models/user.model.js";
import { logger } from "../../utils/logger.js";
import { errors } from "../../middlewares/errors.js";
import { ticketModel } from "../models/ticket.model.js";
import ProductManager from "./productManager.js";
import { calculateTotal } from "../../utils/calculateTotal.js";
import UserManager from "./userManager.js";

const productManager = new ProductManager();
const userManager = new UserManager();

export default class CartManager {
  async getCarts() {
    const carts = await cartModel.find().lean();
    logger.info("Carritos obtenidos correctamente en la base de datos");
    return carts;
  }

  async createCart(cart) {
    const newCart = await cartModel.create(cart);
    logger.info("Carrito creado correctamente en la base de datos");
    return newCart;
  }

  async getCartsById(id) {
    const foundCart = await cartModel
      .findOne({ _id: id })
      .populate("products.product");

    if (!foundCart) {
      logger.error("Error, Carrito no encontrado en la base de datos");
      return null;
    }
    logger.info("carrito encontrado", foundCart);
    return foundCart;
  }

  async addProductToCart(cartId, prodId, quantity) {
    const foundCart = await this.getCartsById(cartId);

    if (!foundCart) {
      logger.error("Error, carrito no encontrado");
      return null;
    }

    if (!foundCart.products) {
      foundCart.products = [];
    }

    const existingProduct = await cartModel
      .findById({ _id: cartId })
      .populate("products.product")
      .lean();

    logger.info(existingProduct);

    if (existingProduct) {
      const productToUpdate = existingProduct.products.find(
        (prod) => prod.product._id.toString() === prodId
      );

      if (productToUpdate) {
        productToUpdate.quantity += quantity;
        logger.info(productToUpdate);
      } else {
        const productToAdd = await productModel.findOne({ _id: prodId }).lean();

        if (productToAdd) {
          const price = productToAdd.price; // Get the price from the product
          logger.info(`Adding product to cart with price: ${price}`);
          existingProduct.products.push({
            product: prodId,
            quantity: quantity,
            price: price,
            subtotal: price * quantity,
          });
        } else {
          logger.error(
            "Error, producto no encontrado en el carrito ni en la base de datos"
          );
          return null;
        }
      }
    } else {
      logger.error("Error, carrito no encontrado");
      return null;
    }

    await cartModel.findByIdAndUpdate(cartId, {
      products: existingProduct.products,
    });

    return existingProduct;
  }

  async deleteProductInCart(productId, cartId) {
    try {
      const cart = await this.getCartsById(cartId);
      if (!cart) {
        logger.error("Carrito no encontrado");
        return null;
      }

      const productsInCart = cart.products.filter(
        (prod) => prod.product._id.toString() !== productId
      );
      logger.info("productos", productsInCart);
      logger.info("productId:", productId);
      logger.info("Products in Cart:", cart.products);

      if (productsInCart.length === cart.products.length) {
        logger.error("Producto no encontrado en el carrito");
        return null;
      }

      await cartModel.findByIdAndUpdate(cartId, { products: productsInCart });
      return cart;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  async updateProductsInCart(cartId, updatedProducts) {
    try {
      const findCart = await cartModel.findById(cartId);
      if (!findCart) {
        logger.error("carrito no encontrado");
        return null;
      }

      const updatedCart = await cartModel
        .findByIdAndUpdate(
          cartId,
          {
            products: updatedProducts,
          },
          { new: true, upsert: false }
        )
        .populate("products.product");

      return updatedCart;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  async deleteCart(cartId) {
    try {
      const deletedCart = await cartModel.findOneAndDelete({ _id: cartId });

      if (!deletedCart) {
        logger.error("Carrito no encontrado");
        return null;
      }

      return deletedCart;
    } catch (err) {
      logger.error(err);
      return null;
    }
  }

  async endPurchase(cartId, userId) {
    try {
      const cart = await this.getCartsById(cartId);
      const user = await userManager.getUserByCartId(cartId);

      if (!cart || !user) {
        logger.error("User o carrito no encontrado");
      }

      console.log("el user es:", user);
      console.log("el carrito es:", cart);

      const productsNotPurchased = [];

      for (const product of cart.products) {
        if (product.quantity > product.product.stock) {
          productsNotPurchased.push(product.product._id);
        } else {
          const currentStock = product.product.stock;

          const newStock = currentStock - product.quantity;
          product.product.stock = newStock;
          const updatedProduct = await productManager.updateProduct(
            product.product._id.toString(),
            { $set: { stock: newStock } }
          );

          if (!updatedProduct) {
            logger.error(
              `No se pudo actualizar el producto con id ${product.product._id}`
            );
          }
        }
      }

      const newTicket = await ticketModel.create({
        amount: calculateTotal(cart.products),
        purchaser: user.email,
      });

      await newTicket.save();

      user.tickets.push(newTicket);

      await user.save();

      cart.products = cart.products.filter((product) => {
        return productsNotPurchased.includes(product.product._id.toString());
      });

      const updatedCart = await this.updateProductsInCart(
        cartId,
        cart.products
      );
      return productsNotPurchased;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
