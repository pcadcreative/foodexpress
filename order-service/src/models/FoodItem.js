const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Snack'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for restaurant-based queries
foodItemSchema.index({ restaurantId: 1, isAvailable: 1 });

module.exports = mongoose.model('FoodItem', foodItemSchema);
