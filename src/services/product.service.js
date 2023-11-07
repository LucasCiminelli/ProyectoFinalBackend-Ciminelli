import ProductManager from "../dao/database/productManager.js";

const productManager = new ProductManager();

export default class ProductService {
  async getProducts(query, options) {
    try {
      return await productManager.getProducts(query, options);
    } catch (error) {
      throw new Error("Error en capa de Servicio", error);
    }
  }

  async getProductsById(id) {
    try {
      return await productManager.getProductsById(id);
    } catch (error) {
      throw new Error("Error en capa de Servicio", error);
    }
  }

  async createProduct(product) {
    try {
     
      return await productManager.addProduct(product);
    } catch (error) {
      throw new Error("Error en capa de Servicio", error);
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      return await productManager.updateProduct(id, updatedProduct);
    } catch (error) {
      throw new Error("Error en capa de Servicio", error);
    }
  }

  async deleteProduct(id) {
    try {
      return await productManager.deleteProduct(id);
    } catch (error) {
      throw new Error("Error en capa de Servicio", error);
    }
  }
}
