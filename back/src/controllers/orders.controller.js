import OrderService from "../services/orders.service.js";
import Order from "../models/order.model.js"
import { resLog } from "../utils/logger.js";
import BaseController from "../utils/BaseController.class.js";

class OrderController extends BaseController {
  constructor(service, name) {
    super(service, name)
  }

  handleNotFound(req, res) {
    resLog(req, res, 404, { message: "Order not found" })
  }
}

export default new OrderController(new OrderService({model: Order}), "order");