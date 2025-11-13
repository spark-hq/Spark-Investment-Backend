# Frontend Impact Checklist

**Purpose:** Backend developers fill this out when making API changes to help frontend developers understand required changes.

---

## 📝 HOW TO USE THIS DOCUMENT

### For Backend Developers:
1. **Before making changes:** Copy the template below
2. **Fill out all sections** with your planned/completed changes
3. **Add to this file** under "Change History" section
4. **Notify frontend team** via Slack/Discord
5. **Update API_CONTRACT.md** with new endpoints

### For Frontend Developers:
1. **Review this file regularly** (daily recommended)
2. **Read new entries** in Change History section
3. **Estimate work** required for frontend changes
4. **Update COMPATIBILITY.md** if version changes needed
5. **Mark as complete** when frontend changes deployed

---

## 📋 CHANGE TEMPLATE

Copy this template for each backend change:

```markdown
## Change: [Brief Title]
**Date:** YYYY-MM-DD
**Backend PR:** #[PR Number]
**Backend Version:** v[version]
**Status:** 🚧 Planned / 🔨 In Progress / ✅ Deployed

### Backend Changes Summary:
[Brief description of what changed in the backend]

### New Endpoints Added:
- ✅ [METHOD] /api/v1/[endpoint] - [Description]
- ✅ [METHOD] /api/v1/[endpoint] - [Description]

### Modified Endpoints:
- ⚠️ [METHOD] /api/v1/[endpoint] - [What changed]

### Deprecated Endpoints:
- ❌ [METHOD] /api/v1/[endpoint] - [Reason & timeline]

### Removed Endpoints:
- 🗑️ [METHOD] /api/v1/[endpoint] - [Migration path]

---

### Frontend Changes Required:

#### 1. Create New Files (if applicable)
- [ ] `/src/pages/[PageName].jsx` - [Description]
- [ ] `/src/hooks/use[HookName].js` - [Description]
- [ ] `/src/components/[folder]/[ComponentName].jsx` - [Description]

#### 2. Modify Existing Files (if applicable)
- [ ] `/src/services/api.js` - [What to add/modify]
- [ ] `/src/App.jsx` - [What to add/modify]
- [ ] `/src/components/layout/Navbar.jsx` - [What to add/modify]
- [ ] `/src/[other-file]` - [What to add/modify]

#### 3. Environment Variables (if applicable)
- [ ] Add `[VARIABLE_NAME]=[value]` to `.env`
- [ ] Add `[VARIABLE_NAME]=[value]` to `.env.example`

#### 4. Dependencies (if applicable)
- [ ] Install: `npm install [package-name]` - [Why needed]
- [ ] Remove: `npm uninstall [package-name]` - [Why removing]

#### 5. Database/State Changes (if applicable)
- [ ] Update Zustand store in `/src/store/[storeName].js`
- [ ] Add new React Query keys
- [ ] Update localStorage schema

---

### Example Code for Frontend:

**API Service Update (`/src/services/api.js`):**
```javascript
// Add this code block
export const [apiName]API = {
  [methodName]: (params) =>
    apiClient.get(`/[endpoint]`, { params }),
};
```

**Hook Creation (`/src/hooks/use[Name].js`):**
```javascript
// Create this new file
import { useQuery } from '@tanstack/react-query';
import { [apiName]API } from '../services/api';

export const use[Name] = (params) => {
  return useQuery(
    ['[queryKey]', params],
    () => [apiName]API.[methodName](params),
    {
      staleTime: 60000, // Adjust as needed
      refetchInterval: 60000 // If real-time updates needed
    }
  );
};
```

**Component Usage Example:**
```javascript
// How to use in components
const { data, isLoading, error } = use[Name](params);

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;

return (
  <div>
    {/* Use data here */}
  </div>
);
```

---

### API Contract Examples:

**Request Example:**
```http
[METHOD] /api/v1/[endpoint]
Authorization: Bearer {token}
Content-Type: application/json

