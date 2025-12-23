# Railway.app Deployment Guide

## 🚀 Deploy Food Ordering System on Railway

Railway.app provides $5 free credit monthly - perfect for running multiple service instances with load balancing demonstration.

---

## Prerequisites

1. **GitHub Account** (for Railway login)
2. **Push your code to GitHub** repository
3. **MongoDB Atlas** (already configured)

---

## Step 1: Push Code to GitHub

```powershell
cd "e:\SANJAY PC OFFICIAL FILES\SANJAY pc\SEMESTER 5\system design\food_ordering"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Food ordering system with load balancing"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/food-ordering-system.git

# Push
git push -u origin main
```

---

## Step 2: Sign Up on Railway

1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Sign in with **GitHub**
4. Authorize Railway to access your repositories

---

## Step 3: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your `food-ordering-system` repository
4. Railway will detect the monorepo structure

---

## Step 4: Deploy Order Service (Instance 1)

1. Click **"Add Service"** → **"GitHub Repo"**
2. Select your repository
3. Configure:
   - **Root Directory**: `order-service`
   - **Start Command**: `node src/app.js`

4. **Add Environment Variables**:
   ```
   PORT=3001
   MONGODB_URI=mongodb+srv://bookmyshow:bookmyshow@cluster0.qai11yd.mongodb.net/food_ordering_db?retryWrites=true&w=majority
   JWT_SECRET=super_secret_jwt_key_12345
   INTERNAL_API_SECRET=shared_internal_secret_key_67890
   RECOMMENDATION_SERVICE_URL=https://recommendation-service-production.up.railway.app
   INSTANCE_NAME=order-service-1
   ```

5. Click **"Deploy"**
6. Wait for deployment to complete
7. Railway will provide a public URL like: `https://order-service-1-production.up.railway.app`

---

## Step 5: Deploy Order Service (Instance 2)

1. Click **"Add Service"** again
2. Select same repository
3. Configure:
   - **Root Directory**: `order-service`
   - **Start Command**: `node src/app.js`

4. **Add Environment Variables** (same as above but change):
   ```
   INSTANCE_NAME=order-service-2
   ```
   (All other variables same)

5. Click **"Deploy"**
6. Get URL: `https://order-service-2-production.up.railway.app`

---

## Step 6: Deploy Recommendation Service (Instance 1)

1. Click **"Add Service"**
2. Select repository
3. Configure:
   - **Root Directory**: `recommendation-service`
   - **Start Command**: `node src/app.js`

4. **Add Environment Variables**:
   ```
   PORT=3002
   MONGODB_URI=mongodb+srv://bookmyshow:bookmyshow@cluster0.qai11yd.mongodb.net/food_ordering_db?retryWrites=true&w=majority
   INTERNAL_API_SECRET=shared_internal_secret_key_67890
   INSTANCE_NAME=recommendation-service-1
   ```

5. Click **"Deploy"**
6. Get URL: `https://recommendation-service-1-production.up.railway.app`

---

## Step 7: Deploy Recommendation Service (Instance 2)

1. Repeat Step 6 with:
   ```
   INSTANCE_NAME=recommendation-service-2
   ```

2. Get URL: `https://recommendation-service-2-production.up.railway.app`

---

## Step 8: Deploy Frontend

1. Click **"Add Service"**
2. Select repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Start Command**: `npm start`

4. **Add Environment Variables**:
   ```
   REACT_APP_API_URL=https://order-service-1-production.up.railway.app
   PORT=3000
   ```

5. Click **"Deploy"**
6. Get URL: `https://frontend-production.up.railway.app`

---

## Step 9: Update Frontend API Configuration

After deployment, update the frontend to use the correct Railway URLs:

