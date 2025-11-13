# Spark Investment AI - API Contract

**Version:** 1.0.0
**Last Updated:** 2025-11-13
**Backend Compatibility:** v1.0.0+
**Frontend Compatibility:** v0.0.0+

---

## 🔗 BASE URL

```
Production:  https://api.sparkinvestment.com/api/v1
Development: http://localhost:5000/api
```

**Environment Variables:**
- `VITE_API_BASE_URL` - API base URL (default: http://localhost:5000/api)
- `VITE_MOCK_MODE` - Enable mock data mode (default: false)
- `VITE_WEBSOCKET_URL` - WebSocket URL for real-time updates

---

## 🔐 AUTHENTICATION

All authenticated endpoints require a Bearer token in the Authorization header:

```http
Authorization: Bearer {token}
```

**Token Storage:** localStorage key `auth_token`

---

## 📊 PORTFOLIO ENDPOINTS

### GET /portfolio/summary
**Description:** Get portfolio summary with total value, returns, allocation

**Frontend Usage:**
```javascript
// File: src/hooks/usePortfolio.js
// Function: portfolioAPI.getSummary()
```

**Request:**
```http
GET /api/portfolio/summary
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalValue": 567890.50,
    "totalInvested": 450000.00,
    "totalReturns": 117890.50,
    "returnsPercentage": 26.20,
    "dayChange": 5420.30,
    "dayChangePercentage": 0.96,
    "lastUpdated": "2025-11-13T10:30:00Z"
  }
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 500: Server Error

**Frontend Impact:**
- ✅ Dashboard.jsx: Shows summary cards
- ✅ PortfolioSummary.jsx: Displays all metrics
- ✅ usePortfolio.js: Fetches and caches data

---

### GET /portfolio/platforms
**Description:** Get all connected investment platforms

**Request:**
```http
GET /api/portfolio/platforms
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "zerodha-001",
      "name": "Zerodha",
      "type": "broker",
      "status": "connected",
      "balance": 125000.50,
      "holdings": 15,
      "lastSync": "2025-11-13T10:25:00Z"
    }
  ]
}
```

**Frontend Impact:**
- ✅ Dashboard.jsx: PlatformCards component
- ✅ Settings.jsx: PlatformConnections section

---

### GET /portfolio/performance
**Description:** Get portfolio performance over time

**Query Parameters:**
- `period` (optional): 1D, 1W, 1M, 3M, 6M, 1Y, ALL (default: 1M)

**Request:**
```http
GET /api/portfolio/performance?period=1M
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "1M",
    "dataPoints": [
      {
        "date": "2025-10-13",
        "value": 450000.00,
        "returns": 0.00
      },
      {
        "date": "2025-11-13",
        "value": 567890.50,
        "returns": 26.20
      }
    ]
  }
}
```

**Frontend Impact:**
- ✅ Dashboard.jsx: PerformanceChart component
- ✅ usePortfolio.js: Fetches chart data

---

### GET /portfolio/allocation
**Description:** Get asset allocation breakdown

**Response:**
```json
{
  "success": true,
  "data": {
    "equity": 65,
    "debt": 20,
    "gold": 10,
    "crypto": 5
  }
}
```

**Frontend Impact:**
- ✅ Dashboard.jsx: Allocation pie chart
- ✅ PortfolioSummary.jsx: Allocation display

---

### GET /portfolio/top-performers
**Description:** Get top performing investments

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "inv-001",
      "symbol": "RELIANCE",
      "name": "Reliance Industries",
      "returns": 45.30,
      "currentValue": 28507.50
    }
  ]
}
```

**Frontend Impact:**
- ✅ Dashboard.jsx: Top performers widget

---

### GET /portfolio/activity
**Description:** Get recent portfolio activity

