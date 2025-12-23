# Food Ordering System - Version 1

A scalable microservices-based food ordering platform built with Node.js, Express, and MongoDB Atlas.

## Architecture Overview

```
React Frontend
      |
Cloud Load Balancer / Reverse Proxy
      |
      |--> Order & Delivery Service (Port 3001)
      |
      |--> Recommendation Service (Port 3002)
      |
 MongoDB Atlas (Shared Database)
```

## Microservices

### 1. Order & Delivery Service
**Port:** 3001

**Responsibilities:**
- User authentication (signup/login with JWT)
- City selection
- Restaurant browsing and search
- Food menu management
- Shopping cart operations
- Order placement with duplicate prevention
- Order tracking
- Delivery address management

### 2. Recommendation Service
**Port:** 3002

**Responsibilities:**
- Track user food preferences
- Track popular restaurants per user
- Generate personalized restaurant recommendations
- Cache recommendations for performance

## API Documentation

### Order & Delivery Service APIs

#### Authentication
```
POST /api/auth/signup
Body: { name, email, password, phone }

POST /api/auth/login
Body: { email, password }
```

#### Cities
```
GET /api/cities
Headers: Authorization: Bearer <token>
```

#### Restaurants
```
GET /api/restaurants?cityId=<id>&cuisine=<type>&search=<query>
Headers: Authorization: Bearer <token>

GET /api/restaurants/:restaurantId
Headers: Authorization: Bearer <token>

GET /api/restaurants/:restaurantId/menu?category=<type>&vegetarian=<bool>
Headers: Authorization: Bearer <token>
```

#### Cart
```
POST /api/cart/add
Headers: Authorization: Bearer <token>
Body: { foodItemId, quantity }

PUT /api/cart/update
Headers: Authorization: Bearer <token>
Body: { foodItemId, quantity }

GET /api/cart
Headers: Authorization: Bearer <token>

DELETE /api/cart/clear
Headers: Authorization: Bearer <token>
```

#### Orders
```
POST /api/orders
Headers: Authorization: Bearer <token>
Body: { deliveryAddress: { street, city, state, zipCode }, idempotencyKey }

GET /api/orders/:orderId
Headers: Authorization: Bearer <token>

GET /api/orders?page=1&limit=10
Headers: Authorization: Bearer <token>
```

### Recommendation Service APIs

#### Public API
```
GET /api/recommendations?userId=<userId>
```

#### Internal API (Service-to-Service Only)
```
POST /internal/recommendation/update
Headers: x-internal-secret: <secret>
Body: { userId, restaurantId, orderedItems: [] }
```

## Service Communication Flow

1. User places an order via Order Service
2. Order Service validates and creates order
3. Order Service calls Recommendation Service's internal API
4. Recommendation Service updates user preferences
5. Frontend can fetch recommendations separately

**Communication Type:** Synchronous REST calls
**Direction:** Order Service → Recommendation Service (one-way)
**Security:** Internal API secured with shared secret token

## Database Collections

### Order Service Collections
- `users` - User accounts and addresses
- `cities` - Available service cities
- `restaurants` - Restaurant information
- `food_items` - Menu items per restaurant
- `carts` - User shopping carts
- `orders` - Order history and tracking

### Recommendation Service Collections
- `user_preferences` - User ordering patterns
- `recommendation_cache` - Cached recommendations (TTL: 24h)

## Duplicate Order Prevention

**Method:** Idempotency Key Pattern

- Frontend generates unique `idempotencyKey` per cart checkout attempt
- If same key is submitted again, existing order is returned
- Prevents duplicate orders from double-clicks or network retries
- Key is optional for backward compatibility

## Local Development Setup

### Prerequisites
- Node.js 16+
- MongoDB Atlas account (free tier)
- npm or yarn

### Installation

1. Clone the repository
```bash
cd food-ordering-system
```

2. Setup Order Service
```bash
cd order-service
npm install
cp .env.example .env
```

Edit `order-service/.env`:
```
PORT=3001
MONGODB_URI=mongodb+srv://bookmyshow:bookmyshow@cluster0.qai11yd.mongodb.net/food_ordering_db?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_in_production
RECOMMENDATION_SERVICE_URL=http://localhost:3002
INTERNAL_API_SECRET=internal_secret_token_12345
```

3. Setup Recommendation Service
```bash
cd ../recommendation-service
npm install
cp .env.example .env
```

Edit `recommendation-service/.env`:
```
PORT=3002
MONGODB_URI=mongodb+srv://bookmyshow:bookmyshow@cluster0.qai11yd.mongodb.net/food_ordering_db?appName=Cluster0
INTERNAL_API_SECRET=internal_secret_token_12345
```

### Running Services

**Terminal 1 - Order Service:**
```bash
cd order-service
npm start
```

**Terminal 2 - Recommendation Service:**
```bash
cd recommendation-service
npm start
```

