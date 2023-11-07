import CartManager from "../dao/database/cartManager.js";


const cartManager = new CartManager();


export default class cartService {
  async getCarts() {
    try {
      return await cartManager.getCarts();
    } catch (error) {
      throw new Error("Error en capa de Servicio", error);
    }
  }
  async getCartsById(id) {
    try {
      return await cartManager.getCartsById(id);
    } catch (error) {
      throw new Error("Error en capa de Servicio", error);
    }
  }
  async createCart(cart) {
    try {
      return await cartManager.createCart(cart);
    } catch (error) {
      throw new Error("Error en capa de Servicio", error);
    }
  }
  async addProductToCart(cartId, prodId, quantity) {
    try {
      return await cartManager.addProductToCart(cartId, prodId, quantity);
    } catch (error) {
      throw new Error("Error en capa de servicio", error);
    }
  }

  async updateProductsInCart(cartId, updatedProducts) {
    try {
      return await cartManager.updateProductsInCart(cartId, updatedProducts);
    } catch (error) {
      throw new Error("Error en capa de servicio", error);
    }
  }

  async deleteProductInCart(productId, cartId) {
    try {
      return await cartManager.deleteProductInCart(productId, cartId);
    } catch (error) {
      throw new Error("Error en capa de servicio", error);
    }
  }
}
