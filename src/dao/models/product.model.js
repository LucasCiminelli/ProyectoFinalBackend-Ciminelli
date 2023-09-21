import mongoose from "mongoose";

const productCollection = "products";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  stock: String,
  category: String,
  thumbnails: Array,
});

const productModel = mongoose.model(productCollection, productSchema);
export { productModel };
