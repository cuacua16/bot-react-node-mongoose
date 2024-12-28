class BaseService {
  constructor({model, db}) {
    console.log("Service instance", model)
    if (!model) throw new Error("Model is required to initialize the service");
    this.model = model;
    this.db = db || this.model;
  }

  async create(body) {
    return await this.db.create(body);
  }
  
  async insertMany(body) {
    return await this.db.insertMany(body);
  }

  async find(query = {}) {
    return await this.db.find(this.setQuery(query));
  }

  async findById(id) {
    return await this.db.findById(id);
  }

  async updateById(id, body) {
    return await this.db.findByIdAndUpdate(id, body);
  }
  
  async updateOne(filter, body) {
    return await this.db.updateOne(filter, body);
  }
  
  async updateMany(filter, body) {
    return await this.db.updateMany(filter, body);
  }

  async deleteById(id) {
    return await this.db.findByIdAndDelete(id);
  }
  
  async deleteMany(filter) {
    return await this.db.deleteMany(filter);
  }
  
  
  setQuery(query={}) {
    for (const key in query) {
      if (this.model.schema?.path(key)) {
        if (this.model.schema?.path(key).instance === "Number" && !isNaN(query[key])) {
          query[key] = Number(query[key]);
        }
      }
    }
    return query;
  }
}

export default BaseService;