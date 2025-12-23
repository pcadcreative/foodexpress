# Fly.io Deployment Guide - With Load Balancing (FREE)

## Why Fly.io for Load Balancing?

Fly.io FREE tier includes:
- **3 shared VMs (256MB each)** - Can run multiple instances
- **Automatic load balancing** - Built-in
- **Global distribution** - Deploy to multiple regions
- **$0 cost** - Within free tier limits

---

## Architecture

```
                    Fly.io Load Balancer (Automatic)
                              |
          ┌───────────────────┼───────────────────┐
          |                   |                   |
    ┌─────▼─────┐       ┌─────▼─────┐      ┌─────▼─────┐
    │  Order-1  │       │  Order-2  │      │   Rec-1   │
    │  (VM 1)   │       │  (VM 2)   │      │  (VM 3)   │
    └───────────┘       └───────────┘      └───────────┘
```

**Note**: With 3 free VMs, you can run:
- 2 Order Service instances
- 1 Recommendation Service instance

(Or adjust as needed, max 3 VMs total)

---

## Prerequisites

1. **Install Fly CLI**
```powershell
# Using PowerShell
iwr https://fly.io/install.ps1 -useb | iex
```

2. **Verify installation**
```powershell
flyctl version
```

3. **Sign up / Login**
```powershell
flyctl auth signup
# OR
flyctl auth login
```

---

## Deployment Steps

### Step 1: Deploy Order Service

```powershell
# Navigate to order service
cd order-service

# Create app (first time only)
flyctl launch --no-deploy

# When prompted:
# - App name: food-order-service (or your choice)
# - Region: Singapore (sin) or closest to you
# - PostgreSQL: No
# - Redis: No

# Set secrets (environment variables)
flyctl secrets set MONGODB_URI="mongodb+srv://bookmyshow:bookmyshow@cluster0.qai11yd.mongodb.net/food_ordering_db?appName=Cluster0"
flyctl secrets set JWT_SECRET="super_secret_jwt_key_12345"
flyctl secrets set INTERNAL_API_SECRET="shared_internal_secret_key_67890"
flyctl secrets set RECOMMENDATION_SERVICE_URL="https://food-recommendation-service.fly.dev"

# Deploy with 2 instances (LOAD BALANCING!)
flyctl deploy

# Scale to 2 instances
flyctl scale count 2

# Verify
flyctl status
```

Your Order Service will be at: `https://food-order-service.fly.dev`

---

### Step 2: Deploy Recommendation Service

```powershell
# Navigate to recommendation service
cd ../recommendation-service

# Create app
flyctl launch --no-deploy

# When prompted:
# - App name: food-recommendation-service
# - Region: Singapore (sin)
# - PostgreSQL: No
# - Redis: No

# Set secrets
flyctl secrets set MONGODB_URI="mongodb+srv://bookmyshow:bookmyshow@cluster0.qai11yd.mongodb.net/food_ordering_db?appName=Cluster0"
flyctl secrets set INTERNAL_API_SECRET="shared_internal_secret_key_67890"

# Deploy with 1 instance (total 3 VMs now)
flyctl deploy

# Keep at 1 instance (or scale to 2 if you reduce order service)
flyctl scale count 1

# Verify
flyctl status
```

Your Recommendation Service will be at: `https://food-recommendation-service.fly.dev`

---

### Step 3: Update Order Service URL

```powershell
# Go back to order service
cd ../order-service

# Update recommendation service URL
flyctl secrets set RECOMMENDATION_SERVICE_URL="https://food-recommendation-service.fly.dev"

# Restart to apply
flyctl apps restart food-order-service
```

---

## Verify Load Balancing

### Check Running Instances

```powershell
# Order service
flyctl status -a food-order-service

# Should show 2 instances running in different regions/zones
```

### Test Load Distribution

```powershell
# Send multiple requests
for ($i=1; $i -le 10; $i++) { 
    Write-Host "Request $i"
    curl -I https://food-order-service.fly.dev
}
```

Look for `fly-request-id` header - different IDs mean different instances handled requests.

---

## Scaling Options

### Scale Order Service
```powershell
# Scale to 2 instances (load balanced)
flyctl scale count 2 -a food-order-service

# Scale back to 1
flyctl scale count 1 -a food-order-service
```

### Scale Recommendation Service
```powershell
# Scale to 2 instances
flyctl scale count 2 -a food-recommendation-service
```

**Free Tier Limit**: Max 3 total VMs across all apps

### Optimal Free Configuration:
- **Option A**: 2 Order + 1 Recommendation = 3 VMs ✅
- **Option B**: 1 Order + 2 Recommendation = 3 VMs ✅
- **Option C**: 2 Order + 2 Recommendation = 4 VMs ❌ (exceeds free tier)

---

## Useful Commands

```powershell
# View logs
flyctl logs -a food-order-service

# SSH into instance
flyctl ssh console -a food-order-service

# View all apps
flyctl apps list

# View app info
flyctl info -a food-order-service

# Monitor app
flyctl monitor -a food-order-service

# Check metrics
flyctl metrics -a food-order-service

# Destroy app (when done)
flyctl apps destroy food-order-service
```

---

## Update Deployment

When you push code changes:

```powershell
# Navigate to service
cd order-service

# Deploy updates
flyctl deploy

# Fly.io automatically:
# - Builds new image
# - Deploys to all instances
# - Load balances during update (zero downtime!)
```

---

## Cost Breakdown

| Resource | Free Tier | Your Usage | Cost |
|----------|-----------|------------|------|
| VMs (shared) | 3 × 256MB | 3 VMs | $0 |
| Bandwidth | 100GB | ~10GB | $0 |
| Storage | 3GB | ~1GB | $0 |
| **TOTAL** | | | **$0** |

---

## Advantages Over Render

| Feature | Fly.io | Render Free |
|---------|--------|-------------|
| **Multiple Instances** | ✅ YES | ❌ NO |
| **Load Balancing** | ✅ Built-in | ❌ Paid only |
| **Cold Starts** | ❌ None | ⚠️ 30s delay |
| **Always On** | ✅ YES | ❌ Sleeps |
| **Global Edge** | ✅ YES | ❌ NO |

---

## Troubleshooting

### "Not enough memory"
```powershell
# Reduce memory per VM
flyctl scale memory 128 -a food-order-service
```

### "Max apps reached"
Free tier: 2 apps max. Delete unused apps:
```powershell
flyctl apps destroy app-name
```

### Logs not showing
```powershell
flyctl logs -a food-order-service --tail
```

### Health check failing
Edit fly.toml, increase grace_period:
```toml
grace_period = "30s"
```

---

## Final URLs

After deployment, update these in your frontend:

```javascript
// In frontend/src/api.js
const API_BASE_URL = "https://food-order-service.fly.dev";
```

---

## Next Steps

1. Deploy both services following steps above
2. Test load balancing with multiple requests
3. Show mentor the `flyctl status` showing multiple instances
4. Demonstrate zero downtime with rolling deployments

Your project now has **REAL load balancing deployed online for FREE!** 🚀
