const express = require('express');
const { sendResponse } = require('../utils/response.util');
const locationTrie = require('../utils/trie.util');
const { mockGraph } = require('../utils/graph.util');
const { allocateResourcesDP } = require('../utils/dp.util');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/algorithms/search:
 *   get:
 *     summary: Location autocomplete search using Trie
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 */
router.get('/search', (req, res) => {
    const query = req.query.q || '';
    const results = locationTrie.searchPrefix(query);
    sendResponse(res, 200, true, 'Search results', results);
});

/**
 * @swagger
 * /api/algorithms/route:
 *   post:
 *     summary: Calculate shortest route using Dijkstra
 */
router.post('/route', protect, (req, res) => {
    const { start, end } = req.body;
    try {
        const path = mockGraph.dijkstra(start, end);
        sendResponse(res, 200, true, 'Route calculated', { path });
    } catch (err) {
        sendResponse(res, 400, false, 'Failed to calculate route');
    }
});

/**
 * @swagger
 * /api/algorithms/allocate:
 *   post:
 *     summary: Allocate resources optimally using DP
 */
router.post('/allocate', protect, (req, res) => {
    const { totalResources, disasters } = req.body;
    // Expected disasters format: [{ id, requiredResources, livesSavedEstimate, name }]
    try {
        const result = allocateResourcesDP(totalResources, disasters);
        sendResponse(res, 200, true, 'Resources allocated', result);
    } catch (err) {
        sendResponse(res, 400, false, 'Failed to allocate resources');
    }
});

module.exports = router;
