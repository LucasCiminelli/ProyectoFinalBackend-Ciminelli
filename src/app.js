// Import de librerías
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";

// import de routers y managers
import productsRouter from "./routes/productsRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import userRouter from "./routes/userRouter.js";
import ProductManager from "./dao/filesystem/ProductManager.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

//import { messageModel } from "./dao/models/message.mode.js";
import chatEvents from "./socket/chat.js";
import productEvents from "./socket/products.js";

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

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://lucasaciminelli:E6dS5N0gwUm3VgLw@cluster0.0ozvnjh.mongodb.net/?retryWrites=true&w=majority",
      ttl: 15,
    }),
    secret: "asd123",
    resave: false,
    saveUninitialized: false,
  })
);

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
app.use("/api", userRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

chatEvents(socketServer);
productEvents(socketServer);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
