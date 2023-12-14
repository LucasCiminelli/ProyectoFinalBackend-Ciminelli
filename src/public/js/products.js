// products.js
const addProductToCart = async (cartId, productId, quantity, price) => {
  try {
    if (!cartId) {
      console.error("Error: cartId no válido");
      return;
    }

    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity, price }),
    });

    if (!response.ok) {
      throw new Error("Error al agregar producto al carrito");
    }

    console.log("Producto añadido al carrito correctamente");
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
  }
};

// products.js

// products.js
const addToCartButtons = document.querySelectorAll(".addToCartButton");

addToCartButtons.forEach((button) => {
  const cartId = document
    .querySelector(".max-w-3xl")
    .getAttribute("data-cart-id");
  const userRole = document
    .querySelector(".max-w-3xl")
    .getAttribute("data-user-role");

  button.addEventListener("click", async () => {
    const productId = button.getAttribute("data-product-id");
    const quantity = 1;
    const price = parseFloat(button.getAttribute("data-product-price"));
    if (userRole === "Admin") {
      console.log(
        "Usuario es un administrador. No se puede agregar al carrito."
      );
      Swal.fire({
        title: "Usuario es un administrador. No se puede agregar al carrito.",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    try {
      await addProductToCart(cartId, productId, quantity, price);
      console.log("Producto añadido al carrito correctamente", price);
      Swal.fire({
        title: "Producto añadido al carrito",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
    }
  });
});
