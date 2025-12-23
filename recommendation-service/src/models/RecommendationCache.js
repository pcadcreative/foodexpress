const mongoose = require('mongoose');

const recommendationCacheSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  recommendations: [{
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    score: {
      type: Number,
      default: 0
    },
    reason: String
  }],
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

recommendationCacheSchema.index({ userId: 1 });
recommendationCacheSchema.index({ generatedAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('RecommendationCache', recommendationCacheSchema);
