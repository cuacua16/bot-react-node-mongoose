import supertest from 'supertest';
import app from '@/app.js';
const api = supertest(app);

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


describe('Order API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/orders - should return all orders', async () => {
    const response = await api.get('/api/orders');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(orders.length);
    expect(response.body[0].status).toBe(orders.find(o => o._id == '1').status);
  });

  test('POST /api/orders - should create a new order', async () => {
    const newOrder = { status: 'Pending', price: 200, items: [{ product: 'mockProductId', quantity: 2 }], user: 'mockUserId' };
    const response = await api.post('/api/orders').send(newOrder);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id', 'mockOrderId');
    expect(response.body.status).toBe(newOrder.status);
  });

  test('GET /api/orders/:id - should return an order by ID', async () => {
    const response = await api.get('/api/orders/1');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(orders.find(o => o._id === '1').status);
  });

  test('GET /api/orders/:id - should return 404 when order not found', async () => {
    const response = await api.get('/api/orders/999');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'Order not found');
  });

  test('PUT /api/orders/:id - should update an order', async () => {
    const updatedOrder = { status: 'Completed', price: 200 };
    const response = await api.put('/api/orders/1').send(updatedOrder);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(updatedOrder.status);
  });

  test('PUT /api/orders/:id - should return 404 when order to update is not found', async () => {
    const updatedOrder = { status: 'Completed', price: 200 };
    const response = await api.put('/api/orders/999___').send(updatedOrder);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'Order not found');
  });

  test('DELETE /api/orders/:id - should delete an order', async () => {
    const response = await api.delete('/api/orders/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Order deleted. Id: 1');
  });

  test('DELETE /api/orders/:id - should return 404 when order to delete is not found', async () => {
    const response = await api.delete('/api/orders/999___');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'Order not found');
  });
});
