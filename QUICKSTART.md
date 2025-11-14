# 🚀 Quick Start Guide - Spark Investment Backend

## ✅ Phase 1 Complete!

The backend foundation is ready with authentication APIs. Here's how to get started.

---

## 📦 What's Been Built

### Infrastructure ✅
- Node.js + Express server with ES modules
- PostgreSQL database with Prisma ORM
- JWT-based authentication
- Error handling & security middleware
- CORS configuration for frontend

### Database Models ✅ (8 models)
- User, Platform, Portfolio, Investment
- Transaction, AutoInvestStrategy
- UserSettings, MarketDataCache

### API Endpoints ✅ (4 endpoints)
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/health` - Health check

---

## 🏃 Running the Backend (5 minutes)

### Step 1: Install PostgreSQL (if not installed)

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

### Step 2: Create Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE spark_investment;

# Create user (optional)
CREATE USER spark_user WITH PASSWORD 'S2A5I4I9D3';
GRANT ALL PRIVILEGES ON DATABASE spark_investment TO spark_user;

# Exit
\q
```

### Step 3: Configure Environment

```bash
# The .env file is already created
# Edit it with your database credentials
nano .env
```

Update this line in `.env`:
```env
DATABASE_URL="postgresql://spark_user:your_password@localhost:5432/spark_investment"
your_password: - S2A5I4I9D3 [to be deleted before prod]
```

### Step 4: Install Dependencies & Run Migrations

```bash
# Already installed, but if needed:
npm install

# Generate Prisma Client
npm run prisma:generate

# Run database migrations (creates tables)
npm run migrate
```

### Step 5: Start the Server

```bash
npm run dev
```

You should see:
```
🚀 ========================================
🚀 Spark Investment Backend API
🚀 Environment: development
🚀 Server running on port 5000
🚀 API URL: http://localhost:5000/api
🚀 Health Check: http://localhost:5000/api/health
🚀 ========================================
```

---

## 🧪 Testing the Backend (2 minutes)

### Test 1: Health Check
```bash
curl http://localhost:5000/api/health
```

Expected:
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2025-11-13T...",
    "uptime": 123.456,
    "environment": "development"
  }
}
```

### Test 2: Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User"
  }'
```

Expected:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "test@example.com",
      "name": "Test User",
      "createdAt": "2025-11-13T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Test 3: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### Test 4: Get Current User (Protected Route)
```bash
# Replace YOUR_TOKEN with the token from signup/login response
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔗 Connecting Frontend

### Option 1: Test with Existing Auth (RECOMMENDED)

Your frontend is already built and ready! Just update the environment:

```bash
# In your frontend project
cd ../Spark-Investment-Frontend

# Update .env
VITE_MOCK_MODE=false
VITE_API_BASE_URL=http://localhost:5000/api

# Restart frontend
npm run dev
```

Now try:
1. Visit http://localhost:5173
2. Click "Sign Up"
3. Create an account
4. Login
5. Backend authentication is now live! ✅

### Option 2: Keep Using Mock Data

Keep `VITE_MOCK_MODE=true` in frontend until all endpoints are ready.

---

## 📊 Database GUI (Optional)

View your database visually with Prisma Studio:

```bash
npm run studio
```

Opens at http://localhost:5555

---

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check DATABASE_URL in .env is correct
cat .env | grep DATABASE_URL
```

### Port 5000 Already in Use
```bash
# Find process using port
lsof -i :5000

# Kill it
kill -9 <PID>

# Or change PORT in .env
PORT=5001
```

### Prisma Client Not Generated
```bash
npm run prisma:generate
```

---

## 📝 What's Next?

### Phase 2: Portfolio APIs (Next Sprint)
- GET /api/portfolio/summary
- GET /api/portfolio/platforms
- GET /api/portfolio/performance
- GET /api/portfolio/allocation
- POST /api/portfolio/connect
- And more...

### See Full Roadmap
Check `Track/BACKEND_ROADMAP.md` for the complete 12-week plan.

---

## 📚 Documentation Updated

✅ **FRONTEND_IMPACT.md** - Auth APIs documented
✅ **COMPATIBILITY.md** - Phase 1 status updated
✅ **API_CONTRACT.md** - Already documented (50+ endpoints)
✅ **README.md** - Complete setup guide

---

## 🎯 Testing Checklist for Frontend Team

- [ ] Backend server starts successfully
- [ ] Health check responds
- [ ] Signup creates user in database
- [ ] Login returns valid JWT token
- [ ] Protected route `/api/auth/me` requires token
- [ ] Frontend can signup via real API
- [ ] Frontend can login via real API
- [ ] Frontend stores token correctly
- [ ] Frontend handles auth errors gracefully

---

## 💡 Tips

**Viewing Logs:**
- Requests are logged to console
- Check terminal where `npm run dev` is running

**Database Reset:**
```bash
npm run migrate -- reset
```

**Production Ready:**
- Update JWT_SECRET in .env
- Set NODE_ENV=production
- Use proper PostgreSQL credentials
- Enable HTTPS

---

## 📞 Need Help?

1. Check README.md for detailed docs
2. Check Track/ folder for integration guides
3. Test endpoints with curl or Postman
4. Verify database connection with Prisma Studio

---

**Status:** ✅ Phase 1 Complete - Authentication Live!
**Next:** 🔨 Phase 2 - Portfolio APIs
**Updated:** 2025-11-13

Happy testing! 🚀
