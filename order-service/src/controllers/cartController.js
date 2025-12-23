const Cart = require('../models/Cart');
const FoodItem = require('../models/FoodItem');

exports.addToCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { foodItemId, quantity } = req.body;
    
    if (!foodItemId || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid foodItemId and quantity are required'
      });
    }
    
    const foodItem = await FoodItem.findById(foodItemId).populate('restaurantId');
    
    if (!foodItem || !foodItem.isAvailable) {
      return res.status(404).json({
        success: false,
        message: 'Food item not available'
      });
    }
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({
        userId,
        restaurantId: foodItem.restaurantId._id,
        items: []
      });
    } else if (cart.restaurantId && cart.restaurantId.toString() !== foodItem.restaurantId._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cart can only contain items from one restaurant. Clear cart to add from different restaurant.'
      });
    }
    
    const existingItemIndex = cart.items.findIndex(
      item => item.foodItemId.toString() === foodItemId
    );
    
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        foodItemId: foodItem._id,
        name: foodItem.name,
        price: foodItem.price,
        quantity
      });
    }
    
    cart.restaurantId = foodItem.restaurantId._id;
    await cart.save();
    
    res.json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { foodItemId, quantity } = req.body;
    
    if (!foodItemId || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid foodItemId and quantity are required'
      });
    }
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    if (quantity === 0) {
      cart.items = cart.items.filter(
        item => item.foodItemId.toString() !== foodItemId
      );
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.foodItemId.toString() === foodItemId
      );
      
      if (itemIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Item not found in cart'
        });
      }
      
      cart.items[itemIndex].quantity = quantity;
    }
    
    if (cart.items.length === 0) {
      cart.restaurantId = null;
    }
    
    await cart.save();
    
    res.json({
      success: true,
      message: 'Cart updated',
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    
    let cart = await Cart.findOne({ userId }).populate('restaurantId', 'name');
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    
    const cart = await Cart.findOne({ userId });
    
    if (cart) {
      cart.items = [];
      cart.restaurantId = null;
      cart.totalAmount = 0;
      await cart.save();
    }
    
    res.json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    next(error);
  }
};