**Query Parameters:**
- `limit` (optional): Number of activities to return (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "act-001",
      "type": "buy",
      "symbol": "INFY",
      "amount": 15000.00,
      "timestamp": "2025-11-13T09:30:00Z"
    }
  ]
}
```

**Frontend Impact:**
- ✅ Dashboard.jsx: RecentTransactions component

---

### POST /portfolio/connect
**Description:** Connect a new investment platform

**Request:**
```json
{
  "platform": "zerodha",
  "credentials": {
    "apiKey": "xxx",
    "apiSecret": "xxx"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Platform connected successfully",
  "platformId": "zerodha-001"
}
```

**Frontend Impact:**
- ✅ Settings.jsx: PlatformConnections component

---

### DELETE /portfolio/platforms/:platformId
**Description:** Disconnect a platform

**Response:**
```json
{
  "success": true,
  "message": "Platform disconnected"
}
```

---

## 💼 INVESTMENTS ENDPOINTS

### GET /investments
**Description:** Get all investments across all platforms

**Frontend Usage:**
```javascript
// File: src/hooks/useInvestments.js
// Function: investmentsAPI.getAll()
```

**Response:**
```json
{
  "success": true,
  "data": {
    "mutualFunds": [],
    "stocks": [],
    "crypto": []
  }
}
```

**Frontend Impact:**
- ✅ Investments.jsx: Main investment list
- ✅ useInvestments.js: Data fetching

---

### GET /investments/:id
**Description:** Get specific investment details

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "inv-001",
    "symbol": "RELIANCE",
    "name": "Reliance Industries Ltd",
    "type": "equity",
    "platform": "zerodha",
    "quantity": 10,
    "avgPrice": 2450.50,
    "currentPrice": 2850.75,
    "currentValue": 28507.50,
    "investedValue": 24505.00,
    "returns": 4002.50,
    "returnsPercentage": 16.33,
    "status": "active"
  }
}
```

**Frontend Impact:**
- ✅ InvestmentDetailModal.jsx: Shows detailed view

---

### GET /investments/mutual-funds
**Description:** Get only mutual fund investments

**Frontend Impact:**
- ✅ Investments.jsx: Filtered view

---

### GET /investments/stocks
**Description:** Get only stock investments

---

### GET /investments/crypto
**Description:** Get only crypto investments

---

### POST /investments
**Description:** Add new investment manually

**Request:**
```json
{
  "symbol": "INFY",
  "type": "equity",
  "platform": "zerodha",
  "quantity": 20,
  "avgPrice": 1450.00
}
```

**Response:**
```json
{
  "success": true,
  "id": "inv-new-001",
  "message": "Investment added successfully"
}
```

---

### PUT /investments/:id
**Description:** Update investment details

---

### DELETE /investments/:id
**Description:** Delete an investment

---

## 📈 MARKET DATA ENDPOINTS

### GET /market/indices
**Description:** Get major market indices (NIFTY, SENSEX, etc.)

**Frontend Usage:**
```javascript
// File: src/hooks/useMarketData.js
// Function: marketDataAPI.getIndices()
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "NIFTY50",
      "name": "NIFTY 50",
      "value": 19485.50,
      "change": 125.30,
      "changePercent": 0.65
    }
  ]
}
```

**Frontend Impact:**
- ✅ Dashboard.jsx: Market overview
- ✅ LiveTrading.jsx: Market data cards

---

### GET /market/gainers
**Description:** Get top gainers

**Query Parameters:**
- `limit` (optional): Number of stocks (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "TATASTEEL",
      "name": "Tata Steel",
      "price": 125.50,
      "change": 12.50,
      "changePercent": 11.06
    }
  ]
}
```

**Frontend Impact:**
- ✅ Dashboard.jsx: Market movers widget

---

### GET /market/losers
**Description:** Get top losers

---

### GET /market/sectors
**Description:** Get sector-wise performance

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "sector": "IT",
      "change": 2.5,
      "stocks": 150
    }
  ]
}
```

---