{
  "param1": "value1",
  "param2": "value2"
}
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "field1": "value1",
    "field2": 123
  }
}
```

**Error Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

---

### Testing Checklist:
- [ ] API endpoint works in Postman/Thunder Client
- [ ] Response matches documented schema
- [ ] Error handling works correctly
- [ ] Authentication/Authorization tested
- [ ] Rate limiting tested (if applicable)
- [ ] Frontend can consume API successfully
- [ ] UI updates correctly with new data
- [ ] Error states display properly

---

### Estimated Frontend Work:
**Time:** [X hours/days]
**Complexity:** Low / Medium / High / Very High
**Priority:** Low / Medium / High / Critical

**Breakdown:**
- API Integration: [X hours]
- UI Components: [X hours]
- State Management: [X hours]
- Testing: [X hours]
- Documentation: [X hours]

---

### Breaking Changes: [Yes / No]

**If Yes, describe:**
- What breaks: [Description]
- Migration path: [How to fix]
- Backward compatibility: [If maintained]

**Migration Guide:**
```
Old Code:
[Show old code]

New Code:
[Show new code]
```

---

### Dependencies on Other Changes:
- [ ] Requires backend change #[PR] to be deployed first
- [ ] Requires frontend change #[PR] to be completed first
- [ ] No dependencies ✅

---

### Rollback Plan:
If this change causes issues:
1. [Step to rollback backend]
2. [Step to rollback frontend]
3. [Step to restore compatibility]

---

### Frontend Implementation Status:
- [ ] 📋 Reviewed by frontend team
- [ ] 🔨 Implementation started
- [ ] 🧪 Testing in progress
- [ ] ✅ Deployed to production
- [ ] 📝 Documentation updated

**Assigned To:** [Frontend Developer Name]
**Target Completion:** [Date]

```

---

## 🔔 CHANGE HISTORY

### Latest changes appear at the top ⬇️

---

## Change: F&O Option Chain API (EXAMPLE)
**Date:** 2025-11-13 *(Example - not yet implemented)*
**Backend PR:** #[TBD]
**Backend Version:** v1.1.0
**Status:** 🚧 Planned

### Backend Changes Summary:
Adding F&O (Futures & Options) trading capability. New endpoints for option chain data, Greeks calculations, and option order execution.

### New Endpoints Added:
- ✅ GET /api/v1/fo/option-chain/:symbol - Get complete option chain with Greeks
- ✅ POST /api/v1/fo/execute-option - Place option order (call/put)
- ✅ GET /api/v1/fo/option-positions - Get current option positions
- ✅ GET /api/v1/fo/greeks/:symbol - Get detailed Greeks for a symbol
- ✅ GET /api/v1/fo/max-pain/:symbol - Get max pain analysis

### Modified Endpoints:
None

### Deprecated Endpoints:
None

### Removed Endpoints:
None

---

### Frontend Changes Required:

#### 1. Create New Files
- [ ] `/src/pages/OptionsTrading.jsx` - Main F&O trading page
- [ ] `/src/hooks/useOptionChain.js` - Hook for fetching option chain data
- [ ] `/src/hooks/useOptionOrder.js` - Hook for placing option orders
- [ ] `/src/components/options/OptionChainTable.jsx` - Display option chain table
- [ ] `/src/components/options/GreeksDisplay.jsx` - Display Greeks (Delta, Gamma, Theta, Vega)
- [ ] `/src/components/options/StrikePriceSelector.jsx` - Strike price selection UI
- [ ] `/src/components/options/OptionOrderPanel.jsx` - Order placement panel
- [ ] `/src/components/options/MaxPainChart.jsx` - Max pain visualization

