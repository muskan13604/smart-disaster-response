const disasterService = require('../services/disaster.service');
const { sendResponse } = require('../utils/response.util');

class DisasterController {
    async create(req, res) {
        try {
            const disaster = await disasterService.createDisaster(req.body, req.app.get('io'));
            sendResponse(res, 201, true, 'Disaster created', disaster);
        } catch (error) {
            sendResponse(res, 400, false, error.message);
        }
    }

    async update(req, res) {
        try {
            const disaster = await disasterService.updateDisaster(req.params.id, req.body, req.app.get('io'));
            sendResponse(res, 200, true, 'Disaster updated', disaster);
        } catch (error) {
            sendResponse(res, 400, false, error.message);
        }
    }

    async delete(req, res) {
        try {
            await disasterService.deleteDisaster(req.params.id, req.app.get('io'));
            sendResponse(res, 200, true, 'Disaster deleted');
        } catch (error) {
            sendResponse(res, 400, false, error.message);
        }
    }

    async getAll(req, res) {
        try {
            const result = await disasterService.getDisasters(req.query);
            sendResponse(res, 200, true, 'Disasters fetched', result);
        } catch (error) {
            sendResponse(res, 500, false, error.message);
        }
    }
}

module.exports = new DisasterController();