### GET /market/quote/:symbol
**Description:** Get real-time quote for a symbol

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "RELIANCE",
    "price": 2850.75,
    "change": 45.25,
    "changePercent": 1.61,
    "volume": 1250000,
    "high": 2875.00,
    "low": 2800.50,
    "open": 2810.00,
    "close": 2805.50,
    "timestamp": "2025-11-13T10:30:00Z"
  }
}
```

**Frontend Impact:**
- ✅ LiveTrading.jsx: Real-time price display
- ✅ TradingPanel.jsx: Quote display

---

### GET /market/crypto
**Description:** Get crypto market data

---

### GET /market/forex
**Description:** Get forex rates

---

## 🤖 AI ANALYSIS ENDPOINTS

### GET /ai/insights
**Description:** Get AI-powered portfolio insights

**Frontend Usage:**
```javascript
// File: src/hooks/useAI.js
// Function: aiAPI.getPortfolioInsights()
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "Your portfolio is well-diversified...",
    "riskLevel": "moderate",
    "suggestions": [
      "Consider rebalancing equity allocation"
    ]
  }
}
```

**Frontend Impact:**
- ✅ AIAnalysis.jsx: Insights panel
- ✅ Dashboard.jsx: AI suggestions widget

---

### GET /ai/recommendations
**Description:** Get AI investment recommendations

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "TCS",
      "name": "Tata Consultancy Services",
      "recommendation": "BUY",
      "confidence": 85,
      "reason": "Strong fundamentals and growth potential"
    }
  ]
}
```

**Frontend Impact:**
- ✅ AIAnalysis.jsx: Recommendations list

---

### GET /ai/risk-analysis
**Description:** Get portfolio risk analysis

**Response:**
```json
{
  "success": true,
  "data": {
    "riskScore": 55,
    "riskLevel": "MEDIUM",
    "volatility": "Moderate",
    "diversification": "Good",
    "recommendations": []
  }
}
```

**Frontend Impact:**
- ✅ AIAnalysis.jsx: Risk meter display

---

### GET /ai/market-sentiment
**Description:** Get overall market sentiment analysis

**Response:**
```json
{
  "success": true,
  "data": {
    "sentiment": "bullish",
    "score": 72,
    "factors": ["Strong GDP growth", "FII inflows"]
  }
}
```

---

### POST /ai/chat
**Description:** Chat with AI assistant

**Request:**
```json
{
  "message": "Should I invest in tech stocks?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "AI Response...",
    "timestamp": "2025-11-13T10:30:00Z",
    "suggestions": ["Learn more about IT sector"]
  }
}
```

**Frontend Impact:**
- ✅ AIAssistant.jsx: Chat interface

---

### GET /ai/quick-insights
**Description:** Get quick actionable insights

---

### GET /ai/investments/:investmentId/analysis
**Description:** Get AI analysis for specific investment

**Response:**
```json
{
  "success": true,
  "data": {
    "investmentId": "inv-001",
    "recommendation": "HOLD",
    "confidence": 75,
    "riskLevel": "MEDIUM",
    "riskScore": 55,
    "volatility": "Moderate",
    "healthScore": 70,
    "healthGrade": "B",
    "valuation": "Fair Value",
    "pros": ["Strong revenue growth", "Market leader"],
    "cons": ["High PE ratio", "Competition increasing"],
    "aiExplanation": "Detailed analysis..."
  }
}
```

**Frontend Impact:**
- ✅ AIAnalysis.jsx: Investment-specific analysis
- ✅ InvestmentDetailModal.jsx: Shows AI insights

---

## 💹 TRADING ENDPOINTS

### POST /trading/execute
**Description:** Execute a trade order

**Frontend Usage:**
```javascript
// File: src/hooks/useTrading.js
// Function: tradingAPI.executeTrade()
```

**Request:**
```json
{
  "symbol": "INFY",
  "type": "buy",
  "quantity": 10,
  "price": 1450.00,
  "platform": "zerodha",
  "orderType": "market"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "ORD1699878600000",
    "status": "pending",
    "message": "Trade order placed successfully"
  }
}
```

**Frontend Impact:**
- ✅ TradingPanel.jsx: Order execution
- ✅ LiveTrading.jsx: Trade placement

---

### GET /trading/history
**Description:** Get trade history