#### 2. Modify Existing Files
- [ ] `/src/services/api.js` - Add optionChainAPI section with all F&O endpoints
- [ ] `/src/App.jsx` - Add `/options` route
- [ ] `/src/components/layout/Navbar.jsx` - Add "Options" navigation link
- [ ] `/src/pages/LiveTrading.jsx` - Add link to options page

#### 3. Environment Variables
- [ ] Add `VITE_ENABLE_OPTIONS_TRADING=true` to `.env`
- [ ] Add `VITE_OPTIONS_REFRESH_INTERVAL=60000` to `.env` (refresh every 60s)

#### 4. Dependencies
- [ ] No new npm packages needed ✅

#### 5. Database/State Changes
- [ ] Add option positions to Zustand store
- [ ] Add React Query cache for option chain data

---

### Example Code for Frontend:

**API Service Update (`/src/services/api.js`):**
```javascript
// Add this to api.js
export const optionChainAPI = {
  getChain: (symbol, expiry) =>
    apiClient.get(`/fo/option-chain/${symbol}`, { params: { expiry } }),

  executeOption: (orderData) =>
    apiClient.post('/fo/execute-option', orderData),

  getPositions: () =>
    apiClient.get('/fo/option-positions'),

  getGreeks: (symbol) =>
    apiClient.get(`/fo/greeks/${symbol}`),

  getMaxPain: (symbol, expiry) =>
    apiClient.get(`/fo/max-pain/${symbol}`, { params: { expiry } })
};
```

**Hook Creation (`/src/hooks/useOptionChain.js`):**
```javascript
import { useQuery } from '@tanstack/react-query';
import { optionChainAPI } from '../services/api';

export const useOptionChain = (symbol, expiry) => {
  return useQuery(
    ['optionChain', symbol, expiry],
    () => optionChainAPI.getChain(symbol, expiry),
    {
      enabled: !!symbol && !!expiry,
      staleTime: 60000, // 1 minute
      refetchInterval: 60000 // Auto-refresh every minute
    }
  );
};

export const useOptionOrder = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (orderData) => optionChainAPI.executeOption(orderData),
    {
      onSuccess: () => {
        // Invalidate positions to refetch
        queryClient.invalidateQueries(['optionPositions']);
      }
    }
  );
};
```

**Component Usage Example:**
```javascript
// In OptionsTrading.jsx
const OptionsTrading = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('NIFTY');
  const [selectedExpiry, setSelectedExpiry] = useState('2025-11-28');

  const { data: optionChain, isLoading } = useOptionChain(
    selectedSymbol,
    selectedExpiry
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="options-trading">
      <h1>F&O Options Trading</h1>
      <OptionChainTable data={optionChain} />
      <GreeksDisplay data={optionChain} />
      <OptionOrderPanel symbol={selectedSymbol} />
    </div>
  );
};
```

---

### API Contract Examples:

**Request Example:**
```http
GET /api/v1/fo/option-chain/NIFTY?expiry=2025-11-28
Authorization: Bearer {token}
```

**Response Example:**
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
        "put": {
          "premium": 120.50,
          "greeks": {
            "delta": -0.48,
            "gamma": 0.008,
            "theta": -4.8,
            "vega": 12.5
          },
          "iv": 17.8,
          "oi": 165000,
          "volume": 52000
        }
      }
    ],
    "pcr": 1.30,
    "maxPain": 19400
  }
}
```

**Order Request Example:**
```http
POST /api/v1/fo/execute-option
Authorization: Bearer {token}
Content-Type: application/json

