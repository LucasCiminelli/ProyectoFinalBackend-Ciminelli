import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";
import { logger } from "../../utils/logger.js";
import { errors } from "../../middlewares/errors.js";

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
          existingProduct.products.push({
            product: prodId,
            quantity: quantity,
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
          { new: true }
        )
        .populate("products.product");

      return updatedCart;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  async endPurchase() {}
}
