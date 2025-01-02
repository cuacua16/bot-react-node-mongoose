import autoBind from 'auto-bind';
import { resLog } from '../utils/logger.js';

class BaseController {
  constructor(service, name) {
    if (!service) throw new Error("Service is required to initialize the controller");
    this.service = service;
    this.collectionName = this.service.model.collection?.collectionName;
    this.modelName = this.service.model.modelName;
    autoBind(this);
  }
  
  async create(req, res) {
    try {
      const newRecord = await this.service.create(req.body);
      return resLog(req, res, 201, newRecord)
    } catch (error) {
      return resLog(req, res, 500, { error: error.message })
    }
  }

  async find(req, res) {
    try {
      const records = await this.service.find(req.query);
      return resLog(req, res, 200, records)
    } catch (error) {
      return resLog(req, res, 500, { error: error.message })
    }
  }

  async findById(req, res) {
    try {
      const record = await this.service.findById(req.params.id);
      if (!record) return this.handleNotFound(req, res);
      return resLog(req, res, 200, record)
    } catch (error) {
      return resLog(req, res, 500, { error: error.message })
    }
  }

  async updateById(req, res) {
    try {
      const updatedRecord = await this.service.updateById(req.params.id, req.body);
      if (!updatedRecord) return this.handleNotFound(req, res);
      return resLog(req, res, 200, updatedRecord)
    } catch (error) {
      return resLog(req, res, 500, { error: error.message })
    }
  }

  async deleteById(req, res) {
    try {
      const deletedRecord = await this.service.deleteById(req.params.id);
      if (!deletedRecord) return this.handleNotFound(req, res);
      return resLog(req, res, 200, { message: `${this.modelName} deleted. Id: ${req.params.id}` })
    } catch (error) {
      return resLog(req, res, 500, { error: error.message })
    }
  }
  
  handleNotFound(req, res) {
    return resLog(req, res, 404, { message: `${this.modelName} not found` })
  }
}

export default BaseController;
