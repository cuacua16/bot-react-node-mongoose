import ProductService from "../services/products.service.js";
import Product from "../models/product.model.js"
import { resLog } from "../utils/logger.js";
import BaseController from "./BaseController.class.js";

class ProductController extends BaseController {
  constructor(service, name) {
    super(service, name)
  }

  handleNotFound(req, res) {
    resLog(req, res, 404, { message: "Product not found" })
  }
}

export default new ProductController(new ProductService({model: Product}), "product");