import fs from "fs";

class CartManager {
    carts;
    static id;
  
    constructor() {
      this.carts = [];
      this.path = "./data/carts.json";
  
      try {
        if (fs.existsSync(this.path)) {
          const content = fs.readFileSync(this.path, "utf-8");
          this.carts = JSON.parse(content);
        }
      } catch (error) {
        console.log("Error al cargar carritos", error);
        this.carts = [];
      }
  
      if (this.carts.length > 0) {
        CartManager.id = this.carts[this.carts.length - 1].id + 1;
      } else {
        CartManager.id = 1;
      }
    }
  
  generateUniqueId() {
    return CartManager.id++;
  }

  async saveChanges() {
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(this.carts, null, "\t")
    );
  }

  async getCarts() {
    const data = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
    return data;
  }

  async createCart() {
    const newCart = {
      id: this.generateUniqueId(),
      products: [],
    };
    this.carts.push(newCart);
    await this.saveChanges();
    return newCart;
  }

  async getCartsById(id) {
    const data = await this.getCarts();
    const foundCart = data.find((cart) => cart.id === id);

    if (!foundCart) {
      console.error("Error carrito no encontrado");
      return;
    }
    return foundCart;
  }

  async addProductToCart(cartId, prodId, quantity) {
    const foundCart = await this.getCartsById(cartId);

    if (!foundCart) {
      console.error("Error, carrito no encontrado");
      return null;
    }

    const existingProduct = foundCart.products.find(
      (prod) => prod.id === prodId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      foundCart.products.push({ id: prodId, quantity: 1 });
    }

    await this.saveChanges();

    return foundCart;
  }
}

async function testCartManager() {
  
  const cartManager = new CartManager();
  const newCart = await cartManager.createCart();

  
  const productId = 1;
  const quantity = 2;
  const updatedCart = await cartManager.addProductToCart(
    newCart.id,
    productId,
    quantity
  );


  if (updatedCart) {
    console.log("Producto agregado correctamente al carrito:", updatedCart);
  } else {
    console.log("Error al agregar producto al carrito");
  }


  const carts = await cartManager.getCarts();
  console.log("Carritos actualizados:", carts);
}

//testCartManager();

export default CartManager;
