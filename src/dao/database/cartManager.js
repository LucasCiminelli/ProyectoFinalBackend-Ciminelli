import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";

export default class CartManager {
  async getCarts() {
    const carts = await cartModel.find().lean();
    return carts;
  }

  async createCart(cart) {
    const newCart = await cartModel.create(cart);
    return newCart;
  }

  async getCartsById(id) {
    const foundCart = await cartModel
      .findOne({ _id: id })
      .populate("products.product")
      .lean();

    if (!foundCart) {
      console.error("Error, Carrito no encontrado");
      return null;
    }
    console.log(JSON.stringify(foundCart, null, 2));
    return foundCart;
  }

  async addProductToCart(cartId, prodId, quantity) {
    const foundCart = await this.getCartsById(cartId);

    if (!foundCart) {
      console.error("Error, carrito no encontrado");
      return null;
    }

    if (!foundCart.products) {
      foundCart.products = [];
    }

    const existingProduct = await cartModel
      .findById({ _id: cartId })
      .populate("products.product")
      .lean();

    console.log(existingProduct);

    if (existingProduct) {
      const productToUpdate = existingProduct.products.find(
        (prod) => prod.product._id.toString() === prodId
      );

      if (productToUpdate) {
        productToUpdate.quantity += quantity;
        console.log(productToUpdate);
      } else {
        const productToAdd = await productModel.findOne({ _id: prodId }).lean();

        if (productToAdd) {
          existingProduct.products.push({
            product: prodId,
            quantity: quantity,
          });
        } else {
          console.error(
            "Error, producto no encontrado en el carrito ni en la base de datos"
          );
          return null;
        }
      }
    } else {
      console.error("Error, carrito no encontrado");
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
        console.error("Carrito no encontrado");
        return null;
      }

      const productsInCart = cart.products.filter(
        (prod) => prod.product._id.toString() !== productId
      );
      console.log("productos", productsInCart);
      console.log("productId:", productId);
      console.log("Products in Cart:", cart.products);

      if (productsInCart.length === cart.products.length) {
        console.error("Producto no encontrado en el carrito");
        return null;
      }

      await cartModel.findByIdAndUpdate(cartId, { products: productsInCart });
      return cart;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateProductsInCart(cartId, updatedProducts) {
    try {
      const findCart = await cartModel.findById(cartId);
      if (!findCart) {
        console.log("carrito no encontrado");
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
      console.error(error);
      return null;
    }
  }
}
