import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const axios_ = axios.create({ baseURL });

class ApiService {
  constructor(resource, axios) {
    this.resource = resource;
    this.axios = axios;
  }

  async get(params) {
    return this.axios.get(`/${this.resource}`, { params });
  }

  async getById(id) {
    return this.axios.get(`/${this.resource}/${id}`);
  }

  async create(body) {
    return this.axios.post(`/${this.resource}`, body);
  }

  async updateById(id, body) {
    return this.axios.put(`/${this.resource}/${id}`, body);
  }

  async delete(id) {
    return this.axios.delete(`/${this.resource}/${id}`);
  }
}

const api = {
  users: new ApiService("users", axios_),
  orders: new ApiService("orders", axios_),
  products: new ApiService("products", axios_),
};

export default api;

