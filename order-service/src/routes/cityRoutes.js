const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, cityController.getCities);

module.exports = router;
