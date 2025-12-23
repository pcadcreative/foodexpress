# Railway Deployment with Nginx Load Balancer

## 🎯 Final Architecture

```
┌─────────────────────────────────────────────┐
│          Vercel (FREE)                      │
│     Frontend - React App                    │
└─────────────┬───────────────────────────────┘
              │
              │ API Calls
              │
┌─────────────▼──────────────────────────────┐
│      Railway Account 1 ($5 credit)         │
│  ┌──────────────────────────────────────┐  │
│  │   Nginx Load Balancer (Port 80)     │  │
│  │   Round-Robin Load Balancing         │  │
│  └────┬─────────────────────────┬───────┘  │
│       │                         │           │
│  ┌────▼────────┐        ┌──────▼───────┐  │
│  │ Order       │        │ Order        │  │
│  │ Service 1   │        │ Service 2    │  │
│  └─────────────┘        └──────────────┘  │
└────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│      Railway Account 2 ($5 credit)         │
│  ┌─────────────┐        ┌──────────────┐  │
│  │Recommend    │        │ Recommend    │  │
│  │Service 1    │        │ Service 2    │  │
│  └─────────────┘        └──────────────┘  │
└─────────────────────────────────────────────┘
              │
              │
        ┌─────▼──────┐
        │  MongoDB   │
        │  Atlas     │
        │  (FREE)    │
        └────────────┘
```

---

## Part 1: Railway Account 1 (Order Services + Nginx)

### Step 1: Deploy Order Service Instance 1

1. Sign in to **Railway Account 1**
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Select your repository
4. Configure:
   - **Service Name**: `order-service-1`
   - **Root Directory**: `order-service`
   - **Environment Variables**:
     ```
     PORT=3001
     MONGODB_URI=mongodb+srv://bookmyshow:bookmyshow@cluster0.qai11yd.mongodb.net/food_ordering_db?retryWrites=true&w=majority
     JWT_SECRET=super_secret_jwt_key_12345
     INTERNAL_API_SECRET=shared_internal_secret_key_67890
     RECOMMENDATION_SERVICE_URL=https://recommendation-lb.up.railway.app
     INSTANCE_NAME=order-service-1
     ```
5. Deploy and note the **private URL** (not public)
6. Railway will assign internal URL like: `order-service-1.railway.internal:3001`

### Step 2: Deploy Order Service Instance 2

1. In same project, click **"New Service"**
2. Select repository
3. Configure:
   - **Service Name**: `order-service-2`
   - **Root Directory**: `order-service`
   - **Environment Variables**: Same as above but change:
     ```
     INSTANCE_NAME=order-service-2
     ```
4. Deploy and note internal URL: `order-service-2.railway.internal:3001`

### Step 3: Deploy Nginx Load Balancer

1. In same project, click **"New Service"**
2. Select repository
3. Configure:
   - **Service Name**: `nginx-load-balancer`
   - **Root Directory**: `nginx-lb`
   - **Environment Variables**:
     ```
     ORDER_SERVICE_1_URL=order-service-1.railway.internal:3001
     ORDER_SERVICE_2_URL=order-service-2.railway.internal:3001
     ```
4. **Generate Domain** - Click "Generate Domain" to get public URL
5. Note the public URL: `https://nginx-load-balancer.up.railway.app`

**✅ Railway Account 1 Complete! (3 services)**

---

## Part 2: Railway Account 2 (Recommendation Services)

### Step 1: Sign in to Railway Account 2

1. **Sign out** from Railway Account 1
2. Sign in with **different GitHub account/email**
3. Get $5 free credit

### Step 2: Deploy Recommendation Service Instance 1

1. Click **"New Project"** → **"Deploy from GitHub"**
2. Configure:
   - **Service Name**: `recommendation-service-1`
   - **Root Directory**: `recommendation-service`
   - **Environment Variables**:
     ```
     PORT=3002
     MONGODB_URI=mongodb+srv://bookmyshow:bookmyshow@cluster0.qai11yd.mongodb.net/food_ordering_db?retryWrites=true&w=majority
     INTERNAL_API_SECRET=shared_internal_secret_key_67890
     INSTANCE_NAME=recommendation-service-1
     ```
3. **Generate Domain** - Get public URL
4. Note URL: `https://recommendation-service-1.up.railway.app`

### Step 3: Deploy Recommendation Service Instance 2

1. Click **"New Service"**
2. Configure:
   - **Service Name**: `recommendation-service-2`
   - **Root Directory**: `recommendation-service`
   - **Environment Variables**: Same as above but change:
     ```
     INSTANCE_NAME=recommendation-service-2
     ```
3. **Generate Domain**
4. Note URL: `https://recommendation-service-2.up.railway.app`

**✅ Railway Account 2 Complete! (2 services)**

---

## Part 3: Vercel (Frontend)

### Step 1: Deploy to Vercel

