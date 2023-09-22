const socket = io();

let usuario = "";

Swal.fire({
  title: "Ingresa un correo",
  input: "text",
  confirmButtonText: "Ingresar",
}).then((result) => {
  usuario = result.value;
});

const box = document.getElementById("box");
const contenido = document.getElementById("contenido");

box.addEventListener("change", (e) => {
  socket.emit("mensaje", {
    user: usuario,
    message: e.target.value,
    fecha: Math.floor(new Date().getTime() / 1000),
  });
});

socket.on("nuevo_mensaje", (data) => {
  const mensajes = data.map(({ user, message, fecha }) => {
    return `<p> ${user} dijo: ${message} - fecha ${fecha}`;
  });

  contenido.innerHTML = mensajes.join("");
});
