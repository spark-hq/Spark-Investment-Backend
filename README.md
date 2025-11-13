# 🚀 Spark Investment Backend API

Backend API for **Spark Investment AI** - An AI-powered investment tracking and trading platform.

## 📊 Project Status

**Current Version:** v1.0.0 (In Development)
**Phase:** Phase 1 - Foundation Complete ✅
**Started:** 2025-11-13

### ✅ Completed Features:
- ✅ Project setup and structure
- ✅ PostgreSQL database with Prisma ORM
- ✅ Express server with middleware
- ✅ JWT-based authentication (signup, login)
- ✅ Error handling and response utilities
- ✅ Database schema with 8 models

### 🚧 In Progress:
- Portfolio management APIs
- Investment tracking APIs
- Market data integration
- AI analysis engine

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT + bcrypt
- **Security:** Helmet, CORS
- **WebSocket:** Socket.io

---

## 📁 Project Structure

```
Spark-Investment-Backend/
├── src/
│   ├── config/          # Configuration files
│   │   └── database.js  # Prisma client setup
│   ├── controllers/     # Route controllers
│   │   └── authController.js
│   ├── middleware/      # Custom middleware
│   │   ├── auth.js      # JWT authentication
│   │   └── errorHandler.js
│   ├── routes/          # API routes
│   │   ├── index.js     # Main router
│   │   └── auth.js      # Auth routes
│   ├── utils/           # Helper functions
│   │   ├── errors.js    # Custom error classes
│   │   ├── jwt.js       # JWT utilities
│   │   ├── password.js  # Password hashing
│   │   └── response.js  # Response helpers
│   ├── app.js           # Express app
│   └── server.js        # Server entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── tests/               # Test files
├── Track/               # Backend-Frontend coordination docs
├── .env                 # Environment variables
├── .env.example         # Environment template
├── .gitignore
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd Spark-Investment-Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Configure PostgreSQL:**
   ```bash
   # Create database
   createdb spark_investment

   # Or using psql:
   psql -U postgres
   CREATE DATABASE spark_investment;
   ```

5. **Update DATABASE_URL in .env:**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/spark_investment"
   ```

6. **Run database migrations:**
   ```bash
   npm run migrate
   ```

7. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

8. **Start the development server:**
   ```bash
   npm run dev
   ```

Server should now be running at `http://localhost:5000`

---

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2025-11-13T10:30:00.000Z",
    "uptime": 123.456,
    "environment": "development"
  }
}
```

### Authentication

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User",
    "phone": "+91-9876543210"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

**Get Current User:**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start development server with nodemon

# Production
npm start                # Start production server

# Database
npm run migrate          # Run database migrations
npm run migrate:deploy   # Deploy migrations to production
npm run studio           # Open Prisma Studio (database GUI)
npm run prisma:generate  # Generate Prisma Client

# Testing
npm test                 # Run tests with coverage
npm run test:watch       # Run tests in watch mode
```

---

## 🗄️ Database Models

### Current Models (8):
1. **User** - User accounts and authentication
2. **Platform** - Connected investment platforms (Zerodha, Groww, etc.)
3. **Portfolio** - User portfolios
4. **Investment** - Individual investments (stocks, mutual funds, crypto)
5. **Transaction** - Buy/sell transactions
6. **AutoInvestStrategy** - SIP and auto-invest strategies
7. **UserSettings** - User preferences and settings
8. **MarketDataCache** - Cached market data for performance

---

## 🔐 Environment Variables

Required environment variables (see `.env.example`):

```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/spark_investment"

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# External APIs (for future features)
ALPHA_VANTAGE_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
ZERODHA_API_KEY=
```

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Coming Soon:
- Portfolio APIs (7 endpoints)
- Investment APIs (8 endpoints)
- Market Data APIs (7 endpoints)
- AI Analysis APIs (7 endpoints)
- Trading APIs (4 endpoints)
- Transaction APIs (3 endpoints)
- Auto-Invest APIs (6 endpoints)
- Settings APIs (8 endpoints)

**Total Planned:** 50+ endpoints

See `Track/API_CONTRACT.md` for complete API documentation.

---

## 🔄 Development Roadmap

### Phase 1: Foundation ✅ (Week 1-2) - **COMPLETED**
- ✅ Project setup
- ✅ Database schema
- ✅ Express server
- ✅ Authentication system

### Phase 2: Core APIs 🚧 (Week 3-4) - **NEXT**
- Portfolio management
- Investment tracking
- Transaction management

### Phase 3-6: Advanced Features ⏰ (Week 5-12)
- Market data integration
- AI-powered analysis
- Trading execution
- Auto-invest strategies
- Production deployment

See `Track/BACKEND_ROADMAP.md` for detailed roadmap.

---

## 🤝 Frontend Integration

This backend is designed to work with the **Spark Investment Frontend**.

### Integration Documents:
- `Track/API_CONTRACT.md` - Complete API specification
- `Track/FRONTEND_IMPACT.md` - Frontend change tracking
- `Track/COMPATIBILITY.md` - Version compatibility matrix
- `Track/README.md` - Integration workflow guide

### Frontend Configuration:
```env
# In frontend .env
VITE_MOCK_MODE=false
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U postgres -d spark_investment

# Reset database
npm run migrate -- reset
```

### Prisma Issues
```bash
# Regenerate Prisma Client
npm run prisma:generate

# Format schema
npx prisma format

# View migrations
npx prisma migrate status
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

---

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt (10 rounds)
- Helmet.js for security headers
- CORS protection
- Environment variable validation
- SQL injection protection (Prisma ORM)

---

## 📄 License

ISC

---

## 👥 Team

**Backend Team:** Development in progress
**Frontend Team:** Integration ready

---

## 📞 Support

For issues and questions:
- Check `Track/` documentation
- Review API contracts
- Check troubleshooting section

---

## 🎯 Next Steps

1. ✅ ~~Setup project and authentication~~
2. 🔨 Build portfolio APIs
3. 🔨 Build investment APIs
4. ⏰ Integrate market data
5. ⏰ Add AI analysis
6. ⏰ Deploy to production

---

**Last Updated:** 2025-11-13
**Status:** Phase 1 Complete - Ready for Phase 2
**Next Milestone:** Portfolio APIs implementation

🚀 Happy Coding!
