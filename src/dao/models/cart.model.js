import mongoose from "mongoose";
import monoosePaginate from "mongoose-paginate-v2";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      quantity: Number,
    },
  ],
  default: [],
});

cartSchema.plugin(monoosePaginate);
const cartModel = mongoose.model(cartCollection, cartSchema);
export { cartModel };
