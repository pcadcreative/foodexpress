# Oracle Cloud Always Free - Load Balancing Deployment

## Why Oracle Cloud?

**Truly free FOREVER (not a trial):**
- 2 AMD Compute instances (1/8 OCPU, 1GB RAM each)
- OR 4 ARM Ampere A1 instances (up to 4 OCPUs, 24GB RAM total)
- 200GB Block Storage
- 10GB Object Storage
- Load Balancer included

**Perfect for your 4 services with load balancing!**

---

## Prerequisites

1. Oracle Cloud account (requires credit card for verification, but won't charge)
2. Your application code
3. Docker installed locally (for building images)

---

## Quick Setup

### Step 1: Create Oracle Cloud Account
1. Go to https://www.oracle.com/cloud/free/
2. Sign up (requires credit card for verification only)
3. No charges unless you manually upgrade to paid

### Step 2: Create 2 VMs (Always Free)

1. **Dashboard → Compute → Instances → Create Instance**

**Instance 1 - Order Services:**
- Name: `order-services`
- Image: Ubuntu 22.04
- Shape: VM.Standard.E2.1.Micro (Always Free)
- VCN: Create new or use default
- Public IP: Assign
- SSH Key: Generate or upload your key

**Instance 2 - Recommendation Services:**
- Name: `recommendation-services`
- Image: Ubuntu 22.04
- Shape: VM.Standard.E2.1.Micro (Always Free)
- VCN: Same as above
- Public IP: Assign
- SSH Key: Same as above

### Step 3: Configure Security Rules

**VCN → Security List → Ingress Rules:**
```
Source: 0.0.0.0/0
Port: 80 (HTTP)
Port: 443 (HTTPS)
Port: 3001 (Order Service)
Port: 3002 (Recommendation Service)
```

### Step 4: Install Docker on Both VMs

SSH into each VM:
```bash
ssh -i your-key.pem ubuntu@<VM_PUBLIC_IP>

# Install Docker
sudo apt update
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker ubuntu
sudo systemctl enable docker
sudo systemctl start docker

# Verify
docker --version
```

### Step 5: Deploy Services

**On VM 1 (Order Services):**
```bash
# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  nginx-lb:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - order-1
      - order-2
    restart: always

  order-1:
    image: YOUR_DOCKERHUB_USERNAME/order-service:latest
    environment:
      - PORT=3001
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - INTERNAL_API_SECRET=${INTERNAL_API_SECRET}
      - RECOMMENDATION_SERVICE_URL=http://RECOMMENDATION_VM_IP
      - INSTANCE_NAME=ORDER-1
    expose:
      - "3001"
    restart: always

  order-2:
    image: YOUR_DOCKERHUB_USERNAME/order-service:latest
    environment:
      - PORT=3001
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - INTERNAL_API_SECRET=${INTERNAL_API_SECRET}
      - RECOMMENDATION_SERVICE_URL=http://RECOMMENDATION_VM_IP
      - INSTANCE_NAME=ORDER-2
    expose:
      - "3001"
    restart: always
EOF

# Create nginx.conf for load balancing
cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream order_backend {
        server order-1:3001;
        server order-2:3001;
    }

    server {
        listen 80;
        
        location / {
            proxy_pass http://order_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            add_header X-Upstream-Server $upstream_addr always;
        }
    }
}
EOF

# Create .env file
cat > .env << 'EOF'
MONGODB_URI=mongodb+srv://bookmyshow:bookmyshow@cluster0.qai11yd.mongodb.net/food_ordering_db
JWT_SECRET=super_secret_jwt_key_12345
INTERNAL_API_SECRET=shared_internal_secret_key_67890
EOF

# Start services
docker-compose up -d
```

**On VM 2 (Recommendation Services):**
```bash
# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  nginx-lb:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - rec-1
      - rec-2
    restart: always

  rec-1:
    image: YOUR_DOCKERHUB_USERNAME/recommendation-service:latest
    environment:
      - PORT=3002
      - MONGODB_URI=${MONGODB_URI}
      - INTERNAL_API_SECRET=${INTERNAL_API_SECRET}
      - INSTANCE_NAME=REC-1
    expose:
      - "3002"
    restart: always

  rec-2:
    image: YOUR_DOCKERHUB_USERNAME/recommendation-service:latest
    environment:
      - PORT=3002
      - MONGODB_URI=${MONGODB_URI}
      - INTERNAL_API_SECRET=${INTERNAL_API_SECRET}
      - INSTANCE_NAME=REC-2
    expose:
      - "3002"
    restart: always
EOF

# Create nginx.conf
cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream rec_backend {
        server rec-1:3002;
        server rec-2:3002;
    }

    server {
        listen 80;
        
        location / {
            proxy_pass http://rec_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            add_header X-Upstream-Server $upstream_addr always;
        }
    }
}
EOF

# Create .env file
cat > .env << 'EOF'
MONGODB_URI=mongodb+srv://bookmyshow:bookmyshow@cluster0.qai11yd.mongodb.net/food_ordering_db
INTERNAL_API_SECRET=shared_internal_secret_key_67890
EOF

# Start services
docker-compose up -d
```

---

## Before Deploying: Push Images to Docker Hub

**From your local machine:**

```powershell
# Login to Docker Hub
docker login

# Build and push order service
cd order-service
docker build -t YOUR_USERNAME/order-service:latest .
docker push YOUR_USERNAME/order-service:latest

# Build and push recommendation service
cd ../recommendation-service
docker build -t YOUR_USERNAME/recommendation-service:latest .
docker push YOUR_USERNAME/recommendation-service:latest
```

---

## Access Your Services

After deployment:
- **Order Service**: `http://<ORDER_VM_PUBLIC_IP>` (load balanced across 2 instances)
- **Recommendation Service**: `http://<REC_VM_PUBLIC_IP>` (load balanced across 2 instances)

---

## Verify Load Balancing

```bash
# From your PC
for i in {1..10}; do
  curl -I http://<ORDER_VM_PUBLIC_IP>
done

# Look for X-Upstream-Server header changing between order-1 and order-2
```

---

## Architecture Deployed

```
Oracle Cloud (Forever Free)
│
├── VM 1 (order-services)
│   ├── Nginx Load Balancer (Port 80)
│   ├── order-service-1 ✅
│   └── order-service-2 ✅
│
└── VM 2 (recommendation-services)
    ├── Nginx Load Balancer (Port 80)
    ├── recommendation-service-1 ✅
    └── recommendation-service-2 ✅
```

---

## Costs

**$0 forever** - As long as you stay within Always Free limits:
- ✅ 2 VMs (both Always Free eligible)
- ✅ Network egress: 10TB/month free
- ✅ No time limit (unlike AWS 12 months)

---

## Monitoring

```bash
# SSH into VM
ssh -i your-key.pem ubuntu@<VM_IP>

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Restart services
docker-compose restart
```

---

## Advantages

✅ **Truly free forever** (not trial)  
✅ **4 instances deployed with load balancing**  
✅ **Production-grade infrastructure**  
✅ **No cold starts**  
✅ **Full control over VMs**  

---

## This Solution Gives You EXACTLY What You Want:

- ✅ order-service-1 (online)
- ✅ order-service-2 (online)
- ✅ recommendation-service-1 (online)
- ✅ recommendation-service-2 (online)
- ✅ Load balancing (Nginx)
- ✅ $0 cost forever
