import BaseService from "./BaseService.class.js";
import Product from "../models/product.model.js"

class OrderService extends BaseService {
  constructor(data) {
    super(data);
  }
  
  async find(query = {}) {
    return await this.db.find(this.setQuery(query)).populate({
      path: "items.product",
      model: Product
    }).populate("user");
  }

  async findById(id) {
    return await this.db.findById(id).populate({
      path: "items.product",
      model: Product
    }).populate("user");
  }
}

export default OrderService;