**Query Parameters:**
- `limit` (optional): Number of trades (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "trade-001",
      "symbol": "INFY",
      "type": "buy",
      "quantity": 10,
      "price": 1450.00,
      "total": 14500.00,
      "timestamp": "2025-11-13T09:30:00Z",
      "status": "completed"
    }
  ]
}
```

**Frontend Impact:**
- ✅ Transactions.jsx: Trade history view

---

### GET /trading/pending
**Description:** Get pending orders

---

### DELETE /trading/orders/:orderId
**Description:** Cancel a pending order

---

## 💳 TRANSACTIONS ENDPOINTS

### GET /transactions
**Description:** Get all transactions with filters

**Frontend Usage:**
```javascript
// File: src/hooks/useTransactions.js
// Function: transactionsAPI.getAll()
```

**Query Parameters:**
- `type` (optional): buy, sell, dividend, etc.
- `platform` (optional): Filter by platform
- `startDate` (optional): Start date filter
- `endDate` (optional): End date filter

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "txn-001",
      "type": "buy",
      "symbol": "INFY",
      "amount": 14500.00,
      "date": "2025-11-13",
      "platform": "zerodha",
      "status": "completed"
    }
  ]
}
```

**Frontend Impact:**
- ✅ Transactions.jsx: Transaction list
- ✅ TransactionTable.jsx: Table display

---

### GET /transactions/summary
**Description:** Get transaction summary and statistics

**Query Parameters:**
- `period` (optional): 1D, 1W, 1M, 3M, 6M, 1Y (default: 1M)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBuy": 150000.00,
    "totalSell": 50000.00,
    "netInvested": 100000.00,
    "transactionCount": 25
  }
}
```

**Frontend Impact:**
- ✅ Transactions.jsx: Summary cards

---

### GET /transactions/export
**Description:** Export transactions to file

**Query Parameters:**
- `format`: csv, pdf, excel
- All filter parameters from GET /transactions

**Response:**
```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://...",
    "message": "Export ready"
  }
}
```

**Frontend Impact:**
- ✅ Transactions.jsx: Export button

---

## 🔄 AUTO-INVEST ENDPOINTS

### GET /auto-invest/strategies
**Description:** Get all auto-invest strategies

**Frontend Usage:**
```javascript
// File: src/hooks/useAutoInvest.js
// Function: autoInvestAPI.getStrategies()
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "strat-001",
      "name": "Balanced Growth SIP",
      "type": "sip",
      "amount": 10000,
      "frequency": "monthly",
      "status": "active",
      "returns": 12.5
    }
  ]
}
```

**Frontend Impact:**
- ✅ AutoInvest.jsx: Strategy list
- ✅ InvestmentPlanCard.jsx: Strategy cards

---

### POST /auto-invest/strategies
**Description:** Create new auto-invest strategy

**Request:**
```json
{
  "name": "Tech SIP",
  "type": "sip",
  "amount": 5000,
  "frequency": "monthly",
  "funds": ["FUND001", "FUND002"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "STRAT1699878600000",
    "message": "Strategy created successfully"
  }
}
```

---

### PUT /auto-invest/strategies/:id
**Description:** Update strategy

---

### DELETE /auto-invest/strategies/:id
**Description:** Delete strategy

---

### GET /auto-invest/backtest/:strategyId
**Description:** Get backtest results for strategy

**Response:**
```json
{
  "success": true,
  "data": {
    "strategyId": "strat-001",
    "period": "5Y",
    "totalReturns": 65.5,
    "annualizedReturns": 12.5,
    "maxDrawdown": -15.2,
    "sharpeRatio": 1.8
  }
}
```

**Frontend Impact:**
- ✅ AutoInvest.jsx: Backtest results display
- ✅ BacktestResults.jsx: Detailed backtest view

---

### GET /auto-invest/sip-recommendations
**Description:** Get AI-powered SIP recommendations

---

## ⚙️ SETTINGS ENDPOINTS

### GET /settings/profile
**Description:** Get user profile

**Frontend Usage:**
```javascript
// File: src/hooks/useSettings.js
// Function: settingsAPI.getProfile()
```

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91-9876543210",
    "pan": "ABCDE1234F",
    "riskProfile": "moderate"
  }
}
```

**Frontend Impact:**
- ✅ Settings.jsx: ProfileSettings component

---

### PUT /settings/profile
**Description:** Update user profile

---

### GET /settings/preferences
**Description:** Get user preferences

**Response:**
```json
{
  "success": true,
  "data": {
    "currency": "INR",
    "language": "en",
    "timezone": "Asia/Kolkata",
    "emailNotifications": true,
    "pushNotifications": false
  }
}
```

