# Hybrid Deployment: Railway (2 Accounts) + Vercel

## 🎯 Deployment Strategy

**Railway Account 1**: 2 Order Service instances
**Railway Account 2**: 2 Recommendation Service instances  
**Vercel**: Frontend (FREE)

**Total Cost**: $10 Railway credits + $0 Vercel = Best value!

---

## Part 1: Railway Account 1 - Order Services

### Step 1: Sign in to Railway Account 1

1. Go to https://railway.app
2. Sign in with **GitHub Account 1** (or create new)
3. Get $5 free credit

### Step 2: Deploy Order Service Instance 1

1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Select your repository
3. **Root Directory**: `order-service`
4. **Environment Variables**:
   ```
   PORT=3001
   MONGODB_URI=mongodb+srv://bookmyshow:bookmyshow@cluster0.qai11yd.mongodb.net/food_ordering_db?retryWrites=true&w=majority
   JWT_SECRET=super_secret_jwt_key_12345
   INTERNAL_API_SECRET=shared_internal_secret_key_67890
   RECOMMENDATION_SERVICE_URL=https://recommendation-service-1.up.railway.app
   INSTANCE_NAME=order-service-1
   ```
5. Deploy and get URL: `https://order-service-1.up.railway.app`

### Step 3: Deploy Order Service Instance 2

1. In same project, click **"New Service"**
2. Select same repository
3. **Root Directory**: `order-service`
4. **Environment Variables**: (Same as above but change)
   ```
   INSTANCE_NAME=order-service-2
   RECOMMENDATION_SERVICE_URL=https://recommendation-service-2.up.railway.app
   ```
5. Deploy and get URL: `https://order-service-2.up.railway.app`

**✅ Railway Account 1 Complete!**

---

## Part 2: Railway Account 2 - Recommendation Services

### Step 1: Sign in to Railway Account 2

1. **Sign out** from Railway Account 1
2. Go to https://railway.app
3. Sign in with **GitHub Account 2** (or different email)
4. Get another $5 free credit

### Step 2: Deploy Recommendation Service Instance 1

1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Select your repository (authorize if needed)
3. **Root Directory**: `recommendation-service`
4. **Environment Variables**:
   ```
   PORT=3002
   MONGODB_URI=mongodb+srv://bookmyshow:bookmyshow@cluster0.qai11yd.mongodb.net/food_ordering_db?retryWrites=true&w=majority
   INTERNAL_API_SECRET=shared_internal_secret_key_67890
   INSTANCE_NAME=recommendation-service-1
   ```
5. Deploy and get URL: `https://recommendation-service-1.up.railway.app`

### Step 3: Deploy Recommendation Service Instance 2

1. In same project, click **"New Service"**
2. Select same repository
3. **Root Directory**: `recommendation-service`
4. **Environment Variables**: (Same as above but change)
   ```
   INSTANCE_NAME=recommendation-service-2
   ```
5. Deploy and get URL: `https://recommendation-service-2.up.railway.app`

**✅ Railway Account 2 Complete!**

---

## Part 3: Vercel - Frontend (FREE)

### Step 1: Create Vercel Configuration

File already created: `frontend/vercel.json`

### Step 2: Sign in to Vercel

1. Go to https://vercel.com
2. Sign in with **GitHub**
3. Authorize Vercel

### Step 3: Deploy Frontend

1. Click **"Add New Project"**
2. **Import Git Repository** → Select your repo
3. **Framework Preset**: Create React App
4. **Root Directory**: `frontend`
5. **Environment Variables**:
   ```
   REACT_APP_ORDER_SERVICE_1=https://order-service-1.up.railway.app
   REACT_APP_ORDER_SERVICE_2=https://order-service-2.up.railway.app
   REACT_APP_RECOMMENDATION_SERVICE_1=https://recommendation-service-1.up.railway.app
   REACT_APP_RECOMMENDATION_SERVICE_2=https://recommendation-service-2.up.railway.app
   ```
6. Click **"Deploy"**
7. Get URL: `https://food-ordering-system.vercel.app`

**✅ Vercel Deployment Complete!**

---

## Part 4: Update Frontend for Load Balancing

Update `frontend/src/api.js` to use all 4 backend URLs:

```javascript
// Backend service URLs from environment or defaults
const ORDER_SERVICE_URLS = [
  process.env.REACT_APP_ORDER_SERVICE_1 || 'https://order-service-1.up.railway.app',
  process.env.REACT_APP_ORDER_SERVICE_2 || 'https://order-service-2.up.railway.app'
];

const RECOMMENDATION_SERVICE_URLS = [
  process.env.REACT_APP_RECOMMENDATION_SERVICE_1 || 'https://recommendation-service-1.up.railway.app',
  process.env.REACT_APP_RECOMMENDATION_SERVICE_2 || 'https://recommendation-service-2.up.railway.app'
];

// Round-robin load balancing
let orderServiceIndex = 0;
let recommendationServiceIndex = 0;

function getOrderServiceURL() {
  const url = ORDER_SERVICE_URLS[orderServiceIndex];
  orderServiceIndex = (orderServiceIndex + 1) % ORDER_SERVICE_URLS.length;
  return url;
}

function getRecommendationServiceURL() {
  const url = RECOMMENDATION_SERVICE_URLS[recommendationServiceIndex];
  recommendationServiceIndex = (recommendationServiceIndex + 1) % RECOMMENDATION_SERVICE_URLS.length;
  return url;
}

// Export API instance
const API_URL = getOrderServiceURL();

export const api = axios.create({
  baseURL: API_URL
});

// Interceptor to rotate URLs on each request
api.interceptors.request.use(config => {
  // Rotate to next order service
  config.baseURL = getOrderServiceURL();
  return config;
});

// For recommendation service calls
export const recommendationApi = axios.create({
  baseURL: getRecommendationServiceURL()
});

recommendationApi.interceptors.request.use(config => {
  config.baseURL = getRecommendationServiceURL();
  return config;
});
```

Then **redeploy** on Vercel (automatic on git push).

---

## Part 5: Update Railway URLs

After getting all URLs, update the environment variables:

### Railway Account 1 (Order Services):
Update both order service instances:
```
RECOMMENDATION_SERVICE_URL=https://recommendation-service-1.up.railway.app
```

### Railway Account 2 (Recommendation Services):
No updates needed (they don't call order service).

---

## Final Architecture

```
┌─────────────────────────────────────────────────┐
│          Vercel (FREE)                          │
│     https://food-ordering.vercel.app            │
│              Frontend                           │
└────────────┬───────────────────────────────────┘
             │
             │ Round-Robin Load Balancing
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
┌─────────────┐ ┌─────────────┐
│ Railway #1  │ │ Railway #2  │
│ ($5 credit) │ │ ($5 credit) │
├─────────────┤ ├─────────────┤
│ Order-1     │ │ Recommend-1 │
│ Order-2     │ │ Recommend-2 │
└─────────────┘ └─────────────┘
      │             │
      └──────┬──────┘
             │
             ▼
      ┌─────────────┐
      │ MongoDB     │
      │ Atlas (FREE)│
      └─────────────┘
```

---

## Verify Deployment

1. **Order Service 1**: `https://order-service-1.up.railway.app`
2. **Order Service 2**: `https://order-service-2.up.railway.app`
3. **Recommendation 1**: `https://recommendation-service-1.up.railway.app`
4. **Recommendation 2**: `https://recommendation-service-2.up.railway.app`
5. **Frontend**: `https://food-ordering.vercel.app`

Test each URL returns JSON response.

---

## Cost Analysis

| Platform | Services | Cost | Duration |
|----------|----------|------|----------|
| Railway Account 1 | 2 order services | $5 credit | ~125 hours |
| Railway Account 2 | 2 rec services | $5 credit | ~125 hours |
| Vercel | Frontend | FREE | Forever |
| MongoDB Atlas | Database | FREE | Forever |
| **Total** | **5 services** | **$10 credit** | **~125 hours** |

**Perfect for semester project demo!** 🎉

---

## Monitoring

### Railway Account 1:
- Dashboard → Usage → Monitor order services

### Railway Account 2:
- Dashboard → Usage → Monitor recommendation services

### Vercel:
- Dashboard → Analytics → Monitor frontend traffic

---

## Demo to Mentor

1. Open frontend: `https://food-ordering.vercel.app`
2. Show load balancing in browser DevTools Network tab
3. Point out different `X-Powered-By` headers showing different instances
4. Open Railway dashboards showing 4 running backend instances
5. Show automatic order status updates (25-minute delivery)

---

## Troubleshooting

### Issue: Cross-Account Communication
- Ensure all environment variables have correct URLs
- Check CORS is enabled on all backend services
- Verify MongoDB connection string is same for all

### Issue: Frontend Not Connecting
- Check environment variables in Vercel dashboard
- Verify backend URLs are accessible (not sleeping)
- Check browser console for CORS errors

### Issue: Railway Service Sleeping
- Railway free tier sleeps after inactivity
- First request wakes it up (15-30 sec delay)
- Keep services active during demo

---

## Pro Tips

1. **Test before demo**: Wake up all services 5 minutes before
2. **Keep tabs open**: Open all Railway dashboards + Vercel
3. **Show logs live**: Display Railway logs during demo
4. **Explain architecture**: Use the diagram above
5. **Highlight load balancing**: Show round-robin in action

---

## After Demo

**Stop services** to save credits:
- Railway Account 1: Stop order services
- Railway Account 2: Stop recommendation services
- Vercel: Keep running (FREE anyway!)

**Restart anytime** with one click! 🚀
