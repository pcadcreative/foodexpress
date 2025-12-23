const UserPreference = require('../models/UserPreference');
const RecommendationCache = require('../models/RecommendationCache');

exports.updateRecommendation = async (req, res, next) => {
  try {
    const { userId, restaurantId, orderedItems } = req.body;
    
    if (!userId || !restaurantId || !orderedItems) {
      return res.status(400).json({
        success: false,
        message: 'userId, restaurantId, and orderedItems are required'
      });
    }
    
    let preference = await UserPreference.findOne({ userId });
    
    if (!preference) {
      preference = new UserPreference({
        userId,
        favoriteRestaurants: [],
        favoriteFoodItems: [],
        totalOrders: 0
      });
    }
    
    const restaurantIndex = preference.favoriteRestaurants.findIndex(
      r => r.restaurantId.toString() === restaurantId
    );
    
    if (restaurantIndex > -1) {
      preference.favoriteRestaurants[restaurantIndex].orderCount += 1;
      preference.favoriteRestaurants[restaurantIndex].lastOrderedAt = new Date();
    } else {
      preference.favoriteRestaurants.push({
        restaurantId,
        orderCount: 1,
        lastOrderedAt: new Date()
      });
    }
    
    orderedItems.forEach(itemName => {
      const itemIndex = preference.favoriteFoodItems.findIndex(
        f => f.foodName === itemName
      );
      
      if (itemIndex > -1) {
        preference.favoriteFoodItems[itemIndex].orderCount += 1;
      } else {
        preference.favoriteFoodItems.push({
          foodName: itemName,
          orderCount: 1
        });
      }
    });
    
    preference.totalOrders += 1;
    preference.updatedAt = new Date();
    
    await preference.save();
    
    await RecommendationCache.deleteOne({ userId });
    
    res.json({
      success: true,
      message: 'Recommendation data updated'
    });
  } catch (error) {
    next(error);
  }
};
