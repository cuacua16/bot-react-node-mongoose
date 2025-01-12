import ProductService from "@/services/products.service.js";
import Product from "@/models/product.model.js";

const products = [{ _id: '1', name: 'Product sushi', type: "sushi", price: 20 }, { _id: '2', name: 'Product drink', type: "drink", price: 30 }];

jest.mock("@/models/product.model.js", () => ({
  modelName: "Product",
  collection: { collectionName: "products" },
  create: jest.fn((body) => body),
  insertMany: jest.fn((products) => products.map((product) => ({ _id: `mockId-${product.name}`, ...product }))),
  find: jest.fn((query) => {
    return products.filter((product) => !Object.entries(query).length ? true : Object.entries(query).every(([key, value]) => product[key] == value));
  }),
  findById: jest.fn((id) => products.find((p) => p._id === id) || null),
  findByIdAndUpdate: jest.fn((id, update) => {
    const product = products.find((p) => p._id === id);
    if (!product) return null;
    return { ...product, ...update };
  }),
  findByIdAndDelete: jest.fn((id) => {
    const index = products.findIndex((p) => p._id === id);
    if (index === -1) return null;
    const [deletedProduct] = products.splice(index, 1);
    return deletedProduct;
  }),
}));

describe("ProductService", () => {
  let productService;

  beforeEach(() => {
    jest.clearAllMocks();
    productService = new ProductService({ model: Product });
  });

  describe("find()", () => {
    test("should find products with matching query", async () => {
      const result = await productService.find({ type: "sushi" });
      expect(Product.find).toHaveBeenCalledWith({ type: "sushi" });
      expect(result).toEqual(products.filter(p => p.type == 'sushi'));
    });

    test("should return all products when no query is provided", async () => {
      const result = await productService.find();
      expect(Product.find).toHaveBeenCalledWith({});
      expect(result).toHaveLength(products.length);
    });
  });

  describe("findById()", () => {
    test("should find a product by ID", async () => {
      const result = await productService.findById(products[0]._id);
      expect(Product.findById).toHaveBeenCalledWith(products[0]._id);
      expect(result).toEqual(products[0]);
    });

    test("should return null if product is not found", async () => {
      const result = await productService.findById("nonexistentId");
      expect(Product.findById).toHaveBeenCalledWith("nonexistentId");
      expect(result).toBeNull();
    });
  });

  describe("create()", () => {
    test("should create a new product", async () => {
      const mockProduct = { type: "sushi", name: "Test", price: 500, _id: "test_id" };
      const result = await productService.create(mockProduct);
      expect(Product.create).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual({ ...mockProduct });
    });
  });

  describe("updateById()", () => {
    test("should update a product by ID", async () => {
      const updatedData = { name: "SushiTest", price: 1100 };
      const result = await productService.updateById(products[0]._id, updatedData);
      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(products[0]._id, updatedData, { new: true });
      expect(result).toEqual({ _id: products[0]._id, type: products[0].type, ...updatedData });
    });

    test("should return null if product to update is not found", async () => {
      const updatedData = { name: "Nonexistent Product" };
      const result = await productService.updateById("nonexistentId", updatedData);
      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith("nonexistentId", updatedData, { new: true });
      expect(result).toBeNull();
    });
  });

  describe("deleteById()", () => {
    test("should delete a product by ID", async () => {
      const productToDelete = products[0];
      const result = await productService.deleteById(productToDelete._id);
      expect(Product.findByIdAndDelete).toHaveBeenCalledWith(productToDelete._id);
      expect(result).toEqual(productToDelete);
    });

    test("should return null if product to delete is not found", async () => {
      const result = await productService.deleteById("nonexistentId");
      expect(Product.findByIdAndDelete).toHaveBeenCalledWith("nonexistentId");
      expect(result).toBeNull();
    });
  });

  describe("setQuery()", () => {
    test("should convert numeric fields to numbers", () => {
      const query = { price: "500", type: "sushi" };
      productService.model.schema = {
        path: (key) => ({ instance: key === "price" ? "Number" : undefined }),
      };
      const result = productService.setQuery(query);
      expect(result.price).toBe(500);
      expect(result.type).toBe("sushi");
    });
  });
});
