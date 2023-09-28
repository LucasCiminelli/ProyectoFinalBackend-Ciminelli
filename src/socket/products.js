import { productModel } from "../dao/models/product.model.js";

const productEvents = (socketServer) => {
  socketServer.on("connection", async (socket) => {
    console.log("Cliente conectado", socket.id);
    socket.emit("products", await productModel.find().lean());
  });
};

export default productEvents;
