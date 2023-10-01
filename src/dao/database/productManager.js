import { productModel } from "../models/product.model.js";

export default class ProductManager {
  async getProducts(query, options) {
    const { page, limit, sort } = options;

    const paginateOptions = {
      page: page || 1,
      limit: limit || 10,
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
        console.error("Producto existente en la base de datos");
        return null;
      }

      const finalProduct = await productModel.create(newProduct);
      console.log("Producto agregado correctamente:", finalProduct);

      return finalProduct;
    } catch (error) {
      console.error(error, "error al agregar el producto");
    }
  }
  async getProductsById(id) {
    const foundProduct = await productModel.find({ _id: id }).lean();

    if (!foundProduct) {
      console.error("Error, Producto no encontrado");
      return;
    }
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
        console.error("Error, Producto no encontrado");
        return null;
      }

      console.log(`Producto con id: ${id} eliminado.`);
      return foundProductToDelete;
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
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
        console.error("Producto no encontrado");
        return null;
      } else {
        console.log(`producto con id ${id} actualizado`);
        return findProductToUpdate;
      }
    } catch (error) {
      console.error(error, "Error al actualizar el producto");
      return null;
    }
  }

  async getProductRepetido(code) {
    const repetido = await productModel.findOne({ code: code });
    if (repetido) {
      console.log("Producto repetido", repetido);
      return repetido;
    }
    return undefined;
  }
}
