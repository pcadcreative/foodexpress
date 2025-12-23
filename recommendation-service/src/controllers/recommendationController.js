const UserPreference = require('../models/UserPreference');
const RecommendationCache = require('../models/RecommendationCache');
const mongoose = require('mongoose');

exports.getRecommendations = async (req, res, next) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }
    
    let cache = await RecommendationCache.findOne({ userId });
    
    if (cache && (Date.now() - cache.generatedAt.getTime() < 3600000)) {
      return res.json({
        success: true,
        data: cache.recommendations,
        cached: true
      });
    }
    
    const preference = await UserPreference.findOne({ userId });
    
    if (!preference || preference.favoriteRestaurants.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'No preferences found. Order more to get personalized recommendations!'
      });
    }
    
    const recommendations = preference.favoriteRestaurants
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 10)
      .map(r => ({
        restaurantId: r.restaurantId,
        score: r.orderCount,
        reason: `You've ordered ${r.orderCount} times from this restaurant`
      }));
    
    await RecommendationCache.findOneAndUpdate(
      { userId },
      {
        userId,
        recommendations,
        generatedAt: new Date()
      },
      { upsert: true, new: true }
    );
    
    res.json({
      success: true,
      data: recommendations,
      cached: false
    });
  } catch (error) {
    next(error);
  }
};