{
  "symbol": "NIFTY",
  "expiry": "2025-11-28",
  "strike": 19500,
  "optionType": "call",
  "action": "buy",
  "quantity": 50,
  "orderType": "market"
}
```

---

### Testing Checklist:
- [ ] Option chain API returns correct data
- [ ] Greeks calculations are accurate
- [ ] Max pain calculation is correct
- [ ] Order placement works for both calls and puts
- [ ] Real-time updates work correctly
- [ ] PCR (Put-Call Ratio) displayed correctly
- [ ] Error handling for invalid strikes/expiries
- [ ] Mobile responsive design tested

---

### Estimated Frontend Work:
**Time:** 8-10 hours
**Complexity:** High
**Priority:** High (Major feature)

**Breakdown:**
- API Integration: 2 hours
- UI Components: 4 hours
- State Management: 1 hour
- Testing: 2 hours
- Documentation: 1 hour

---

### Breaking Changes: No ✅

This is a new feature. Existing functionality is unaffected.

---

### Migration Guide:
Not applicable - new feature only.

---

### Dependencies on Other Changes:
- [ ] No dependencies ✅

---

### Rollback Plan:
If this change causes issues:
1. Backend: Remove F&O endpoints from routing
2. Frontend: Remove `/options` route from App.jsx
3. Set `VITE_ENABLE_OPTIONS_TRADING=false` in environment

---

### Frontend Implementation Status:
- [ ] 📋 Reviewed by frontend team
- [ ] 🔨 Implementation started
- [ ] 🧪 Testing in progress
- [ ] ✅ Deployed to production
- [ ] 📝 Documentation updated

**Assigned To:** [Frontend Developer]
**Target Completion:** [Date]

---

## Change: Initial API Setup (Current)
**Date:** 2025-11-13
**Backend PR:** N/A (Initial setup)
**Backend Version:** v1.0.0
**Status:** 🚧 Planned

### Backend Changes Summary:
Initial backend API setup with all core endpoints for portfolio, investments, market data, AI analysis, trading, transactions, auto-invest, and settings.

### New Endpoints Added:
All endpoints documented in API_CONTRACT.md

### Frontend Changes Required:
None - Frontend already built with MOCK_MODE to match this API contract.

### Frontend Implementation Status:
- [x] ✅ Frontend built and ready
- [x] ✅ MOCK_MODE implemented
- [ ] 🔨 Waiting for backend deployment
- [ ] 🧪 Integration testing pending
- [ ] ⏰ Production deployment pending

**Status:** Frontend is ready. Waiting for backend v1.0.0 to be deployed.

---

## 📚 ADDITIONAL RESOURCES

### Related Documents:
- **API_CONTRACT.md** - Full API documentation
- **COMPATIBILITY.md** - Version compatibility matrix
- **README.md** - Project overview
- **/docs/API_SPECIFICATION.md** - Detailed API specs
- **/docs/DATABASE_SCHEMA.md** - Database structure

### Communication Channels:
- Slack: #backend-frontend-integration
- Discord: #api-changes
- Weekly Sync: Every Monday 10 AM

### Useful Tools:
- **Postman Collection:** [Link to shared collection]
- **Swagger/OpenAPI Docs:** [Link when available]
- **API Monitoring:** [Link to monitoring dashboard]

---

## 🎯 BEST PRACTICES

### For Backend Developers:
1. ✅ **Document before implementing** - Fill this out during planning phase
2. ✅ **Use semantic versioning** - Follow MAJOR.MINOR.PATCH
3. ✅ **Provide examples** - Always include request/response examples
4. ✅ **Consider backward compatibility** - Avoid breaking changes when possible
5. ✅ **Test thoroughly** - Test all endpoints before notifying frontend
6. ✅ **Update API_CONTRACT.md** - Keep it in sync with actual implementation

### For Frontend Developers:
1. ✅ **Check daily** - Review this file every day for updates
2. ✅ **Estimate accurately** - Provide realistic time estimates
3. ✅ **Test with real API** - Don't rely only on mock data
4. ✅ **Handle errors gracefully** - Expect and handle API errors
5. ✅ **Update status** - Keep implementation status current
6. ✅ **Report issues** - Document any API contract mismatches

---

**Last Updated:** 2025-11-13
**Maintained By:** Backend & Frontend Teams
**Review Frequency:** Daily during active development
