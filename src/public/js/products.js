// products.js
const addToCartButtons = document.querySelectorAll(".addToCartButton");

const addProductToCart = async (productId, quantity) => {
  try {
    const response = await fetch(
      `/api/carts/651592616f484725392faa6b/product/${productId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      }
    );

    if (!response.ok) {
      throw new Error("Error al agregar producto al carrito");
    }

    console.log("Producto añadido al carrito correctamente");
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
  }
};

addToCartButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const productId = button.getAttribute("data-product-id");
    const quantity = 1;

    try {
      await addProductToCart(productId, quantity);
      Swal.fire({
        title: "Producto añadido al carrito",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error(error);
    }
  });
});
