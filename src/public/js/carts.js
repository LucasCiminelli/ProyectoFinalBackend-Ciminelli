const endPurchase = async (cartId, userId) => {
  // products.js
  try {
    if (!cartId) {
      console.error("Error: cartId no válido");
      return;
    }

    const response = await fetch(`/api/carts/${cartId}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartId: cartId }),
    });

    if (!response.ok) {
      throw new Error("Error al agregar producto al carrito");
    }

    console.log("Accediste exitosamente a endPurchase");
  } catch (error) {
    console.error("Error al hacer post endPurchase", error);
  }
};

const endPurchaseButton = document.querySelector(".endPurchaseButton");

endPurchaseButton.addEventListener("click", async () => {
  const cartId = endPurchaseButton.getAttribute("data-cart-id");
  const userId = endPurchaseButton.getAttribute("data-user-id");

  if (!cartId) {
    console.error("Error: cartId no válido");
    return;
  }

  await endPurchase(cartId, userId);
  console.log("Compra realizada con exito");
  Swal.fire({
    title: "Compra realizada con exito",
    icon: "success",
    showConfirmButton: false,
    timer: 1500,
  });
  setTimeout(() => {
    window.location.reload();
  }, 1200);
});

const updateQuantity = async (cartId, productId, quantity) => {
  try {
    if (!cartId) {
      console.error("error al obtener el carrito");
      return;
    }
    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Error al modificar la cantidad del producto: ${errorMessage}`
      );
    }
    window.location.reload();
  } catch (err) {
    console.log("error al tratar de actualizar la cantidad", err);
  }
};

const restarButtons = document.querySelectorAll(".restar-button");
const sumarButtons = document.querySelectorAll(".sumar-button");

restarButtons.forEach((button) => {
  const cartId = document
    .querySelector(".max-w-md")
    .getAttribute("data-cart-id");

  button.addEventListener("click", async () => {
    console.log("Boton restar tocado");
    const productId = button.getAttribute("data-product-id");
    let currentQuantity = parseInt(
      button.getAttribute("data-current-quantity")
    );
    console.log("cartId:", cartId);
    console.log("productId:", productId);
    console.log("currentQuantity:", currentQuantity);

    if (currentQuantity > 1) {
      currentQuantity -= 1;
      console.log("Cantidad restada correctamente", currentQuantity);

      return await updateQuantity(cartId, productId, currentQuantity);
    }
  });
});

sumarButtons.forEach((button) => {
  const cartId = document
    .querySelector(".max-w-md")
    .getAttribute("data-cart-id");

  button.addEventListener("click", async () => {
    console.log("boton sumar tocado");
    const productId = button.getAttribute("data-product-id");
    let currentQuantity = parseInt(
      button.getAttribute("data-current-quantity")
    );
    console.log("cartId:", cartId);
    console.log("productId:", productId);
    console.log("currentQuantity:", currentQuantity);

    if (currentQuantity >= 1) {
      currentQuantity += 1;
      console.log("Cantidad aumentada correctamente", currentQuantity);

      return await updateQuantity(cartId, productId, currentQuantity);
    }
  });
});

const deleteProduct = async (cartId, productId) => {
  try {
    if (!cartId) {
      console.error("error al obtener el carrito");
      return;
    }

    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartId: cartId, productId: productId }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Error al modificar la cantidad del producto: ${errorMessage}`
      );
    }
    window.location.reload();
  } catch (err) {
    console.log("error al eliminar producto del carrito", err);
  }
};

const deleteButton = document.querySelectorAll(".eliminar-producto");

deleteButton.forEach((button) => {
  const cartId = document
    .querySelector(".max-w-md")
    .getAttribute("data-cart-id");

  button.addEventListener("click", async () => {
    console.log("boton eliminar tocado");
    const productId = button.getAttribute("data-product-id");

    return await deleteProduct(cartId, productId);
  });
});
