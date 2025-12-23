const mongoose = require('mongoose');
const City = require('./src/models/City');
const Restaurant = require('./src/models/Restaurant');
const FoodItem = require('./src/models/FoodItem');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    await City.deleteMany({});
    await Restaurant.deleteMany({});
    await FoodItem.deleteMany({});
    
    // Create Cities
    const cities = await City.insertMany([
      { name: 'Mumbai', state: 'Maharashtra', isActive: true },
      { name: 'Delhi', state: 'Delhi', isActive: true },
      { name: 'Bangalore', state: 'Karnataka', isActive: true },
      { name: 'Pune', state: 'Maharashtra', isActive: true },
      { name: 'Hyderabad', state: 'Telangana', isActive: true },
      { name: 'Chennai', state: 'Tamil Nadu', isActive: true },
      { name: 'Kolkata', state: 'West Bengal', isActive: true }
    ]);
    
    console.log(`✓ Created ${cities.length} cities`);
    
    // Create Restaurants
    const restaurants = await Restaurant.insertMany([
      // Mumbai Restaurants
      {
        name: 'Pizza Palace',
        description: 'Best wood-fired pizzas in town with authentic Italian flavors',
        cityId: cities[0]._id,
        address: { street: '123 Main St', area: 'Andheri West', city: 'Mumbai', zipCode: '400053' },
        cuisine: ['Italian', 'Pizza'],
        rating: 4.5,
        deliveryTime: 30,
        isActive: true,
        imageUrl: 'https://example.com/pizza.jpg'
      },
      {
        name: 'Burger Hub',
        description: 'Juicy gourmet burgers and crispy fries',
        cityId: cities[0]._id,
        address: { street: '456 Park Ave', area: 'Bandra West', city: 'Mumbai', zipCode: '400050' },
        cuisine: ['American', 'Fast Food'],
        rating: 4.3,
        deliveryTime: 25,
        isActive: true,
        imageUrl: 'https://example.com/burger.jpg'
      },
      {
        name: 'Spice Route',
        description: 'Traditional Indian cuisine with a modern twist',
        cityId: cities[0]._id,
        address: { street: '789 Station Rd', area: 'Powai', city: 'Mumbai', zipCode: '400076' },
        cuisine: ['Main Course', 'North Indian'],
        rating: 4.6,
        deliveryTime: 35,
        isActive: true,
        imageUrl: 'https://example.com/indian.jpg'
      },
      {
        name: 'Sushi Express',
        description: 'Fresh sushi and Japanese delicacies',
        cityId: cities[0]._id,
        address: { street: '321 Marine Drive', area: 'Colaba', city: 'Mumbai', zipCode: '400001' },
        cuisine: ['Japanese', 'Sushi'],
        rating: 4.7,
        deliveryTime: 40,
        isActive: true,
        imageUrl: 'https://example.com/sushi.jpg'
      },
      
      // Delhi Restaurants
      {
        name: 'Delhi Darbar',
        description: 'Authentic Mughlai and North Indian cuisine',
        cityId: cities[1]._id,
        address: { street: '100 Connaught Place', area: 'CP', city: 'Delhi', zipCode: '110001' },
        cuisine: ['Main Course', 'Mughlai'],
        rating: 4.4,
        deliveryTime: 30,
        isActive: true,
        imageUrl: 'https://example.com/delhi.jpg'
      },
      {
        name: 'Tandoor Nights',
        description: 'Delicious tandoori specialties',
        cityId: cities[1]._id,
        address: { street: '234 Mehrauli', area: 'South Delhi', city: 'Delhi', zipCode: '110030' },
        cuisine: ['Main Course', 'Main Course'],
        rating: 4.5,
        deliveryTime: 28,
        isActive: true,
        imageUrl: 'https://example.com/tandoor.jpg'
      },
      {
        name: 'Street Food Junction',
        description: 'Best chaat and street food',
        cityId: cities[1]._id,
        address: { street: '567 Chandni Chowk', area: 'Old Delhi', city: 'Delhi', zipCode: '110006' },
        cuisine: ['Snack', 'Chaat'],
        rating: 4.2,
        deliveryTime: 20,
        isActive: true,
        imageUrl: 'https://example.com/street.jpg'
      },
      
      // Bangalore Restaurants
      {
        name: 'Spice Garden',
        description: 'South Indian and Karnataka specialties',
        cityId: cities[2]._id,
        address: { street: '789 MG Road', area: 'Indiranagar', city: 'Bangalore', zipCode: '560038' },
        cuisine: ['South Indian', 'Karnataka'],
        rating: 4.7,
        deliveryTime: 35,
        isActive: true,
        imageUrl: 'https://example.com/south.jpg'
      },
      {
        name: 'Pasta Paradise',
        description: 'Authentic Italian pasta and risotto',
        cityId: cities[2]._id,
        address: { street: '890 Brigade Rd', area: 'Koramangala', city: 'Bangalore', zipCode: '560095' },
        cuisine: ['Italian', 'Pasta'],
        rating: 4.6,
        deliveryTime: 32,
        isActive: true,
        imageUrl: 'https://example.com/pasta.jpg'
      },
      {
        name: 'BBQ Nation',
        description: 'Unlimited grills and barbecue',
        cityId: cities[2]._id,
        address: { street: '456 Whitefield Rd', area: 'Whitefield', city: 'Bangalore', zipCode: '560066' },
        cuisine: ['BBQ', 'Grill'],
        rating: 4.5,
        deliveryTime: 38,
        isActive: true,
        imageUrl: 'https://example.com/bbq.jpg'
      },
      
      // Pune Restaurants
      {
        name: 'Misal House',
        description: 'Authentic Maharashtrian misal and snacks',
        cityId: cities[3]._id,
        address: { street: '123 FC Road', area: 'Shivajinagar', city: 'Pune', zipCode: '411004' },
        cuisine: ['Maharashtrian', 'Snack'],
        rating: 4.3,
        deliveryTime: 25,
        isActive: true,
        imageUrl: 'https://example.com/misal.jpg'
      },
      {
        name: 'Café Goodluck',
        description: 'Irani café with keema pav and bun maska',
        cityId: cities[3]._id,
        address: { street: '234 Deccan Gymkhana', area: 'Deccan', city: 'Pune', zipCode: '411004' },
        cuisine: ['Irani', 'Café'],
        rating: 4.4,
        deliveryTime: 22,
        isActive: true,
        imageUrl: 'https://example.com/cafe.jpg'
      },
      
      // Hyderabad Restaurants
      {
        name: 'Biryani Paradise',
        description: 'World-famous Hyderabadi biryani',
        cityId: cities[4]._id,
        address: { street: '678 Banjara Hills', area: 'Jubilee Hills', city: 'Hyderabad', zipCode: '500033' },
        cuisine: ['Hyderabadi', 'Main Course'],
        rating: 4.8,
        deliveryTime: 40,
        isActive: true,
        imageUrl: 'https://example.com/biryani.jpg'
      },
      {
        name: 'Haleem Hub',
        description: 'Authentic Hyderabadi haleem and kebabs',
        cityId: cities[4]._id,
        address: { street: '890 Charminar', area: 'Old City', city: 'Hyderabad', zipCode: '500002' },
        cuisine: ['Hyderabadi', 'Mughlai'],
        rating: 4.6,
        deliveryTime: 35,
        isActive: true,
        imageUrl: 'https://example.com/haleem.jpg'
      },
      
      // Chennai Restaurants
      {
        name: 'Dosa Corner',
        description: 'Crispy dosas and filter coffee',
        cityId: cities[5]._id,
        address: { street: '345 T Nagar', area: 'T Nagar', city: 'Chennai', zipCode: '600017' },
        cuisine: ['South Indian', 'Snack'],
        rating: 4.5,
        deliveryTime: 28,
        isActive: true,
        imageUrl: 'https://example.com/dosa.jpg'
      },
      {
        name: 'Chettinad Flavors',
        description: 'Spicy Chettinad cuisine',
        cityId: cities[5]._id,
        address: { street: '567 Mylapore', area: 'Mylapore', city: 'Chennai', zipCode: '600004' },
        cuisine: ['Chettinad', 'South Indian'],
        rating: 4.7,
        deliveryTime: 33,
        isActive: true,
        imageUrl: 'https://example.com/chettinad.jpg'
      },
      
      // Kolkata Restaurants
      {
        name: 'Rosogolla House',
        description: 'Bengali sweets and mishti doi',
        cityId: cities[6]._id,
        address: { street: '789 Park Street', area: 'Park Street', city: 'Kolkata', zipCode: '700016' },
        cuisine: ['Bengali', 'Sweets'],
        rating: 4.4,
        deliveryTime: 25,
        isActive: true,
        imageUrl: 'https://example.com/bengali.jpg'
      },
      {
        name: 'Kathi Roll Express',
        description: 'Famous Kolkata kathi rolls',
        cityId: cities[6]._id,
        address: { street: '234 Salt Lake', area: 'Salt Lake', city: 'Kolkata', zipCode: '700064' },
        cuisine: ['Snack', 'Main Course'],
        rating: 4.3,
        deliveryTime: 20,
        isActive: true,
        imageUrl: 'https://example.com/roll.jpg'
      }
    ]);
    
    console.log(`✓ Created ${restaurants.length} restaurants`);
    
    // Create Food Items for all restaurants
    const foodItems = [
      // Pizza Palace (0)
      { restaurantId: restaurants[0]._id, name: 'Margherita Pizza', description: 'Classic cheese pizza with fresh basil', category: 'Main Course', price: 299, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[0]._id, name: 'Pepperoni Pizza', description: 'Spicy pepperoni with extra cheese', category: 'Main Course', price: 399, isVegetarian: false, isAvailable: true },
      { restaurantId: restaurants[0]._id, name: 'Veggie Supreme', description: 'Loaded with fresh vegetables', category: 'Main Course', price: 349, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[0]._id, name: 'Garlic Bread', description: 'Crispy garlic bread with herbs', category: 'Appetizer', price: 99, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[0]._id, name: 'Coke', description: 'Chilled soft drink', category: 'Beverage', price: 50, isVegetarian: true, isAvailable: true },
      
      // Burger Hub (1)
      { restaurantId: restaurants[1]._id, name: 'Classic Burger', description: 'Beef patty with cheese and lettuce', category: 'Main Course', price: 199, isVegetarian: false, isAvailable: true },
      { restaurantId: restaurants[1]._id, name: 'Veggie Burger', description: 'Plant-based patty with special sauce', category: 'Main Course', price: 179, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[1]._id, name: 'Chicken Burger', description: 'Crispy fried chicken fillet', category: 'Main Course', price: 219, isVegetarian: false, isAvailable: true },
      { restaurantId: restaurants[1]._id, name: 'French Fries', description: 'Crispy golden fries', category: 'Snack', price: 89, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[1]._id, name: 'Onion Rings', description: 'Crispy battered onion rings', category: 'Snack', price: 99, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[1]._id, name: 'Chocolate Milkshake', description: 'Thick chocolate shake', category: 'Beverage', price: 120, isVegetarian: true, isAvailable: true },
      
      // Spice Route (2)
      { restaurantId: restaurants[2]._id, name: 'Butter Chicken', description: 'Creamy tomato curry with tender chicken', category: 'Main Course', price: 349, isVegetarian: false, isAvailable: true },
      { restaurantId: restaurants[2]._id, name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', category: 'Appetizer', price: 249, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[2]._id, name: 'Dal Makhani', description: 'Creamy black lentils', category: 'Main Course', price: 229, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[2]._id, name: 'Chicken Tikka', description: 'Tandoori chicken pieces', category: 'Appetizer', price: 279, isVegetarian: false, isAvailable: true },
      { restaurantId: restaurants[2]._id, name: 'Naan', description: 'Butter naan', category: 'Appetizer', price: 40, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[2]._id, name: 'Gulab Jamun', description: 'Sweet dumplings in sugar syrup', category: 'Dessert', price: 79, isVegetarian: true, isAvailable: true },
      
      // Sushi Express (3)
      { restaurantId: restaurants[3]._id, name: 'California Roll', description: 'Crab, avocado, cucumber', category: 'Main Course', price: 399, isVegetarian: false, isAvailable: true },
      { restaurantId: restaurants[3]._id, name: 'Veg Sushi Roll', description: 'Cucumber, avocado, carrot', category: 'Main Course', price: 349, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[3]._id, name: 'Salmon Nigiri', description: 'Fresh salmon sushi', category: 'Appetizer', price: 299, isVegetarian: false, isAvailable: true },
      { restaurantId: restaurants[3]._id, name: 'Miso Soup', description: 'Traditional Japanese soup', category: 'Appetizer', price: 149, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[3]._id, name: 'Green Tea', description: 'Hot green tea', category: 'Beverage', price: 99, isVegetarian: true, isAvailable: true },
      
      // Delhi Darbar (4)
      { restaurantId: restaurants[4]._id, name: 'Chicken Biryani', description: 'Aromatic basmati rice with chicken', category: 'Main Course', price: 329, isVegetarian: false, isAvailable: true },
      { restaurantId: restaurants[4]._id, name: 'Mutton Rogan Josh', description: 'Spicy lamb curry', category: 'Main Course', price: 429, isVegetarian: false, isAvailable: true },
      { restaurantId: restaurants[4]._id, name: 'Kebab Platter', description: 'Assorted kebabs', category: 'Appetizer', price: 399, isVegetarian: false, isAvailable: true },
      { restaurantId: restaurants[4]._id, name: 'Paneer Butter Masala', description: 'Cottage cheese in butter gravy', category: 'Main Course', price: 279, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[4]._id, name: 'Roomali Roti', description: 'Thin flatbread', category: 'Appetizer', price: 35, isVegetarian: true, isAvailable: true },
      
      // Tandoor Nights (5)
      { restaurantId: restaurants[5]._id, name: 'Tandoori Chicken', description: 'Half chicken marinated in spices', category: 'Main Course', price: 349, isVegetarian: false, isAvailable: true },
      { restaurantId: restaurants[5]._id, name: 'Seekh Kebab', description: 'Minced meat skewers', category: 'Appetizer', price: 299, isVegetarian: false, isAvailable: true },
      { restaurantId: restaurants[5]._id, name: 'Paneer Tikka', description: 'Grilled paneer cubes', category: 'Appetizer', price: 259, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[5]._id, name: 'Butter Naan', description: 'Soft butter naan', category: 'Appetizer', price: 45, isVegetarian: true, isAvailable: true },
      
      // Street Food Junction (6)
      { restaurantId: restaurants[6]._id, name: 'Pani Puri', description: 'Crispy puris with tangy water', category: 'Snack', price: 60, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[6]._id, name: 'Bhel Puri', description: 'Puffed rice chaat', category: 'Snack', price: 70, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[6]._id, name: 'Chole Bhature', description: 'Spicy chickpeas with fried bread', category: 'Main Course', price: 129, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[6]._id, name: 'Dahi Bhalla', description: 'Lentil dumplings in yogurt', category: 'Snack', price: 89, isVegetarian: true, isAvailable: true },
      
      // Spice Garden Bangalore (7)
      { restaurantId: restaurants[7]._id, name: 'Masala Dosa', description: 'Crispy rice crepe with potato filling', category: 'Main Course', price: 129, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[7]._id, name: 'Idli Sambar', description: '3 steamed rice cakes with sambar', category: 'Snack', price: 99, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[7]._id, name: 'Vada Sambar', description: 'Fried lentil donuts', category: 'Snack', price: 109, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[7]._id, name: 'Filter Coffee', description: 'South Indian filter coffee', category: 'Beverage', price: 40, isVegetarian: true, isAvailable: true },
      
      // Pasta Paradise (8)
      { restaurantId: restaurants[8]._id, name: 'Alfredo Pasta', description: 'Creamy white sauce pasta', category: 'Main Course', price: 299, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[8]._id, name: 'Arrabbiata Pasta', description: 'Spicy tomato sauce pasta', category: 'Main Course', price: 279, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[8]._id, name: 'Mushroom Risotto', description: 'Creamy Italian rice', category: 'Main Course', price: 349, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[8]._id, name: 'Garlic Bread', description: 'Toasted bread with garlic butter', category: 'Appetizer', price: 99, isVegetarian: true, isAvailable: true },
      
      // BBQ Nation (9)
      { restaurantId: restaurants[9]._id, name: 'Grilled Chicken', description: 'BBQ grilled chicken', category: 'Main Course', price: 399, isVegetarian: false, isAvailable: true },
      { restaurantId: restaurants[9]._id, name: 'Paneer Tikka', description: 'Grilled paneer cubes', category: 'Main Course', price: 279, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[9]._id, name: 'Fish Tikka', description: 'Grilled fish pieces', category: 'Main Course', price: 449, isVegetarian: false, isAvailable: true },
      { restaurantId: restaurants[9]._id, name: 'Veg Kebab', description: 'Mixed vegetable kebabs', category: 'Appetizer', price: 229, isVegetarian: true, isAvailable: true },
      
      // Misal House (10)
      { restaurantId: restaurants[10]._id, name: 'Misal Pav', description: 'Spicy sprouts curry with bread', category: 'Main Course', price: 99, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[10]._id, name: 'Vada Pav', description: 'Potato fritter in bun', category: 'Snack', price: 30, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[10]._id, name: 'Sabudana Khichdi', description: 'Sago pearl stir-fry', category: 'Snack', price: 89, isVegetarian: true, isAvailable: true },
      
      // Café Goodluck (11)
      { restaurantId: restaurants[11]._id, name: 'Keema Pav', description: 'Minced meat with bread', category: 'Main Course', price: 159, isVegetarian: false, isAvailable: true },
      { restaurantId: restaurants[11]._id, name: 'Bun Maska', description: 'Buttered bun', category: 'Snack', price: 40, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[11]._id, name: 'Irani Chai', description: 'Sweet milky tea', category: 'Beverage', price: 25, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[11]._id, name: 'Chicken Cutlet', description: 'Fried chicken patty', category: 'Snack', price: 79, isVegetarian: false, isAvailable: true },
      
      // Biryani Paradise (12)
      { restaurantId: restaurants[12]._id, name: 'Chicken Biryani', description: 'Hyderabadi style chicken biryani', category: 'Main Course', price: 349, isVegetarian: false, isAvailable: true },
      { restaurantId: restaurants[12]._id, name: 'Mutton Biryani', description: 'Tender mutton biryani', category: 'Main Course', price: 449, isVegetarian: false, isAvailable: true },
      { restaurantId: restaurants[12]._id, name: 'Veg Biryani', description: 'Mixed vegetable biryani', category: 'Main Course', price: 249, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[12]._id, name: 'Raita', description: 'Yogurt with cucumber', category: 'Appetizer', price: 49, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[12]._id, name: 'Double Ka Meetha', description: 'Bread pudding dessert', category: 'Dessert', price: 99, isVegetarian: true, isAvailable: true },
      
      // Haleem Hub (13)
      { restaurantId: restaurants[13]._id, name: 'Haleem', description: 'Slow-cooked meat and lentil stew', category: 'Main Course', price: 199, isVegetarian: false, isAvailable: true },
      { restaurantId: restaurants[13]._id, name: 'Kebab Platter', description: 'Assorted kebabs', category: 'Appetizer', price: 379, isVegetarian: false, isAvailable: true },
      { restaurantId: restaurants[13]._id, name: 'Tandoori Roti', description: 'Clay oven bread', category: 'Appetizer', price: 30, isVegetarian: true, isAvailable: true },
      
      // Dosa Corner (14)
      { restaurantId: restaurants[14]._id, name: 'Masala Dosa', description: 'Crispy dosa with potato', category: 'Main Course', price: 119, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[14]._id, name: 'Plain Dosa', description: 'Crispy rice crepe', category: 'Main Course', price: 89, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[14]._id, name: 'Rava Dosa', description: 'Crispy semolina crepe', category: 'Main Course', price: 129, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[14]._id, name: 'Filter Coffee', description: 'Traditional filter coffee', category: 'Beverage', price: 35, isVegetarian: true, isAvailable: true },
      
      // Chettinad Flavors (15)
      { restaurantId: restaurants[15]._id, name: 'Chettinad Chicken', description: 'Spicy chicken curry', category: 'Main Course', price: 329, isVegetarian: false, isAvailable: true },
      { restaurantId: restaurants[15]._id, name: 'Fish Fry', description: 'Crispy fried fish', category: 'Appetizer', price: 299, isVegetarian: false, isAvailable: true },
      { restaurantId: restaurants[15]._id, name: 'Paniyaram', description: 'Rice dumplings', category: 'Snack', price: 99, isVegetarian: true, isAvailable: true },
      
      // Rosogolla House (16)
      { restaurantId: restaurants[16]._id, name: 'Rosogolla', description: 'Spongy cottage cheese balls in syrup', category: 'Dessert', price: 120, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[16]._id, name: 'Mishti Doi', description: 'Sweet yogurt', category: 'Dessert', price: 89, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[16]._id, name: 'Sandesh', description: 'Bengali sweet', category: 'Dessert', price: 99, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[16]._id, name: 'Cham Cham', description: 'Cylindrical sweet', category: 'Dessert', price: 110, isVegetarian: true, isAvailable: true },
      
      // Kathi Roll Express (17)
      { restaurantId: restaurants[17]._id, name: 'Chicken Kathi Roll', description: 'Chicken wrapped in paratha', category: 'Main Course', price: 149, isVegetarian: false, isAvailable: true },
      { restaurantId: restaurants[17]._id, name: 'Paneer Kathi Roll', description: 'Paneer wrapped in paratha', category: 'Main Course', price: 129, isVegetarian: true, isAvailable: true },
      { restaurantId: restaurants[17]._id, name: 'Egg Roll', description: 'Egg wrapped in paratha', category: 'Main Course', price: 99, isVegetarian: false, isAvailable: true },
      { restaurantId: restaurants[17]._id, name: 'Mutton Kathi Roll', description: 'Mutton wrapped in paratha', category: 'Main Course', price: 179, isVegetarian: false, isAvailable: true }
    ];
    
    await FoodItem.insertMany(foodItems);
    
    console.log(`✓ Created ${foodItems.length} food items`);
    console.log('');
    console.log('🎉 Seed data inserted successfully!');
    console.log(`📍 Cities: ${cities.length}`);
    console.log(`🍽️  Restaurants: ${restaurants.length}`);
    console.log(`🍕 Food Items: ${foodItems.length}`);
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });

