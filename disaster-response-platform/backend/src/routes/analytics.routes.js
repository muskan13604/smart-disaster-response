const express = require('express');
const { sendResponse } = require('../utils/response.util');
const Disaster = require('../models/disaster.model');
const SOS = require('../models/sos.model');
const Resource = require('../models/resource.model');
const redisClient = require('../config/redis');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const router = express.Router();

router.get('/dashboard', protect, authorize('Admin', 'Rescue Team'), async (req, res) => {
    try {
        const cacheKey = 'analytics:dashboard';
        const cachedData = await redisClient.get(cacheKey);
        
        if (cachedData) {
            return sendResponse(res, 200, true, 'Analytics fetched (cached)', JSON.parse(cachedData));
        }

        // Parallel aggregations for performance
        const [disasterStats, sosStats, resourceStats, activeDisasters, recentSOS] = await Promise.all([
            Disaster.aggregate([
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]),
            SOS.aggregate([
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]),
            Resource.aggregate([
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]),
            Disaster.countDocuments({ status: 'Active' }),
            SOS.find({ status: 'Pending' }).sort({ createdAt: -1 }).limit(5).populate('citizenId', 'name')
        ]);

        const formatStats = (arr) => arr.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {});

        const data = {
            disasters: formatStats(disasterStats),
            sos: formatStats(sosStats),
            resources: formatStats(resourceStats),
            activeDisastersCount: activeDisasters,
            recentSOS
        };

        // Cache for 60 seconds
        await redisClient.setex(cacheKey, 60, JSON.stringify(data));

        sendResponse(res, 200, true, 'Analytics fetched', data);
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
});

module.exports = router;
