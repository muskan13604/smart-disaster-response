const sosService = require('../services/sos.service');
const { sendResponse } = require('../utils/response.util');

class SOSController {
    async trigger(req, res) {
        try {
            const sos = await sosService.triggerSOS(req.body, req.files, req.user, req.app.get('io'));
            sendResponse(res, 201, true, 'SOS triggered successfully', sos);
        } catch (error) {
            sendResponse(res, 400, false, error.message);
        }
    }

    async updateStatus(req, res) {
        try {
            const { status, assignedTo } = req.body;
            const sos = await sosService.updateSOSStatus(req.params.id, status, assignedTo, req.app.get('io'));
            sendResponse(res, 200, true, 'SOS status updated', sos);
        } catch (error) {
            sendResponse(res, 400, false, error.message);
        }
    }

    async getHistory(req, res) {
        try {
            const result = await sosService.getSOSHistory(req.query);
            sendResponse(res, 200, true, 'SOS history fetched', result);
        } catch (error) {
            sendResponse(res, 500, false, error.message);
        }
    }
}

module.exports = new SOSController();
