# Food Ordering System - Architecture Documentation

## System Architecture

### High-Level Design

```
┌─────────────────┐
│  React Frontend │
└────────┬────────┘
         │
         │ HTTPS
         ▼
┌─────────────────────────────┐
│  Cloud Load Balancer        │
│  (Platform Managed)         │
└─────────┬───────────────────┘
          │
          ├──────────────────────┐
          │                      │
          ▼                      ▼
┌──────────────────┐   ┌──────────────────────┐
│ Order Service    │   │ Recommendation       │
│ (Node.js:3001)   │──▶│ Service              │
│                  │   │ (Node.js:3002)       │
│ - Auth           │   │                      │
│ - Restaurants    │   │ - Preferences        │
│ - Cart           │   │ - Suggestions        │
│ - Orders         │   │                      │
└────────┬─────────┘   └──────────┬───────────┘
         │                        │
         └────────┬───────────────┘
                  │
                  ▼
         ┌────────────────┐
         │  MongoDB Atlas │
         │  (Shared DB)   │
         └────────────────┘
```

## Design Principles

### 1. Microservices Decomposition

**Strategy Used:** Business Capability Decomposition

**Service Boundaries:**
- **Order & Delivery Service:** Handles all core ordering operations
- **Recommendation Service:** Isolated recommendation logic

**Rationale:**
- Clear separation of concerns
- Independent scaling based on load
- Order operations typically have higher traffic than recommendations
- Recommendation logic can be optimized independently

### 2. Database Strategy

**Approach:** Shared Database (Version 1)

**Collections:**
```
Order Service Uses:
├── users
├── cities
├── restaurants
├── food_items
├── carts
└── orders

Recommendation Service Uses:
├── user_preferences
└── recommendation_cache
```

**Justification:**
- Simpler for Version 1
- Free-tier friendly (single MongoDB Atlas cluster)
- Acceptable for small-to-medium scale
- Data consistency easier to maintain
- No distributed transaction complexity

**Future Migration Path:**
- Move to separate databases per service
- Use event sourcing for cross-service data sync
- Implement saga pattern for distributed transactions

### 3. Service Communication

**Pattern:** Synchronous REST API

**Flow:**
```
Order Created
     │
     ├─> Order Service processes
     │
     ├─> Service calls Recommendation Service
     │   (POST /internal/recommendation/update)
     │
     └─> Recommendation updates preferences
```

**Why REST and not Events?**
- Simpler implementation for V1
- Lower operational complexity
- No message broker infrastructure needed
- Free-tier deployment friendly
- Acceptable latency for recommendation updates

**Security:**
- Internal endpoints protected by shared secret
- Header: `x-internal-secret`
- Not exposed to external clients

**Trade-offs:**
- ✅ Simple to understand and debug
- ✅ No additional infrastructure
- ❌ Tight coupling between services
- ❌ Recommendation service must be available during order placement
- ❌ Not ideal for high-scale async operations

**Future Enhancement:**
- Add message queue (Kafka/RabbitMQ) for async communication
- Implement event-driven architecture
- Add retry mechanisms and circuit breakers

### 4. Duplicate Order Prevention

**Problem:**
User double-clicks "Place Order" or network retry causes duplicate orders.

**Solution:** Idempotency Key Pattern

**Implementation:**
```javascript
Order Schema:
{
  idempotencyKey: {
    type: String,
    unique: true,
    sparse: true
  }
}

Logic:
1. Frontend generates UUID per checkout attempt
2. Backend checks if order with this key exists
3. If exists → return existing order
4. If not → create new order
```

**Why This Approach?**
- Database-enforced uniqueness
- No race conditions
- Works across service replicas
- Simple to implement
- Industry standard pattern (Stripe, PayPal use this)

**Alternative Approaches Considered:**
- Status locking: Complex, needs distributed locks
- Cart validation: Doesn't prevent double submission
- Time-based deduplication: Race condition prone

### 5. Scalability Design

**Stateless Services:**
- No in-memory session storage
- JWT tokens are self-contained
- Cart and user data in database
- Safe for horizontal scaling

**Horizontal Scaling:**
```
Load Balancer
      │
      ├─> Order Service Replica 1
      ├─> Order Service Replica 2
      └─> Order Service Replica 3

      ├─> Recommendation Service Replica 1
      └─> Recommendation Service Replica 2
```

**Load Balancing Strategy:**
- Platform-managed (Render/Railway/Fly.io)
- Round-robin distribution
- Health check based routing
- Automatic failover

**Scaling Triggers:**
- CPU > 70%
- Memory > 80%
- Response time > 500ms
- Request queue depth > 100

### 6. Data Flow

**Order Placement Flow:**
```
1. User adds items to cart
   └─> Cart stored in MongoDB

2. User clicks "Place Order"
   └─> Frontend sends request with idempotencyKey

3. Order Service validates:
   ├─> Check idempotencyKey (duplicate prevention)
   ├─> Verify cart not empty
   └─> Validate delivery address

4. Create order in database
   └─> Status: PENDING

5. Clear user's cart

6. Call Recommendation Service (async benefit)
   └─> Update user preferences
   └─> Invalidate recommendation cache

7. Return order details to frontend
```

**Recommendation Generation Flow:**
```
1. Frontend requests recommendations
   └─> GET /api/recommendations?userId=X

2. Check cache (TTL: 24 hours)
   ├─> If valid → return cached
   └─> If expired → regenerate

3. Query user_preferences collection
   └─> Sort by orderCount (descending)

4. Generate recommendations
   └─> Top 10 most ordered restaurants

5. Cache results
   └─> Store with timestamp

6. Return to frontend
```

