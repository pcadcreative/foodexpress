# Food Ordering System - Postman API Collection

Base URLs:
- Order Service: http://localhost:3001
- Recommendation Service: http://localhost:3002

---

## 1. USER AUTHENTICATION

### Signup
**POST** http://localhost:3001/api/auth/signup

Headers:
```
Content-Type: application/json
```

Body (raw JSON):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

---

### Login
**POST** http://localhost:3001/api/auth/login

Headers:
```
Content-Type: application/json
```

Body (raw JSON):
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Save the `token` from response for use in subsequent requests

---

## 2. CITIES

### Get All Cities
**GET** http://localhost:3001/api/cities

Headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 3. RESTAURANTS

### Get Restaurants by City
**GET** http://localhost:3001/api/restaurants?cityId=YOUR_CITY_ID

Headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

Query Params:
- cityId (optional): Filter by city ID
- cuisine (optional): Filter by cuisine type
- search (optional): Search by restaurant name

---

### Get Restaurant by ID
**GET** http://localhost:3001/api/restaurants/YOUR_RESTAURANT_ID

Headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

### Get Restaurant Menu
**GET** http://localhost:3001/api/restaurants/YOUR_RESTAURANT_ID/menu

Headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

Query Params:
- category (optional): Filter by category
- vegetarian (optional): true/false

---

## 4. CART

### Add to Cart
**POST** http://localhost:3001/api/cart/add

Headers:
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

Body (raw JSON):
```json
{
  "foodItemId": "YOUR_FOOD_ITEM_ID",
  "quantity": 2
}
```

---

### Update Cart Item
**PUT** http://localhost:3001/api/cart/update

Headers:
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

Body (raw JSON):
```json
{
  "foodItemId": "YOUR_FOOD_ITEM_ID",
  "quantity": 3
}
```

Set quantity to 0 to remove item from cart.

---

### Get Cart
**GET** http://localhost:3001/api/cart

Headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

### Clear Cart
**DELETE** http://localhost:3001/api/cart/clear

Headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 5. ORDERS

### Place Order
**POST** http://localhost:3001/api/orders

Headers:
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

Body (raw JSON):
```json
{
  "deliveryAddress": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001"
  },
  "idempotencyKey": "unique-key-12345"
}
```

Note: Generate a new unique idempotencyKey for each order attempt to prevent duplicates.

---

### Get Order by ID
**GET** http://localhost:3001/api/orders/YOUR_ORDER_ID

Headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

### Get User Orders (with pagination)
**GET** http://localhost:3001/api/orders?page=1&limit=10

Headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

Query Params:
- page (optional): Page number (default: 1)
- limit (optional): Items per page (default: 10)

---

## 6. RECOMMENDATIONS

### Get Recommendations
**GET** http://localhost:3002/api/recommendations?userId=YOUR_USER_ID

No authentication required for this endpoint.

Query Params:
- userId (required): The user ID to get recommendations for

---

## TESTING WORKFLOW IN POSTMAN

1. **Signup** → Save token from response
2. **Login** (if already signed up) → Save token
3. **Get Cities** → Copy a city ID
4. **Get Restaurants** → Use cityId from step 3, copy a restaurant ID
5. **Get Menu** → Use restaurantId from step 4, copy a food item ID
6. **Add to Cart** → Use foodItemId from step 5
7. **Get Cart** → Verify items in cart
8. **Place Order** → Cart will be cleared after successful order
9. **Get Order by ID** → Verify order details
10. **Get Recommendations** → Use userId from signup/login response

---

## QUICK TEST IDs (From Seeded Data)

After running the seed script, you can use these sample data points:

**Cities:** Run GET /api/cities to get actual IDs

**Restaurants:** Run GET /api/restaurants to get actual IDs

**Sample Test User:**
```
Email: test@example.com
Password: test123
```
(Created by test script)

---

## TIPS

1. Create a Postman Environment with variables:
   - baseUrl: http://localhost:3001
   - recUrl: http://localhost:3002
   - token: (set after login)
   - userId: (set after login)

2. Use Pre-request Scripts to set dynamic values:
   ```javascript
   pm.environment.set("idempotencyKey", pm.variables.replaceIn('{{$randomUUID}}'));
   ```

3. Use Tests tab to save token automatically:
   ```javascript
   var jsonData = pm.response.json();
   if (jsonData.data && jsonData.data.token) {
       pm.environment.set("token", jsonData.data.token);
       pm.environment.set("userId", jsonData.data.userId);
   }
   ```

---

## INTERNAL API (For Testing Service Communication)

### Update Recommendations (Internal Only)
**POST** http://localhost:3002/internal/recommendation/update

Headers:
```
Content-Type: application/json
x-internal-secret: internal_secret_token_12345
```

Body (raw JSON):
```json
{
  "userId": "YOUR_USER_ID",
  "restaurantId": "YOUR_RESTAURANT_ID",
  "orderedItems": ["Pizza", "Burger", "Fries"]
}
```

Note: This endpoint is called automatically by Order Service. Only test manually if needed.