**Frontend Impact:**
- ✅ Settings.jsx: PreferenceSettings component

---

### PUT /settings/preferences
**Description:** Update preferences

---

### GET /settings/accounts
**Description:** Get connected accounts/platforms

**Frontend Impact:**
- ✅ Settings.jsx: PlatformConnections component

---

### GET /settings/notifications
**Description:** Get notification settings

**Frontend Impact:**
- ✅ Settings.jsx: NotificationSettings component

---

### PUT /settings/notifications
**Description:** Update notification settings

---

## 🎯 FUTURE ENDPOINTS (Planned)

### F&O OPTIONS TRADING (v1.1.0)

#### GET /fo/option-chain/:symbol
**Status:** 🚧 Planned for v1.1.0
**Description:** Get complete option chain with Greeks

**Response:**
```json
{
  "success": true,
  "data": {
    "underlyingSymbol": "NIFTY",
    "underlyingPrice": 19485.50,
    "expiry": "2025-11-28",
    "strikes": [
      {
        "strike": 19500,
        "call": {
          "premium": 150.25,
          "greeks": {
            "delta": 0.52,
            "gamma": 0.008,
            "theta": -5.2,
            "vega": 12.5
          },
          "iv": 18.5,
          "oi": 125000,
          "volume": 45000
        },
        "put": {}
      }
    ],
    "pcr": 1.30,
    "maxPain": 19400
  }
}
```

**Frontend Impact:** 🚨 REQUIRES NEW IMPLEMENTATION
- Need to create: `/src/pages/OptionsTrading.jsx`
- Need to create: `/src/hooks/useOptionChain.js`
- Need to update: `/src/App.jsx` (add /options route)
- Need to update: `/src/components/layout/Navbar.jsx` (add Options link)

---

#### POST /fo/execute-option
**Status:** 🚧 Planned for v1.1.0
**Description:** Place option order

---

#### GET /fo/option-positions
**Status:** 🚧 Planned for v1.1.0
**Description:** Get current option positions

---

## 📝 CHANGELOG

### Version 1.0.0 (Current)
**Release Date:** 2025-11-13

**Status:** ✅ All endpoints functional with MOCK_MODE support

**Endpoints:**
- ✅ All portfolio endpoints (7 endpoints)
- ✅ All investment endpoints (8 endpoints)
- ✅ All market data endpoints (7 endpoints)
- ✅ All AI analysis endpoints (7 endpoints)
- ✅ All trading endpoints (4 endpoints)
- ✅ All transaction endpoints (3 endpoints)
- ✅ All auto-invest endpoints (6 endpoints)
- ✅ All settings endpoints (8 endpoints)

**Frontend Status:** ✅ Fully implemented

**Breaking Changes:** None (Initial release)

---

### Version 1.1.0 (Planned)
**Release Date:** TBD

**New Features:**
- 🚧 F&O Options Trading
- 🚧 Advanced charting with indicators
- 🚧 Social trading features

**New Endpoints:**
- GET /fo/option-chain/:symbol
- POST /fo/execute-option
- GET /fo/option-positions

**Frontend Impact:** 🚨 MODERATE TO HIGH
- Need to create new OptionsTrading page
- Need to create option chain components
- Need to add Greeks calculations
- Estimated: 8-10 hours frontend work

**Breaking Changes:** None (Backward compatible)

---

## 🔄 BREAKING CHANGES POLICY

### What constitutes a breaking change:
❌ Renaming existing fields
❌ Changing data types
❌ Removing endpoints
❌ Changing authentication mechanism

### What is backward compatible:
✅ Adding new fields to responses
✅ Adding new optional query parameters
✅ Adding new endpoints
✅ Adding new values to enum fields

---

## 📚 NOTES

### Response Format
All API responses follow this structure:
```json
{
  "success": true/false,
  "data": {},
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

### Error Handling
Common error codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

### Rate Limiting
- Not yet implemented
- Planned for v1.2.0

### WebSocket Support
Real-time updates available via WebSocket for:
- Market data updates
- Portfolio value changes
- Order status updates
- Trade executions

---

**Last Updated:** 2025-11-13
**Maintained By:** Backend & Frontend Teams
**Questions?** Check `/docs` folder for more documentation
