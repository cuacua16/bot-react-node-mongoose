import BaseService from "./BaseService.class.js";

class OrderService extends BaseService {
  constructor(data) {
    super(data);
  }
  
  async find(query = {}) {
    return await this.db.find(this.setQuery(query)).populate("products").populate("user");
  }

  async findById(id) {
    return await this.db.findById(id).populate("products").populate("user");
  }
  
  async findOrdersByStatus(status) {
    return await this.db.find({ status });
  }
}

export default OrderService;