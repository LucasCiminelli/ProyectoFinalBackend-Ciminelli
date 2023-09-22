import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  products: [
    {
      _id: String,
      quantity: Number,
    },
  ],
});

const cartModel = mongoose.model(cartCollection, cartSchema);
export { cartModel };
