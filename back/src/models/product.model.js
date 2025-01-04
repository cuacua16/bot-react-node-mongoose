import { Schema, model } from "mongoose";

const productSchema = new Schema({
  type: String,
  name: String,
  price: Number,
  image_url: String,
});

export default model('Product', productSchema);