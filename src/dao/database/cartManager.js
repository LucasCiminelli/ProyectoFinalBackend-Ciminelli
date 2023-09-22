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
    const foundCart = await cartModel.findOne({ _id: id });
    if (!foundCart) {
      console.error("Error, Carrito no encontrado");
      return null;
    }
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

    const existingProduct = foundCart.products.find(
      (prod) => prod._id === prodId
    );
    

    if (existingProduct) {
      existingProduct.quantity += quantity;
      console.log(existingProduct)
    } else {
      const productToAdd = await productModel.findOne({ _id: prodId }).lean();

      if (productToAdd) {
        foundCart.products.push({ _id: prodId, quantity: quantity }); // Corrección: Usar la cantidad proporcionada
      } else {
        console.error("Error, producto no encontrado");
        return null;
      }
    }

    await cartModel.findByIdAndUpdate(cartId, { products: foundCart.products });

    return foundCart;
  }
}
