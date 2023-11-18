import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const ticketColletion = "tickets";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  purchase_datatime: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
  },
  purchaser: {
    type: String,
    ref: "users",
  },
});

const ticketModel = mongoose.model(ticketColletion, ticketSchema);

export { ticketModel };
