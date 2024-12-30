import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  status: {
    type: String,
    default: "Pending"
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
  },
}, {
  timestamps: true
});

export default model('Order', orderSchema);