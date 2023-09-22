import mongoose from "mongoose";

const messageCollection = "messages";

const messageSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  fecha: String,
});

const messageModel = mongoose.model(messageCollection, messageSchema);
export { messageModel };
