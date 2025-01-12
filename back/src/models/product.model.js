import { Schema, model } from "mongoose";

const productSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image_url: String,
});

export default model('Product', productSchema);