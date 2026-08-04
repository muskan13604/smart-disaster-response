const Disaster = require('../models/disaster.model');

class DisasterRepository {
    async create(data) {
        return await Disaster.create(data);
    }

    async findById(id) {
        return await Disaster.findById(id);
    }

    async update(id, data) {
        return await Disaster.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await Disaster.findByIdAndDelete(id);
    }

    async findAll(query, limit, skip) {
        return await Disaster.find(query).limit(limit).skip(skip).sort({ createdAt: -1 });
    }

    async count(query) {
        return await Disaster.countDocuments(query);
    }
}
module.exports = new DisasterRepository();
