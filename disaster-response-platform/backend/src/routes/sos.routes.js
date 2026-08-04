const express = require('express');
const sosController = require('../controllers/sos.controller');
const { protect } = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

router.post('/', protect, upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'voiceNote', maxCount: 1 }]), sosController.trigger);

router.get('/history', protect, roleMiddleware.authorize('Admin', 'Rescue Team', 'NGO', 'Volunteer'), sosController.getHistory);

router.put('/:id/status', protect, roleMiddleware.authorize('Admin', 'Rescue Team'), sosController.updateStatus);

module.exports = router;
