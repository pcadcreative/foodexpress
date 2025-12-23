const express = require('express');
const router = express.Router();
const internalController = require('../controllers/internalController');
const internalAuthMiddleware = require('../middleware/internalAuth');

router.post('/update', internalAuthMiddleware, internalController.updateRecommendation);

module.exports = router;
