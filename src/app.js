// Import de librerías
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import dotenv from "dotenv";

// import de routers y managers
import productsRouter from "./routes/productsRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import userRouter from "./routes/userRouter.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import { logger } from "./utils/logger.js";
import { errors } from "./middlewares/errors.js";

import cookieParser from "cookie-parser";

//import { messageModel } from "./dao/models/message.mode.js";
import chatEvents from "./socket/chat.js";
import productEvents from "./socket/products.js";

dotenv.config();

//conexión a la base de datos de MongoDB (Mongo Atlas)
mongoose.connect(process.env.URL_MONGO);

//inicialización del servidor express y configurando servidor de web sockets
const app = express();
const PORT = process.env.EXPRESS_PORT;

const httpServer = app.listen(PORT, () => console.log("tuki"));
app.use(errors);
const socketServer = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.URL_MONGO,
      ttl: 15,
    }),
    secret: process.env.SECRET_MONGO,
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

app.use(passport.session());
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

app.use("/", viewsRouter);
app.use("/api", userRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.get("/loggerTest", (req, res)=>{

res.send("Checking the logs")
})

chatEvents(socketServer);
productEvents(socketServer);