### 7. Authentication & Authorization

**Strategy:** JWT (JSON Web Tokens)

**Flow:**
```
1. User signs up → Password hashed (bcrypt)
2. User logs in → JWT token issued
3. Token contains: { userId, email }
4. Token valid for: 7 days
5. Frontend stores token (localStorage/cookie)
6. Every API request includes: Authorization: Bearer <token>
7. Middleware verifies token before processing
```

**Why JWT?**
- Stateless authentication
- Scales horizontally without session store
- Self-contained (no DB lookup per request)
- Industry standard

**Security Measures:**
- Passwords hashed with bcrypt (salt rounds: 10)
- JWT signed with secret key
- Token expiration enforced
- HTTPS required in production

### 8. Error Handling

**Centralized Error Handler:**
```javascript
app.use(errorHandler)
```

**Error Categories:**
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

**Error Response Format:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detail 1", "Detail 2"]
}
```

### 9. Performance Optimizations

**Database Indexing:**
```javascript
// Order Service
restaurantSchema.index({ cityId: 1, isActive: 1 })
foodItemSchema.index({ restaurantId: 1, isAvailable: 1 })
orderSchema.index({ userId: 1, createdAt: -1 })
orderSchema.index({ idempotencyKey: 1 })

// Recommendation Service
userPreferenceSchema.index({ userId: 1 })
recommendationCacheSchema.index({ userId: 1 })
recommendationCacheSchema.index({ generatedAt: 1 }, { expireAfterSeconds: 86400 })
```

**Caching Strategy:**
- Recommendation cache: 1 hour TTL
- MongoDB TTL index for auto-cleanup
- In-memory caching not used (stateless requirement)

**Query Optimization:**
- Pagination for large datasets
- Selective field projection
- Populate only required fields

### 10. Deployment Architecture

**Free-Tier Strategy:**

**Render.com Setup:**
```
┌─────────────────────────────────┐
│  Render Platform                │
│                                 │
│  ┌─────────────────────┐       │
│  │ order-service       │       │
│  │ (Web Service)       │       │
│  │ - Auto-deploy       │       │
│  │ - HTTPS enabled     │       │
│  │ - Health checks     │       │
│  └─────────────────────┘       │
│                                 │
│  ┌─────────────────────┐       │
│  │ recommendation-svc  │       │
│  │ (Web Service)       │       │
│  │ - Auto-deploy       │       │
│  │ - HTTPS enabled     │       │
│  └─────────────────────┘       │
│                                 │
│  Built-in Load Balancer        │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  MongoDB Atlas (Free Tier)      │
│  - M0 Sandbox                   │
│  - 512 MB storage               │
│  - Shared RAM                   │
└─────────────────────────────────┘
```

**Environment Configuration:**
```
Order Service:
- PORT: Auto-assigned by platform
- MONGODB_URI: Atlas connection string
- JWT_SECRET: Strong random value
- RECOMMENDATION_SERVICE_URL: https://recommendation-service.onrender.com
- INTERNAL_API_SECRET: Shared secret

Recommendation Service:
- PORT: Auto-assigned by platform
- MONGODB_URI: Same Atlas cluster
- INTERNAL_API_SECRET: Same as Order Service
```

### 11. Version 1 Limitations & Constraints

**Known Limitations:**
1. **Shared Database:** Can become bottleneck at scale
2. **Synchronous Communication:** Recommendation service must be available
3. **No Circuit Breakers:** Service failures cascade
4. **No Rate Limiting:** Vulnerable to abuse
5. **Basic Caching:** No Redis or distributed cache
6. **No Monitoring:** Manual debugging required
7. **Cold Starts:** Free-tier services sleep after inactivity

**Acceptable Trade-offs for V1:**
- Simplicity over complexity
- Fast development over perfect architecture
- Free deployment over premium features
- Proven patterns over cutting-edge tech

### 12. Future Enhancements (Version 2+)

**Phase 2: Production-Ready**
- Separate databases per service
- Add Redis for caching
- Implement rate limiting
- Add API Gateway (Kong/Nginx)
- Set up monitoring (Prometheus + Grafana)
- Add logging (ELK stack)
- Implement circuit breakers (Hystrix pattern)

**Phase 3: High-Scale**
- Event-driven architecture with Kafka
- CQRS pattern for read/write separation
- Database sharding
- CDN for static assets
- Multi-region deployment
- Auto-scaling with Kubernetes

**Phase 4: Advanced Features**
- Real-time order tracking (WebSockets)
- Payment gateway integration
- Restaurant dashboard
- Delivery partner tracking
- Machine learning recommendations
- Search optimization (Elasticsearch)

## Technical Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Language | Node.js | Unified stack, async I/O, large ecosystem |
| Framework | Express.js | Minimal, flexible, well-documented |
| Database | MongoDB | Schema flexibility, JSON-native, free tier |
| Auth | JWT | Stateless, scalable, standard |
| Communication | REST | Simple, debuggable, no extra infra |
| Duplicate Prevention | Idempotency Key | Database-enforced, race-safe |
| Deployment | Render.com | Free tier, auto-scaling, HTTPS |
| Caching | Database TTL | Simple, no extra service needed |
| Load Balancing | Platform-managed | Zero config, included in hosting |

## Conclusion

This architecture balances:
- **Simplicity:** Easy to understand and maintain
- **Scalability:** Ready for horizontal scaling
- **Cost:** Free-tier deployable
- **Standards:** Industry best practices
- **Interview-ready:** Demonstrates microservice concepts

The system is production-capable for small-to-medium scale and provides a clear migration path for enterprise features.
