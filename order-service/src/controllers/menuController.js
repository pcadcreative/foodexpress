const FoodItem = require('../models/FoodItem');

exports.getMenu = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const { category, vegetarian } = req.query;
    
    let filter = { restaurantId, isAvailable: true };
    
    if (category) {
      filter.category = category;
    }
    
    if (vegetarian === 'true') {
      filter.isVegetarian = true;
    }
    
    const menuItems = await FoodItem.find(filter)
      .select('name description category price isVegetarian imageUrl');
    
    res.json({
      success: true,
      data: menuItems
    });
  } catch (error) {
    next(error);
  }
};
