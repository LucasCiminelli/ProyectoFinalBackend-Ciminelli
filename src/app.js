import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";

import productsRouter from "./routes/productsRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import ProductManager from "./ProductManager.js";

const productManager = new ProductManager();
const app = express();
const httpServer = app.listen(8080, () => console.log("tuki"));
const socketServer = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");
app.use(express.static("./src/public"));

app.use((req, res, next) => {
  req.context = { socketServer };
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

socketServer.on("connection", async (socket) => {
  console.log("Cliente conectado", socket.id);
  socket.emit("products", await productManager.getProducts());
});
