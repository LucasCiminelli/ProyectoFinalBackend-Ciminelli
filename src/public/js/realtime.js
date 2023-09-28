const socket = io();

const productsContainer = document.getElementById("productsContainer");

socket.on("products", (productos) => {
  console.log(productos);
  const productsContent = productos.map((product) => {
    return `<h2>${product.title}</h2>
    <p>${product.description}</p>
    <p>Precio: $${product.price}</p>
    <p>Código: ${product.code}</p>
    <button>Add to the cart</button>
    `;
  });
  productsContainer.innerHTML = productsContent.join("<br/>");
});

socket.on("update_products", (products) => {
  const productsContent = products.map((product) => {
    return `<h2>${product.title}</h2>
    <p>${product.description}</p>
    <p>Precio: $${product.price}</p>
    <p>Código: ${product.code}</p>
    <button>Add to the cart</button>`;
  });
  productsContainer.innerHTML = productsContent.join("<br/>");
});

console.log("Estoy conectado");
