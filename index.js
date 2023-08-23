const http = require("http");

const server = http.createServer((request, response) => {
  response.end("Mi primer Hola Mundo desde backend");
});

server.listen(8080, () => {
  console.log("Servidor iniciado en el puerto 8080");
});
