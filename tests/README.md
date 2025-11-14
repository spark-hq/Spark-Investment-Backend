# Testing Guide

## Overview

This project uses **Jest** and **Supertest** for testing the API endpoints.

## Prerequisites

⚠️ **Database Required**: Tests require a running PostgreSQL database as they are **integration tests** that test the full stack including database operations.

### Setup Test Database

1. **Create test database:**
   ```bash
   psql -U postgres
   CREATE DATABASE spark_investment_test;
   \q
   ```

2. **Configure test environment:**
   ```bash
   # Create .env.test file
   cp .env .env.test

   # Update DATABASE_URL in .env.test
   DATABASE_URL="postgresql://postgres:password@localhost:5432/spark_investment_test"
   ```

3. **Run migrations on test database:**
   ```bash
   DATABASE_URL="postgresql://postgres:password@localhost:5432/spark_investment_test" npm run migrate
   ```

## Running Tests

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test tests/auth.test.js
```

## Test Structure

```
tests/
├── README.md              # This file
├── helpers/
│   └── testSetup.js      # Test utilities and helpers
└── auth.test.js          # Authentication endpoint tests
```

## Available Tests

### Authentication Tests (`tests/auth.test.js`)

- **POST /api/auth/signup**
  - ✅ Create user with valid data
  - ✅ Reject missing fields
  - ✅ Reject duplicate emails
  - ✅ Accept optional phone field

- **POST /api/auth/login**
  - ✅ Login with valid credentials
  - ✅ Reject invalid email
  - ✅ Reject invalid password
  - ✅ Reject missing fields

- **GET /api/auth/me**
  - ✅ Return user with valid token
  - ✅ Reject missing token
  - ✅ Reject invalid token
  - ✅ Reject malformed auth header

- **GET /api/health**
  - ✅ Return health status

## Test Utilities

### `tests/helpers/testSetup.js`

Provides helper functions for tests:

- `cleanDatabase()` - Clears all test data
- `createTestUser(userData)` - Creates a test user
- `createTestPlatform(userId, platformData)` - Creates a test platform
- `disconnectPrisma()` - Closes database connection

### Usage Example

```javascript
import { cleanDatabase, createTestUser } from './helpers/testSetup.js';

describe('My Test Suite', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it('should test something', async () => {
    const user = await createTestUser({
      email: 'test@example.com',
      password: 'Test123!'
    });

    // Your test code here
  });
});
```

## Current Status

✅ **Jest configured** with ES module support
✅ **Test helpers** created
✅ **Auth tests** written (18 test cases)
⚠️ **Database setup** required to run tests

## Troubleshooting

### "Cannot find module" errors
- Ensure you're using Node.js v18+ with ES module support
- Check that `"type": "module"` is in package.json

### "Database connection failed"
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env.test
- Run migrations on test database

### "Tests timeout"
- Increase timeout in jest.config.js
- Check database performance
- Ensure Prisma Client is generated: `npm run prisma:generate`

## Writing New Tests

1. Create test file in `tests/` directory
2. Import required dependencies:
   ```javascript
   import request from 'supertest';
   import app from '../src/app.js';
   import { cleanDatabase, disconnectPrisma } from './helpers/testSetup.js';
   ```

3. Structure your tests:
   ```javascript
   describe('Feature Name', () => {
     beforeEach(async () => {
       await cleanDatabase();
     });

     afterAll(async () => {
       await disconnectPrisma();
     });

     it('should do something', async () => {
       const res = await request(app)
         .get('/api/endpoint')
         .expect(200);

       expect(res.body.success).toBe(true);
     });
   });
   ```

## Coverage Goals

Target coverage thresholds:
- Branches: 50%
- Functions: 50%
- Lines: 50%
- Statements: 50%

View coverage report after running tests:
```bash
open coverage/lcov-report/index.html
```

---

**Note:** Tests are integration tests that validate the entire request/response cycle including database operations. For unit testing of individual functions, consider creating separate unit test files with mocked dependencies.
