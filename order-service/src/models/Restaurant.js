const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true
  },
  address: {
    street: String,
    area: String,
    city: String,
    zipCode: String
  },
  cuisine: [String], // ["Italian", "Chinese", "Indian"]
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  deliveryTime: {
    type: Number, // in minutes
    default: 30
  },
  isActive: {
    type: Boolean,
    default: true
  },
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster city-based queries
restaurantSchema.index({ cityId: 1, isActive: 1 });

module.exports = mongoose.model('Restaurant', restaurantSchema);
