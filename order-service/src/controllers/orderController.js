const Order = require('../models/Order');
const Cart = require('../models/Cart');
const axios = require('axios');

exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { deliveryAddress, idempotencyKey } = req.body;
    
    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Valid delivery address is required'
      });
    }
    
    if (idempotencyKey) {
      const existingOrder = await Order.findOne({ idempotencyKey });
      if (existingOrder) {
        return res.json({
          success: true,
          message: 'Order already exists',
          data: existingOrder
        });
      }
    }
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }
    
    const order = new Order({
      userId,
      restaurantId: cart.restaurantId,
      items: cart.items,
      totalAmount: cart.totalAmount,
      deliveryAddress,
      idempotencyKey,
      status: 'PENDING'
    });
    
    await order.save();
    
    cart.items = [];
    cart.restaurantId = null;
    cart.totalAmount = 0;
    await cart.save();
    
    try {
      const orderedItems = order.items.map(item => item.name);
      
      await axios.post(
        `${process.env.RECOMMENDATION_SERVICE_URL}/internal/recommendation/update`,
        {
          userId: userId,
          restaurantId: order.restaurantId.toString(),
          orderedItems
        },
        {
          headers: {
            'x-internal-secret': process.env.INTERNAL_API_SECRET
          }
        }
      );
    } catch (recommendationError) {
      console.error('Failed to update recommendations:', recommendationError.message);
    }
    
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { orderId } = req.params;
    
    const order = await Order.findOne({ _id: orderId, userId })
      .populate('restaurantId', 'name address');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;
    
    const orders = await Order.find({ userId })
      .populate('restaurantId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Order.countDocuments({ userId });
    
    res.json({
      success: true,
      data: orders,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};
