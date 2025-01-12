// import mongoose from "mongoose";
import { connectMongoDB } from "../config/db.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

const deleteData = async () => {
  try {
    await connectMongoDB();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log("Base de datos vaciada correctamente")
  } catch (error) {
    console.error("Error eliminando los datos:", error);
  } finally {
    process.exit(1)
  }
};

(async () => {
  await deleteData();
})();