1. Sign in to **Vercel** with GitHub
2. Click **"Add New Project"**
3. Import your repository
4. Configure:
   - **Framework**: Create React App
   - **Root Directory**: `frontend`
   - **Environment Variables**:
     ```
     REACT_APP_ORDER_SERVICE_URL=https://nginx-load-balancer.up.railway.app
     REACT_APP_RECOMMENDATION_SERVICE_1=https://recommendation-service-1.up.railway.app
     REACT_APP_RECOMMENDATION_SERVICE_2=https://recommendation-service-2.up.railway.app
     ```
5. Click **"Deploy"**
6. Get URL: `https://food-ordering.vercel.app`

**✅ Vercel Deployment Complete!**

---

## Part 4: Update Frontend for New URLs

Update `frontend/src/api.js`:

```javascript
// Use Nginx load balancer for order service (single URL!)
const ORDER_SERVICE_URL = process.env.REACT_APP_ORDER_SERVICE_URL || 'http://localhost:3001';

// Use client-side load balancing for recommendation services
const RECOMMENDATION_SERVICE_URLS = [
  process.env.REACT_APP_RECOMMENDATION_SERVICE_1 || 'http://localhost:3002',
  process.env.REACT_APP_RECOMMENDATION_SERVICE_2 || 'http://localhost:3002'
];

let recommendationServiceIndex = 0;

function getRecommendationServiceURL() {
  const url = RECOMMENDATION_SERVICE_URLS[recommendationServiceIndex];
  recommendationServiceIndex = (recommendationServiceIndex + 1) % RECOMMENDATION_SERVICE_URLS.length;
  console.log('🔄 Using Recommendation Service:', url);
  return url;
}

const api = {
  // All order service calls go through Nginx
  signup: async (data) => {
    const response = await fetch(`${ORDER_SERVICE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  // ... rest of methods use ORDER_SERVICE_URL
  
  // Recommendation service uses load balancing
  getRecommendations: async (userId) => {
    const response = await fetch(`${getRecommendationServiceURL()}/api/recommendations?userId=${userId}`);
    return response.json();
  },
};
```

Commit and push changes - Vercel will auto-redeploy.

---

## Verify Deployment

### Test Nginx Load Balancer:
```bash
curl https://nginx-load-balancer.up.railway.app/health
# Should return: Nginx Load Balancer OK
```

### Test Order Services (via Nginx):
```bash
curl https://nginx-load-balancer.up.railway.app/
# Should return order service info
# Check response header: X-Upstream-Server shows which backend served request
```

### Test Recommendation Services:
```bash
curl https://recommendation-service-1.up.railway.app/
curl https://recommendation-service-2.up.railway.app/
```

### Test Frontend:
Open `https://food-ordering.vercel.app`

---

## Demo to Mentor

### Show Load Balancing in Action:

1. **Open Frontend** in browser
2. **Open DevTools** → Network tab
3. **Make multiple requests** (login, browse restaurants)
4. **Show Nginx headers** in response:
   - `X-Upstream-Server`: Shows which order service handled request
   - `X-Load-Balancer`: Shows "Nginx-Railway"

5. **Open Railway Dashboards** side by side:
   - Account 1: Show 3 services running (nginx + 2 order)
   - Account 2: Show 2 recommendation services

6. **Explain Architecture**:
   - "Frontend on Vercel calls Nginx load balancer"
   - "Nginx distributes requests to 2 order service instances"
   - "Recommendation services use client-side load balancing"

---

## Cost Analysis

| Account | Services | Cost/Hour | Total Hours |
|---------|----------|-----------|-------------|
| Railway Account 1 | 3 services | ~$0.03/hr | ~166 hours |
| Railway Account 2 | 2 services | ~$0.02/hr | ~250 hours |
| Vercel | Frontend | FREE | Forever |
| **Total** | **5 services** | **$10 credit** | **~200 hours** |

**Perfect for semester project!** 🎉

---

## Troubleshooting

### Issue: Nginx Can't Connect to Order Services
- Check internal Railway URLs are correct
- Ensure all services are in same project (Railway Account 1)
- Verify PORT environment variable matches

### Issue: CORS Errors
- Ensure order-service has CORS enabled
- Check Nginx passes correct headers

### Issue: Services Sleeping
- Railway free tier sleeps after 30 min inactivity
- First request wakes it up (15-30 sec delay)
- Keep services warm before demo

---

## Pro Tips for Demo

1. **Wake up all services** 5 minutes before demo
2. **Show Nginx logs** in Railway dashboard during demo
3. **Highlight X-Upstream-Server header** in browser DevTools
4. **Explain Round-Robin algorithm** while showing requests
5. **Show both Railway accounts** with running services
6. **Demonstrate automatic order status updates** (25-min delivery)

---

## After Demo

**Stop services** to save credits:
- Railway Account 1: Stop all 3 services
- Railway Account 2: Stop both services
- Vercel: Keep running (FREE!)

**Restart anytime** for next presentation! 🚀