### Development Mode (with auto-reload)
```bash
npm run dev
```

## Free-Tier Deployment Strategy

### Recommended Platforms

**Option 1: Render.com (Recommended)**
- Deploy each service as separate Web Service
- Free tier: 750 hours/month per service
- Automatic HTTPS and load balancing
- Zero-downtime deploys
- Services sleep after inactivity (cold start: ~30s)

**Option 2: Railway.app**
- $5 free credit/month
- Easy GitHub integration
- Auto-scaling support

**Option 3: Fly.io**
- Free tier with resource limits
- Edge deployment globally

### Deployment Steps (Render.com)

1. **Push code to GitHub**

2. **Create Web Services on Render**
   - New Web Service → Connect GitHub repo
   - Service 1: `order-service`
     - Build Command: `cd order-service && npm install`
     - Start Command: `cd order-service && npm start`
   - Service 2: `recommendation-service`
     - Build Command: `cd recommendation-service && npm install`
     - Start Command: `cd recommendation-service && npm start`

3. **Set Environment Variables** in Render dashboard
   - Update `RECOMMENDATION_SERVICE_URL` to Render service URL
   - Use same `INTERNAL_API_SECRET` for both services
   - Change `JWT_SECRET` to strong random value

4. **MongoDB Atlas Setup**
   - Whitelist Render IP ranges (or use 0.0.0.0/0 for testing)
   - Use connection string provided in this project

### Load Balancing

Load balancing is handled automatically by hosting platforms:
- **Render:** Built-in load balancer distributes traffic across replicas
- **Railway/Fly.io:** Platform-managed load balancing

To scale:
- Increase replica count in platform dashboard
- Services are stateless and replica-safe
- No code changes required

## Scaling Considerations

**Current Design (Version 1):**
- Stateless services - safe for horizontal scaling
- Shared MongoDB - acceptable for V1, but will need sharding for production scale
- Synchronous REST calls - simple but can be bottleneck

**Future Improvements (Version 2+):**
- Add message queue (Kafka/RabbitMQ) for async communication
- Separate databases per service for true microservice isolation
- Add API Gateway for centralized routing
- Implement caching layer (Redis) for frequently accessed data
- Add rate limiting and circuit breakers
- Set up monitoring and logging (ELK stack, Prometheus)

## Project Structure

```
food-ordering-system/
│
├── order-service/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── cartController.js
│   │   │   ├── cityController.js
│   │   │   ├── menuController.js
│   │   │   ├── orderController.js
│   │   │   └── restaurantController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── internalAuth.js
│   │   ├── models/
│   │   │   ├── Cart.js
│   │   │   ├── City.js
│   │   │   ├── FoodItem.js
│   │   │   ├── Order.js
│   │   │   ├── Restaurant.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   ├── cityRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   └── restaurantRoutes.js
│   │   └── app.js
│   ├── .env.example
│   └── package.json
│
├── recommendation-service/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── internalController.js
│   │   │   └── recommendationController.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── internalAuth.js
│   │   ├── models/
│   │   │   ├── RecommendationCache.js
│   │   │   └── UserPreference.js
│   │   ├── routes/
│   │   │   ├── internalRoutes.js
│   │   │   └── recommendationRoutes.js
│   │   └── app.js
│   ├── .env.example
│   └── package.json
│
├── README.md
└── architecture.md
```

## Testing the System

### 1. Create a User
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Save the `token` from response.

### 3. Get Cities
```bash
curl http://localhost:3001/api/cities \
  -H "Authorization: Bearer <your-token>"
```

### 4. Browse Restaurants
```bash
curl http://localhost:3001/api/restaurants?cityId=<cityId> \
  -H "Authorization: Bearer <your-token>"
```

### 5. View Menu
```bash
curl http://localhost:3001/api/restaurants/<restaurantId>/menu \
  -H "Authorization: Bearer <your-token>"
```

### 6. Add to Cart
```bash
curl -X POST http://localhost:3001/api/cart/add \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "foodItemId": "<foodItemId>",
    "quantity": 2
  }'
```

### 7. Place Order
```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "deliveryAddress": {
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipCode": "400001"
    },
    "idempotencyKey": "unique-key-12345"
  }'
```

### 8. Get Recommendations
```bash
curl "http://localhost:3002/api/recommendations?userId=<userId>"
```

## Key Features Implemented

✅ Microservices architecture with clear separation of concerns  
✅ JWT-based authentication  
✅ RESTful API design  
✅ Service-to-service communication with internal API security  
✅ Duplicate order prevention using idempotency keys  
✅ Shopping cart with single-restaurant constraint  
✅ Personalized recommendations based on order history  
✅ Recommendation caching for performance  
✅ Stateless services ready for horizontal scaling  
✅ Centralized error handling  
✅ Input validation  
✅ MongoDB indexes for query optimization  
✅ Free-tier deployment friendly  

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
