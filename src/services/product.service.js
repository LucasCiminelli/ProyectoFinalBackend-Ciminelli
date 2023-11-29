import ProductManager from "../dao/database/productManager.js";
import { logger } from "../utils/logger.js";

const productManager = new ProductManager();

export default class ProductService {
  async getProducts(query, options) {
    try {
      return await productManager.getProducts(query, options);
    } catch (error) {
      logger.error("Error al obtener los productos", error);
      throw new Error("Error en capa de Servicio", error);
    }
  }

  async getProductsById(id) {
    try {
      return await productManager.getProductsById(id);
    } catch (error) {
      logger.error(`Error al obtener el producto con id ${id}`, error);
      throw new Error("Error en capa de Servicio", error);
    }
  }

  async createProduct(product) {
    try {
      return await productManager.addProduct(product);
    } catch (error) {
      logger.error("Error al crear el producto", error);
      throw new Error("Error en capa de Servicio", error);
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      return await productManager.updateProduct(id, updatedProduct);
    } catch (error) {
      logger.error("Error al actualizar un producto", error);
      throw new Error("Error en capa de Servicio", error);
    }
  }

  async deleteProduct(id) {
    try {
      return await productManager.deleteProduct(id);
    } catch (error) {
      logger.error(`Error al eliminar el producto con id ${id}`, error);
      throw new Error("Error en capa de Servicio", error);
    }
  }

  getProductsMocks() {
    try {
      return productManager.getProductsMocks();
    } catch (error) {
      logger.error("Error al obtener los productos de mocks", error);
      throw new Error("Error en capa de Servicio", error);
    }
  }
}
