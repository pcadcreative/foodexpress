const mongoose = require('mongoose');

const userPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  favoriteRestaurants: [{
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    orderCount: {
      type: Number,
      default: 1
    },
    lastOrderedAt: {
      type: Date,
      default: Date.now
    }
  }],
  favoriteFoodItems: [{
    foodName: String,
    orderCount: {
      type: Number,
      default: 1
    }
  }],
  totalOrders: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userPreferenceSchema.index({ userId: 1 });

module.exports = mongoose.model('UserPreference', userPreferenceSchema);
