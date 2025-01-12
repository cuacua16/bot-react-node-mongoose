import OrderService from "@/services/orders.service.js";
import Order from "@/models/order.model.js";

jest.mock("@/models/product.model.js", () => jest.fn());

const orders = [
  { _id: '1', status: 'Pending', price: 1200, items: [{ product: 'mockProductId', quantity: 2 }], user: 'mockUserId' },
  { _id: '2', status: 'Delivered', price: 1250, items: [{ product: 'mockProductId', quantity: 3 }], user: 'mockUserId' }
];

jest.mock('@/models/order.model.js', () => {
  return {
    modelName: "Order",
    collection: { collectionName: "orders" },
    create: jest.fn((body) => {
      return { _id: 'mockOrderId', ...body };
    }),
    insertMany: jest.fn(),
    find: jest.fn((query) => ({
      populate: jest.fn().mockImplementation(() => ({
        populate: jest.fn(() => orders.filter(order => !Object.entries(query).length ? true : Object.entries(query).every(([key, value]) => order[key] == value)))
      }))
    })),
    findById: jest.fn((id) => ({
      populate: jest.fn().mockImplementation(() => ({
        populate: jest.fn(() => orders.find(o => o._id == id) || null)
      }))
    })),
    findByIdAndUpdate: jest.fn((id, update) => {
      const order = orders.find(order => order._id === id);
      if (!order) return null;
      return { ...order, ...update };
    }),
    findByIdAndDelete: jest.fn((id) => {
      const index = orders.findIndex(order => order._id === id);
      if (index === -1) return null;
      const deletedOrder = orders.splice(index, 1)[0];
      return deletedOrder;
    }),
  };
});


describe("OrderService", () => {
  let orderService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    orderService = new OrderService({ model: Order });
  });

  describe("find()", () => {
    test("should find orders and populate fields", async () => {
      const result = await orderService.find();
      expect(Order.find).toHaveBeenCalledWith({});
      expect(result).toEqual(orders);
    });
  });

  describe("findById()", () => {
    test("should find order by ID and populate fields", async () => {
      const result = await orderService.findById(orders[0]._id);
      expect(Order.findById).toHaveBeenCalledWith(orders[0]._id);
      expect(result).toEqual(orders[0]);
    });

    test("should return null if order is not found", async () => {
      const result = await orderService.findById("invalidId");
      expect(Order.findById).toHaveBeenCalledWith("invalidId");
      expect(result).toBeNull();
    });
  });

  describe("findOrdersByStatus()", () => {
    test("should find orders by status", async () => {
      const result = await orderService.find({ status: "Pending" });
      expect(Order.find).toHaveBeenCalledWith({ status: "Pending" });
      expect(result).toHaveLength(orders.filter(o => o.status == 'Pending').length)
      expect(result).toEqual(orders.filter(o => o.status == 'Pending'));
    });

    test("should return an empty array if no orders are found", async () => {
      const result = await orderService.find({ status: "NonexistentStatus" });
      expect(Order.find).toHaveBeenCalledWith({ status: "NonexistentStatus" });
      expect(result).toEqual([]);
    });
  });

  describe("create()", () => {
    test("should create a new order", async () => {
      const mockOrder = { _id: "1", status: "Pending" };
      const result = await orderService.create(mockOrder);
      expect(Order.create).toHaveBeenCalledWith(mockOrder);
      expect(result).toEqual(mockOrder);
    });
  });

  describe("setQuery()", () => {
    test("should convert numeric fields to numbers", () => {
      const query = { price: "1200", status: "Pending", user: "mockUserId" };
      orderService.model.schema = {
        path: (key) => ({ instance: key === "price" ? "Number" : undefined }),
      };
      const result = orderService.setQuery(query);
      expect(result.price).toBe(1200);
      expect(result.status).toBe("Pending");
      expect(result.user).toBe("mockUserId");
    });
  });
});