**Update `frontend/src/api.js`:**

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'https://order-service-1-production.up.railway.app';
```

Then redeploy the frontend service.

---

## Step 10: Implement Load Balancing (Using Railway's Built-in Features)

Railway provides **automatic load balancing** when you deploy multiple instances. However, to demonstrate manual load balancing:

### Option A: Client-Side Load Balancing (Simple)

Update `frontend/src/api.js`:

```javascript
// Array of backend URLs
const ORDER_SERVICE_URLS = [
  'https://order-service-1-production.up.railway.app',
  'https://order-service-2-production.up.railway.app'
];

const RECOMMENDATION_SERVICE_URLS = [
  'https://recommendation-service-1-production.up.railway.app',
  'https://recommendation-service-2-production.up.railway.app'
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

// Use in API calls
export const api = axios.create({
  baseURL: getOrderServiceURL()
});
```

### Option B: Deploy Nginx Load Balancer (Advanced)

Create a separate Nginx service on Railway that proxies to both instances.

---

## Verify Deployment

1. **Check Order Service 1**: Visit `https://order-service-1-production.up.railway.app`
2. **Check Order Service 2**: Visit `https://order-service-2-production.up.railway.app`
3. **Check Recommendation Service 1**: Visit `https://recommendation-service-1-production.up.railway.app`
4. **Check Recommendation Service 2**: Visit `https://recommendation-service-2-production.up.railway.app`
5. **Check Frontend**: Visit `https://frontend-production.up.railway.app`

---

## Monitor Usage

1. Go to Railway Dashboard
2. Click **"Usage"** tab
3. Monitor your **$5 credit consumption**
4. Each service costs ~$0.01-0.02 per hour

**Estimated costs:**
- 4 backend services + 1 frontend = ~5 services
- ~$0.05-0.10 per hour
- $5 credit = ~50-100 hours of runtime
- Perfect for project demos!

---

## Load Balancing Demonstration

### Test Load Distribution:

```powershell
# Test order service load balancing
for ($i=1; $i -le 10; $i++) {
    Invoke-WebRequest -Uri "https://order-service-1-production.up.railway.app" -UseBasicParsing
    Invoke-WebRequest -Uri "https://order-service-2-production.up.railway.app" -UseBasicParsing
}
```

### Check Which Instance Served Request:

Add this to your service responses:

```javascript
// In order-service/src/app.js
app.get('/', (req, res) => {
  res.json({
    service: 'Order & Delivery Service',
    instance: process.env.INSTANCE_NAME || 'unknown',
    status: 'running',
    version: '1.0.0'
  });
});
```

---

## Troubleshooting

### Issue: Build Failed
- Check Dockerfile exists in service directory
- Verify `railway.json` is present
- Check Railway logs for errors

### Issue: Service Not Starting
- Verify environment variables are set correctly
- Check MongoDB connection string
- Review Railway deployment logs

### Issue: Frontend Can't Connect to Backend
- Ensure REACT_APP_API_URL is set correctly
- Check CORS is enabled in backend
- Verify backend services are running

---

## Cost Optimization

1. **Stop services when not demoing** (free!)
2. **Use shared MongoDB Atlas** (already free)
3. **Deploy only during presentation** to save credits
4. **Remove services after demo** to preserve credit

---

## Alternative: Railway CLI Deployment

```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy order-service-1
cd order-service
railway up

# Deploy order-service-2 (new instance)
railway up --service order-service-2
```

---

## Summary

✅ **Total Services on Railway**: 5 (2 order + 2 recommendation + 1 frontend)
✅ **Cost**: ~$0.05-0.10/hour (50-100 hours free)
✅ **URLs**: All services get unique public URLs
✅ **Load Balancing**: Client-side round-robin or Nginx
✅ **Demo Ready**: Perfect for mentor presentation

---

## Next Steps After Deployment

1. Test all service endpoints
2. Seed database with data
3. Test frontend UI
4. Demonstrate load balancing to mentor
5. Show Railway dashboard with multiple running instances

**Your system will be accessible 24/7 without needing your laptop!** 🎉
