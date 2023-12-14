import { productModel } from "../models/product.model.js";
import { fakerES as faker } from "@faker-js/faker";
import { logger } from "../../utils/logger.js";

export default class ProductManager {
  async getProducts(query, options) {
    const { page, limit, sort } = options || {};

    const paginateOptions = {
      page: page || 1,
      limit: limit || 15,
      sort: sort || {},
      lean: true,
    };

    const result = await productModel.paginate(query || {}, paginateOptions);

    const totalPages = result.totalPages;
    const currentPage = result.page;
    const hasNextPage = result.hasNextPage;
    const hasPrevPage = result.hasPrevPage;
    const prevLink = hasPrevPage ? `/products?page=${currentPage - 1}` : null;
    const nextLink = hasNextPage ? `/products?page=${currentPage + 1}` : null;

    const products = {
      status: "sucess",
      payload: result.docs,
      totalPages: totalPages,
      prevPage: currentPage - 1,
      nextPage: currentPage + 1,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
      prevLink: prevLink,
      nextLink: nextLink,
    };

    return products;
  }

  async addProduct(newProduct) {
    try {
      const existingProduct = await productModel.findOne({
        code: newProduct.code,
      });

      if (existingProduct) {
        logger.error("Producto existente en la base de datos");
        return null;
      }

      const finalProduct = await productModel.create(newProduct);
      logger.info("Producto agregado correctamente:", finalProduct);

      return finalProduct;
    } catch (error) {
      logger.error(error, "error al agregar el producto");
    }
  }
  async getProductsById(id) {
    const foundProduct = await productModel.find({ _id: id }).lean();

    if (!foundProduct) {
      logger.error("Error, Producto no encontrado");
      return;
    }

    logger.info(foundProduct);
    return foundProduct;
  }

  async deleteProduct(id) {
    try {
      const foundProductToDelete = await productModel
        .findOneAndDelete({
          _id: id,
        })
        .lean();

      if (!foundProductToDelete) {
        logger.error("Error, Producto no encontrado");
        return null;
      }

      logger.info(`Producto con id: ${id} eliminado.`);
      return foundProductToDelete;
    } catch (error) {
      logger.error("Error al eliminar el producto:", error);
      return null;
    }
  }

  async updateProduct(id, productChanged) {
    try {
      const findProductToUpdate = await productModel.findOneAndUpdate(
        { _id: id },
        productChanged,
        { new: true }
      );

      if (!findProductToUpdate) {
        logger.error("Producto no encontrado");
        return null;
      } else {
        logger.info(`producto con id ${id} actualizado`);
        return findProductToUpdate;
      }
    } catch (error) {
      logger.error(error, "Error al actualizar el producto");
      return null;
    }
  }

  async getProductRepetido(code) {
    const repetido = await productModel.findOne({ code: code });
    if (repetido) {
      logger.info("Producto repetido", repetido);
      return repetido;
    }
    return undefined;
  }

  getProductsMocks() {
    const products = [];
    for (let i = 0; i < 101; i++) {
      const product = {
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        code: faker.string.uuid(),
        price: faker.commerce.price(),
        stock: faker.string.numeric(),
        category: faker.commerce.productMaterial(),
        thumbnails: faker.helpers.shuffle([
          "thumbnail1",
          "thumbnail2",
          "thumbnail3",
        ]),
      };
      products.push(product);
    }
    return products;
  }
}
