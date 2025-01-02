import express from "express";
import cors from "cors";
import { log, resLog } from "./utils/logger.js";
import ProductRoutes from './routes/products.routes.js';
import OrderRoutes from './routes/orders.routes.js';
import UserRoutes from './routes/users.routes.js';

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(async (req, res, next) => {
  log("info", `${req.method} ${req.originalUrl} ${req.body ? `Body: ${JSON.stringify(req.body)}`: ''}`);
  req.start = Date.now();
  next();
})

app.use("/api/products", ProductRoutes);
app.use("/api/orders", OrderRoutes);
app.use("/api/users", UserRoutes);

app.use((req, res) => {
  return resLog(req, res, 404, {message: "Not Found"})
});

export default app;