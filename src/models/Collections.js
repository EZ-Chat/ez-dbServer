'use strict';

module.exports = class Collection {
  constructor(model) {
    this.model = model;
  }

  async read(id) {
    try {
      let records;
      if (id) {
        records = await this.model.findById(id);
      } else {
        records = await this.model.find();
      }
      return records;
    } catch (error) {
      return error;
    }
  }

  async create(json) {
    try {
      const record = await this.model.create(json);
      return record;
    } catch (error) {
      return error;
    }
  }

  async update(id, json) {
    try {
      const updatedRecord = await this.model.findOneAndUpdate({ id }, json);
      return updatedRecord;
    } catch (error) {
      return error;
    }
  }

  async delete(id) {
    try {
      const deletedRows = await this.model.deleteOne({ id });
      return deletedRows;
    } catch (error) {
      return error;
    }
  }
};
