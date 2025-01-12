import serverPromise from "@/index.js"
import cron from "@/utils/cron.js";
import { logger } from "@/utils/logger.js"; 
import supertest from "supertest";
import app from "@/app.js";
const api = supertest(app);

jest.mock("@/utils/cron.js", () => ({
  updateOrderStatus: jest.fn(),
}));

describe("Test app", () => {
  let server, mongoConnection;
  
  beforeAll(async () => {
    const init = await serverPromise;
    mongoConnection = init.mongoConnection;
    server = init.server;
  })
  
  afterAll(async () => {
    await mongoConnection.connection.close()
    await server.close()
  })
  
  test("should connect to MongoDB successfully", async () => {
    expect(mongoConnection.connection.readyState).toBe(1);
  });
  
  
  describe("Cron Jobs", () => {
    test("should call updateOrderStatus on startup", () => {
      expect(cron.updateOrderStatus).toHaveBeenCalled();
    });
  });
  
  
  describe("Routes", () => {
    test("should return 404 for invalid route", async () => {
      const res = await api.get("/invalid-route");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Not Found");
    });
  
    test("should return 200 for products route", async () => {
      const res = await api.get("/api/products");
      expect(res.status).toBe(200);
    });
  });
  
  
  describe("Logging Middleware", () => {  
    test("should log request details", async () => {
      const mockLog = jest.spyOn(logger, "info").mockImplementation(() => {});
      await api.get("/api/products");
      expect(mockLog).toHaveBeenCalledWith(expect.stringContaining("GET /api/products"));
      mockLog.mockRestore();
    });
  });
  
  
  describe("CORS Middleware", () => {
    test("should set CORS headers", async () => {
      const res = await api.options("/api/products");
      expect(res.headers["access-control-allow-origin"]).toBe("*");
    });
  });
  
})


