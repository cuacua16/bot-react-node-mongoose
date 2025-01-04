import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  status: {
    type: String,
    default: "Pending"
  },
  delivery_at: Date,
  price: Number,
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: Number
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true
});

export default model('Order', orderSchema);