const Restaurant = require('../models/Restaurant');

exports.getRestaurants = async (req, res, next) => {
  try {
    const { cityId, cuisine, search } = req.query;
    
    let filter = { isActive: true };
    
    if (cityId) {
      filter.cityId = cityId;
    }
    
    if (cuisine) {
      filter.cuisine = cuisine;
    }
    
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    const restaurants = await Restaurant.find(filter)
      .populate('cityId', 'name')
      .select('name description cuisine rating deliveryTime imageUrl address');
    
    res.json({
      success: true,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
};

exports.getRestaurantById = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    
    const restaurant = await Restaurant.findById(restaurantId)
      .populate('cityId', 'name');
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    res.json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};
