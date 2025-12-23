const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const menuController = require('../controllers/menuController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, restaurantController.getRestaurants);
router.get('/:restaurantId', authMiddleware, restaurantController.getRestaurantById);
router.get('/:restaurantId/menu', authMiddleware, menuController.getMenu);

module.exports = router;
