import BaseService from "../utils/BaseService.class.js";

class OrderService extends BaseService {
  constructor(data) {
    super(data);
  }
  
  async findOrdersByStatus(status) {
    return await this.db.find({ status });
  }
}

export default OrderService;