import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";
import { logger } from "../../utils/logger.js";
import { errors } from "../../middlewares/errors.js";
import { ticketModel } from "../models/ticket.model.js";
import ProductManager from "./productManager.js";

const productManager = new ProductManager();

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
      .populate("products.product")
      .lean();

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

  async endPurchase(cartId, userEmail) {
    const cart = await cartModel.findById(cartId);

    if (!cart) {
      logger.error("Carrito no encontrado");
      return null;
    }

    const productsNotPurchased = [];

    for (const product of cart.products) {
      if (product.quantity > parseInt(product.product.stock, 10)) {
        productsNotPurchased.push(product.product._id);
      } else {
        const currentStock = parseInt(product.product.stock, 10);
        if (isNaN(currentStock)) {
          logger.error("El tipo del stock no es un tipo valido");
        }
        const newStock = parseInt(currentStock) - product.quantity;
        product.product.stock = newStock.toString();
        const updatedProduct = await productManager.updateProduct(
          product.product._id,
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
      amount: 1,
      purchaser: userEmail.email.toString(),
    });
    logger.info(newTicket);

    // Corregir el filtro
    cart.products = cart.products.filter((product) => {
      return !productsNotPurchased.includes(product.product._id);
    });

    const updatedCart = await this.updateProductsInCart(cartId, cart.products);

    return productsNotPurchased;
  }
}
