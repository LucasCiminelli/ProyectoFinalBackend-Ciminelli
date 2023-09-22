// Import de librerías
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";

// import de routers y managers
import productsRouter from "./routes/productsRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import ProductManager from "./dao/filesystem/ProductManager.js";

import { messageModel } from "./dao/models/message.mode.js";

//conexión a la base de datos de MongoDB (Mongo Atlas)
mongoose.connect(
  "mongodb+srv://lucasaciminelli:E6dS5N0gwUm3VgLw@cluster0.0ozvnjh.mongodb.net/?retryWrites=true&w=majority"
);

//creando nueva instancia de productManager
const productManager = new ProductManager();

//inicialización del servidor express y configurando servidor de web sockets
const app = express();
const httpServer = app.listen(8080, () => console.log("tuki"));
const socketServer = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Configuración de Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

app.use(express.static("./src/public"));

app.use((req, res, next) => {
  req.context = { socketServer };
  next();
});

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

// socketServer.on("connection", async (socket) => {
//   console.log("Cliente conectado", socket.id);
//   socket.emit("products", await productManager.getProducts());
// });

socketServer.on("connection", (socket) => {
  console.log("Se conectó", socket.id);
  socket.on("mensaje", async (data) => {
    data.fecha = new Date();  // Agrega la fecha actual
    await messageModel.create(data);
    const messages = await messageModel.find().lean();
    console.log(messages);
    socketServer.emit("nuevo_mensaje", messages);
  });
});
