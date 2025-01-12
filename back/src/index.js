import app from "./app.js";
import { connectMongoDB } from "./config/db.js";
import orderModel from "./models/order.model.js";
import productModel from "./models/product.model.js";
import { createSeedData } from "./utils/seedDB.js";
import cron from './utils/cron.js'

const init = async () => {
  const mongoConnection = await connectMongoDB();

  if (process.env.SEED_DB === 'true' && process.env.NODE_ENV !== 'test') {
    const orders = await orderModel.find();
    const products = await productModel.find();
    if (!orders.length && !products.length) {
      console.log("Cargando datos iniciales en la base de datos...");
      await createSeedData();
    }
  }

  cron.updateOrderStatus();

  const server = app.listen(process.env.API_PORT, () => {
    console.log(`Server listening on port ${process.env.API_PORT}`);
  });

  return { server, mongoConnection };
};

export default init();