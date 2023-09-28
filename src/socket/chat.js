import { messageModel } from "../dao/models/message.mode.js";

const chatEvents = (socketServer) => {
  socketServer.on("connection", (socket) => {
    console.log("Se conectó", socket.id);
    socket.on("mensaje", async (data) => {
      data.fecha = new Date(); // Agrega la fecha actual
      await messageModel.create(data);
      const messages = await messageModel.find().lean();
      console.log(messages);
      socketServer.emit("nuevo_mensaje", messages);
    });
  });
};

export default chatEvents;
