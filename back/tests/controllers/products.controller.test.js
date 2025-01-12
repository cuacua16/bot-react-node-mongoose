import supertest from 'supertest';
import { validateFields } from '@/utils/validation.js';
import app from '@/app.js';
const api = supertest(app);

const mockValidateFields = validateFields;

const products = [{ _id: '1', name: 'Product sushi', type: "sushi", price: 20 }, { _id: '2', name: 'Product drink', type: "drink", price: 30 }];

jest.mock('@/models/product.model.js', () => {
  return {
    modelName: "Product",
    collection: { collectionName: "products" },
    create: jest.fn((body) => {
      mockValidateFields(body, ["name", "type"])
      return {
        _id: 'mockId',
        ...body,
      }
    }),
    insertMany: jest.fn(),
    find: jest.fn(() => products),
    findById: jest.fn((id) => products.find(product => product._id === id)),
    findByIdAndUpdate: jest.fn((id, update) => {
      const product = products.find(product => product._id === id);
      if (!product) return null;
      return { ...product, ...update };
    }),
    findByIdAndDelete: jest.fn((id) => {
      const index = products.findIndex(product => product._id === id);
      if (index === -1) return null;
      const deletedProduct = products.splice(index, 1)[0];
      return deletedProduct;
    }),
  };
});

describe('Product API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/products - should return all products', async () => {
    const response = await api.get('/api/products');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe(products.find(p => p._id == 1).name);
  });

  test('GET /api/products - should return empty array when no products', async () => {
    jest.spyOn(require('@/models/product.model.js'), 'find').mockResolvedValue([]);
    const response = await api.get('/api/products');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  test('POST /api/products - should create a new product', async () => {
    const newProduct = { name: 'Test Product', type: "sushi", price: 100 };
    const response = await api.post('/api/products').send(newProduct);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id', 'mockId');
    expect(response.body.name).toBe(newProduct.name);
  });

  test('POST /api/products - should return error when required fields are missing', async () => {
    const invalidProduct = { price: 100 };
    const response = await api.post('/api/products').send(invalidProduct);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('GET /api/products/:id - should return a product by ID', async () => {
    const response = await api.get('/api/products/1');
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(products.find(p => p._id == 1).name);
  });

  test('GET /api/products/:id - should return 404 when product not found', async () => {
    const response = await api.get('/api/products/999');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'Product not found');
  });

  test('PUT /api/products/:id - should update a product', async () => {
    const updatedProduct = { name: 'Updated Product', price: 150, type: 'drink' };
    const response = await api.put('/api/products/1').send(updatedProduct);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(updatedProduct.name);
  });
  
  test('PUT /api/products/:id - should update only the provided fields', async () => {
    const updatedProduct = { price: 2550 };
    const response = await api.put('/api/products/1').send(updatedProduct);
    expect(response.statusCode).toBe(200);
    expect(response.body.price).toBe(updatedProduct.price);
    expect(response.body.name).toBe(products.find(p => p._id === '1').name);
  });

  test('PUT /api/products/:id - should return 404 when product to update is not found', async () => {
    const updatedProduct = { name: 'Updated Product', price: 150, type: 'drink' };
    const response = await api.put('/api/products/999___').send(updatedProduct);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'Product not found');
  });

  test('DELETE /api/products/:id - should delete a product', async () => {
    const response = await api.delete('/api/products/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Product deleted. Id: 1');
  });
  
  test('DELETE /api/products/:id - should delete a product and update the product list', async () => {
    const response = await api.delete('/api/products/2');
    expect(response.statusCode).toBe(200);
    const getResponse = await api.get('/api/products');
    expect(getResponse.body).not.toContainEqual(expect.objectContaining({ _id: '2' }));
  });

  test('DELETE /api/products/:id - should return 404 when product to delete is not found', async () => {
    const response = await api.delete('/api/products/999___');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'Product not found');
  });
});
