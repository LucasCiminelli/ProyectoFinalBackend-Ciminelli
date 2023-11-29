import CartManager from "../dao/database/cartManager.js";
import CustomError from "./errors/CustomError.js";
import EErrors from "./errors/enums.js";
import { generateCartErrorInfo } from "./errors/info.js";
import { logger } from "../utils/logger.js";

const cartManager = new CartManager();

export default class cartService {
  async getCarts() {
    try {
      const carts = await cartManager.getCarts();
      logger.info("Carritos obtenidos correctamente en la capa de servicio");
      return carts;
    } catch (error) {
      logger.error("Error al obtener los carritos", error);
      throw new Error("Error en capa de Servicio", error);
    }
  }
  async getCartsById(id) {
    try {
      const cart = await cartManager.getCartsById(id);
      logger.info(
        `Carrito con id ${id} obtenido correctamente de la Base de datos`
      );
      return cart;
    } catch (error) {
      logger.error(
        `Carrito con id ${id} no encontrado en la Base de datos`,
        error
      );
      CustomError.createError({
        name: "Cart not found",
        cause: generateCartErrorInfo(id), // Aquí puedes proporcionar más detalles sobre el error original
        message: "Error trying to find the cart",
        code: EErrors.DATABASE_ERROR,
      });
    }
  }
  async createCart(cart) {
    try {
      const newCart = await cartManager.createCart(cart);
      logger.info("Carrito creado correctamente");
      return newCart;
    } catch (error) {
      logger.error("El carrito no fue creado", error);
      throw new Error("Error en capa de Servicio", error);
    }
  }
  async addProductToCart(cartId, prodId, quantity) {
    try {
      return await cartManager.addProductToCart(cartId, prodId, quantity);
    } catch (error) {
      logger.error("Error al agregar un producto al carrito", error);
      throw new Error("Error en capa de servicio", error);
    }
  }

  async updateProductsInCart(cartId, updatedProducts) {
    try {
      return await cartManager.updateProductsInCart(cartId, updatedProducts);
    } catch (error) {
      logger.error("Error al actualizar un carrito", error);
      throw new Error("Error en capa de servicio", error);
    }
  }

  async deleteProductInCart(productId, cartId) {
    try {
      return await cartManager.deleteProductInCart(productId, cartId);
    } catch (error) {
      logger.error("Error al eliminar un producto del carrito", error);
      throw new Error("Error en capa de servicio", error);
    }
  }
}
