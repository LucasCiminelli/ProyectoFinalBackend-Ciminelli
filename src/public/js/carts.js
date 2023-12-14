const endPurchase = async (cartId, userEmail) => {
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
      body: JSON.stringify({ cartId, userEmail }),
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
document.addEventListener("DOMContentLoaded", () => {
  endPurchaseButton.addEventListener("click", async () => {
    // Obtiene el valor de cartId desde algún lugar en tu DOM
    let cartId = document.querySelector("#cartId").value;

    if (!cartId) {
      console.error("Error: cartId no válido");
      return;
    }

    // Obtén userEmail de la misma manera
    let userEmail = document.querySelector("#userEmail").value;

    await endPurchase(cartId, userEmail);
  });
});
