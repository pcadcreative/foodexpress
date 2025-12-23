# Deployment Guide

## 🚀 Deployment Options

### Option 1: Render.com (Recommended - Free Tier)

#### Prerequisites
- GitHub account
- Push your code to GitHub repository

#### Steps

1. **Prepare Repository**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. **Create Render Account**
- Go to https://render.com
- Sign up with GitHub

3. **Deploy Using Blueprint (Automated)**
- Dashboard → New → Blueprint
- Connect your GitHub repository
- Render will detect `render.yaml` and create both services automatically

4. **Configure Environment Variables**

For **order-service**:
```
MONGODB_URI=mongodb+srv://bookmyshow:bookmyshow@cluster0.qai11yd.mongodb.net/food_ordering_db?appName=Cluster0
JWT_SECRET=generate_random_secure_string_here
INTERNAL_API_SECRET=shared_secret_between_services
RECOMMENDATION_SERVICE_URL=https://recommendation-service.onrender.com
```

For **recommendation-service**:
```
MONGODB_URI=mongodb+srv://bookmyshow:bookmyshow@cluster0.qai11yd.mongodb.net/food_ordering_db?appName=Cluster0
INTERNAL_API_SECRET=same_as_order_service
```

5. **Deploy**
- Click "Apply" to deploy both services
- Wait for build and deployment (5-10 minutes)

6. **Get URLs**
- Order Service: `https://order-service.onrender.com`
- Recommendation Service: `https://recommendation-service.onrender.com`

7. **Update RECOMMENDATION_SERVICE_URL**
- Go to order-service settings
- Update `RECOMMENDATION_SERVICE_URL` with actual recommendation service URL
- Redeploy

8. **Seed Database** (One-time)
```bash
curl -X POST https://order-service.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@food.com","password":"admin123","phone":"1234567890"}'
```

Or run seed script from local pointing to production DB.

#### Free Tier Limitations
- Services sleep after 15 minutes of inactivity
- Cold start takes ~30 seconds
- 750 hours/month per service
- Shared resources

---

### Option 2: Railway.app

#### Steps

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login**
```bash
railway login
```

3. **Create Project**
```bash
railway init
```

4. **Deploy Order Service**
```bash
cd order-service
railway up
railway variables set MONGODB_URI=your_uri
railway variables set JWT_SECRET=your_secret
railway variables set INTERNAL_API_SECRET=shared_secret
railway variables set RECOMMENDATION_SERVICE_URL=https://your-rec-service.railway.app
```

5. **Deploy Recommendation Service**
```bash
cd ../recommendation-service
railway up
railway variables set MONGODB_URI=your_uri
railway variables set INTERNAL_API_SECRET=shared_secret
```

6. **Get URLs**
```bash
railway domain
```

---

### Option 3: Docker Deployment

#### Prerequisites
- Docker installed
- Docker Compose installed

#### Steps

1. **Create .env file**
```bash
cp .env.docker .env
# Edit .env with your values
```

2. **Build and Run**
```bash
docker-compose up --build
```

3. **Access Services**
- Order Service: http://localhost:3001
- Recommendation Service: http://localhost:3002

4. **Stop Services**
```bash
docker-compose down
```

#### Production Docker Deployment

1. **Push to Container Registry**
```bash
docker build -t your-registry/order-service:latest ./order-service
docker push your-registry/order-service:latest

docker build -t your-registry/recommendation-service:latest ./recommendation-service
docker push your-registry/recommendation-service:latest
```

2. **Deploy to Cloud**
- AWS ECS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform

---

### Option 4: Fly.io

#### Steps

1. **Install Fly CLI**
```bash
curl -L https://fly.io/install.sh | sh
```

2. **Login**
```bash
flyctl auth login
```

3. **Deploy Order Service**
```bash
cd order-service
flyctl launch
flyctl secrets set MONGODB_URI=your_uri
flyctl secrets set JWT_SECRET=your_secret
flyctl secrets set INTERNAL_API_SECRET=shared_secret
flyctl secrets set RECOMMENDATION_SERVICE_URL=https://your-rec.fly.dev
flyctl deploy
```

4. **Deploy Recommendation Service**
```bash
cd ../recommendation-service
flyctl launch
flyctl secrets set MONGODB_URI=your_uri
flyctl secrets set INTERNAL_API_SECRET=shared_secret
flyctl deploy
```

---

## 📊 MongoDB Atlas Setup

1. **Whitelist IPs**
- Go to MongoDB Atlas Dashboard
- Network Access → Add IP Address
- For testing: Add `0.0.0.0/0` (allow all)
- For production: Add specific Render/Railway IPs

2. **Connection String**
```
mongodb+srv://bookmyshow:bookmyshow@cluster0.qai11yd.mongodb.net/food_ordering_db?appName=Cluster0
```

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change MongoDB password
- [ ] Generate strong JWT_SECRET (use: `openssl rand -base64 32`)
- [ ] Generate strong INTERNAL_API_SECRET
- [ ] Enable HTTPS only
- [ ] Whitelist specific IPs in MongoDB Atlas
- [ ] Set up rate limiting
- [ ] Enable CORS for specific origins only
- [ ] Add monitoring and logging
- [ ] Set up alerts for errors
- [ ] Use environment variables (never commit secrets)

---

## 🧪 Test Deployed APIs

```bash
# Replace with your actual deployed URL
export API_URL=https://order-service.onrender.com

# Test health
curl $API_URL/

# Signup
curl -X POST $API_URL/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123","phone":"1234567890"}'

# Login
curl -X POST $API_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

## 📈 Monitoring

### Free Monitoring Tools
- **Render Dashboard**: Built-in metrics
- **MongoDB Atlas**: Database monitoring
- **UptimeRobot**: Service uptime monitoring (free)
- **LogTail**: Free log management

---

## 🐛 Troubleshooting

### Service not responding
- Check Render logs: Dashboard → Service → Logs
- Verify environment variables are set
- Check MongoDB connection string
- Ensure services are not sleeping (free tier)

### 502 Bad Gateway
- Service is starting (cold start)
- Wait 30 seconds and retry
- Check service logs for errors

### Authentication failing
- Verify JWT_SECRET is set
- Check token format: `Bearer token`
- Ensure token not expired (7 days)

### Order placement not updating recommendations
- Verify RECOMMENDATION_SERVICE_URL is correct
- Check INTERNAL_API_SECRET matches in both services
- Review order-service logs for errors

---

## 💰 Cost Estimation

### Free Tier (Current Setup)
- Render: $0 (750 hrs/month per service)
- MongoDB Atlas: $0 (512MB storage)
- Total: **$0/month**

### Paid Tier (Production Ready)
- Render Basic: $7/service × 2 = $14/month
- MongoDB Atlas M10: $9/month
- Total: **~$23/month**

### Scale Up
- Render Standard: $15/service × 2 = $30/month
- MongoDB M20: $35/month
- Redis Cache: $5/month
- Total: **~$70/month**

---

## 🚦 Next Steps After Deployment

1. Seed production database
2. Test all API endpoints
3. Set up monitoring
4. Create frontend application
5. Configure custom domain
6. Set up CI/CD pipeline
7. Add automated tests
8. Implement caching layer
9. Add API documentation (Swagger)
10. Set up backup strategy
