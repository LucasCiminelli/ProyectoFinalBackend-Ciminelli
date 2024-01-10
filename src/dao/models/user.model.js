import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  age: Number,
  password: String,
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  tickets: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tickets",
      },
    ],
    default: [],
  },
  rol: {
    type: String,
    default: "User",
  },
  documents: {
    type: [
      {
        name: String,
        reference: String,
      },
    ],
  },
  last_connection: {
    type: Date,
    default: Date.now,
    action: {
      type: String,
      enum: ["login", "logout"],
      required: true,
    },
  },
});

const userModel = mongoose.model(userCollection, userSchema);

export { userModel };
