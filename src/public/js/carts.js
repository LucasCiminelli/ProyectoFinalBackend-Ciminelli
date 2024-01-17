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
