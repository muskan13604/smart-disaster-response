const express = require('express');
const disasterController = require('../controllers/disaster.controller');
const { protect } = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

router.route('/')
    .get(disasterController.getAll)
    .post(protect, roleMiddleware.authorize('Admin'), disasterController.create);

router.route('/:id')
    .put(protect, roleMiddleware.authorize('Admin'), disasterController.update)
    .delete(protect, roleMiddleware.authorize('Admin'), disasterController.delete);

module.exports = router;
