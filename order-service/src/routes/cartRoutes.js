const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/auth');

router.post('/add', authMiddleware, cartController.addToCart);
router.put('/update', authMiddleware, cartController.updateCart);
router.get('/', authMiddleware, cartController.getCart);
router.delete('/clear', authMiddleware, cartController.clearCart);

module.exports = router;
