const disasterRepository = require('../repositories/disaster.repository');
const redisClient = require('../config/redis');

class DisasterService {
    async createDisaster(data, io) {
        const disaster = await disasterRepository.create(data);
        // Invalidate cache
        await this.clearCache();
        
        // Emit realtime event
        if (io) {
            io.emit('new_disaster', disaster);
        }
        return disaster;
    }

    async updateDisaster(id, data, io) {
        const disaster = await disasterRepository.update(id, data);
        if (!disaster) throw new Error('Disaster not found');
        
        await this.clearCache();

        if (io) {
            io.emit('update_disaster', disaster);
        }
        return disaster;
    }

    async deleteDisaster(id, io) {
        const disaster = await disasterRepository.delete(id);
        if (!disaster) throw new Error('Disaster not found');

        await this.clearCache();

        if (io) {
            io.emit('delete_disaster', id);
        }
        return disaster;
    }

    async getDisasters(queryParams) {
        const { page = 1, limit = 10, search, status, type } = queryParams;
        
        // Generate a cache key based on query params
        const cacheKey = `disasters:${JSON.stringify(queryParams)}`;
        
        // Check Redis first
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const query = {};
        if (search) {
            query.$text = { $search: search };
        }
        if (status) query.status = status;
        if (type) query.type = type;

        const skip = (page - 1) * limit;

        const disasters = await disasterRepository.findAll(query, parseInt(limit), skip);
        const total = await disasterRepository.count(query);

        const result = {
            disasters,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        };

        // Cache the result for 5 minutes
        await redisClient.setex(cacheKey, 300, JSON.stringify(result));

        return result;
    }

    async clearCache() {
        const keys = await redisClient.keys('disasters:*');
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
    }
}

module.exports = new DisasterService();
