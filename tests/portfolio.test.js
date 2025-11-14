import request from 'supertest';
import app from '../src/app.js';
import { cleanDatabase, createTestUser, createTestPlatform, disconnectPrisma, prisma } from './helpers/testSetup.js';

describe('Portfolio API Tests', () => {
  let authToken;
  let testUser;

  // Setup: Create user and get auth token before each test
  beforeEach(async () => {
    await cleanDatabase();

    // Create test user
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'portfolio@example.com',
        password: 'Test123!',
        name: 'Portfolio User'
      });

    authToken = signupRes.body.data.token;
    testUser = signupRes.body.data.user;
  });

  // Cleanup after all tests
  afterAll(async () => {
    await disconnectPrisma();
  });

  describe('GET /api/portfolio/summary', () => {
    it('should return zero values for user with no platforms', async () => {
      const res = await request(app)
        .get('/api/portfolio/summary')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.totalValue).toBe(0);
      expect(res.body.data.totalInvested).toBe(0);
      expect(res.body.data.totalReturns).toBe(0);
      expect(res.body.data.returnsPercentage).toBe(0);
    });

    it('should return portfolio summary with investments', async () => {
      // Create platform with investments
      const platform = await prisma.platform.create({
        data: {
          userId: testUser.id,
          name: 'zerodha',
          type: 'broker',
          status: 'connected'
        }
      });

      await prisma.investment.create({
        data: {
          platformId: platform.id,
          symbol: 'RELIANCE',
          name: 'Reliance Industries',
          type: 'equity',
          quantity: 10,
          avgPrice: 2500,
          investedValue: 25000,
          currentPrice: 2850.75,
          currentValue: 28507.50,
          returns: 3507.50,
          returnsPercent: 14.03
        }
      });

      const res = await request(app)
        .get('/api/portfolio/summary')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalInvested).toBeGreaterThan(0);
      expect(res.body.data.totalValue).toBeGreaterThan(0);
      expect(res.body.data.lastUpdated).toBeDefined();
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .get('/api/portfolio/summary');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/portfolio/platforms', () => {
    it('should return empty array for user with no platforms', async () => {
      const res = await request(app)
        .get('/api/portfolio/platforms')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    it('should return list of connected platforms', async () => {
      // Create multiple platforms
      await prisma.platform.create({
        data: {
          userId: testUser.id,
          name: 'zerodha',
          type: 'broker',
          status: 'connected',
          balance: 10000
        }
      });

      await prisma.platform.create({
        data: {
          userId: testUser.id,
          name: 'groww',
          type: 'broker',
          status: 'connected',
          balance: 5000
        }
      });

      const res = await request(app)
        .get('/api/portfolio/platforms')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0]).toHaveProperty('id');
      expect(res.body.data[0]).toHaveProperty('name');
      expect(res.body.data[0]).toHaveProperty('type');
      expect(res.body.data[0]).toHaveProperty('status');
      expect(res.body.data[0]).toHaveProperty('balance');
      expect(res.body.data[0]).toHaveProperty('holdings');
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .get('/api/portfolio/platforms');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/portfolio/performance', () => {
    it('should return empty data for user with no investments', async () => {
      const res = await request(app)
        .get('/api/portfolio/performance')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.period).toBe('1M');
      expect(res.body.data.dataPoints).toEqual([]);
    });

    it('should accept period parameter', async () => {
      const periods = ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'];

      for (const period of periods) {
        const res = await request(app)
          .get(`/api/portfolio/performance?period=${period}`)
          .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.period).toBe(period);
      }
    });

    it('should reject invalid period', async () => {
      const res = await request(app)
        .get('/api/portfolio/performance?period=INVALID')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .get('/api/portfolio/performance');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/portfolio/allocation', () => {
    it('should return zero allocation for user with no investments', async () => {
      const res = await request(app)
        .get('/api/portfolio/allocation')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual({
        equity: 0,
        debt: 0,
        gold: 0,
        crypto: 0
      });
    });

    it('should return allocation breakdown with investments', async () => {
      const platform = await prisma.platform.create({
        data: {
          userId: testUser.id,
          name: 'zerodha',
          type: 'broker',
          status: 'connected'
        }
      });

      // Create investments of different types
      await prisma.investment.createMany({
        data: [
          {
            platformId: platform.id,
            symbol: 'RELIANCE',
            name: 'Reliance Industries',
            type: 'equity',
            quantity: 10,
            avgPrice: 2500,
            investedValue: 25000,
            currentValue: 28000
          },
          {
            platformId: platform.id,
            symbol: 'BTC',
            name: 'Bitcoin',
            type: 'crypto',
            quantity: 0.01,
            avgPrice: 3000000,
            investedValue: 30000,
            currentValue: 35000
          }
        ]
      });

      const res = await request(app)
        .get('/api/portfolio/allocation')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.equity).toBeGreaterThan(0);
      expect(res.body.data.crypto).toBeGreaterThan(0);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .get('/api/portfolio/allocation');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/portfolio/top-performers', () => {
    it('should return empty array for user with no investments', async () => {
      const res = await request(app)
        .get('/api/portfolio/top-performers')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    it('should return top performing investments', async () => {
      const platform = await prisma.platform.create({
        data: {
          userId: testUser.id,
          name: 'zerodha',
          type: 'broker',
          status: 'connected'
        }
      });

      // Create investments with different returns
      await prisma.investment.createMany({
        data: [
          {
            platformId: platform.id,
            symbol: 'INFY',
            name: 'Infosys',
            type: 'equity',
            quantity: 10,
            avgPrice: 1000,
            investedValue: 10000,
            currentValue: 14000,
            returnsPercent: 40
          },
          {
            platformId: platform.id,
            symbol: 'TCS',
            name: 'TCS',
            type: 'equity',
            quantity: 5,
            avgPrice: 3000,
            investedValue: 15000,
            currentValue: 17500,
            returnsPercent: 16.67
          }
        ]
      });

      const res = await request(app)
        .get('/api/portfolio/top-performers')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
      // Should be sorted by returns (highest first)
      if (res.body.data.length > 1) {
        expect(res.body.data[0].returns).toBeGreaterThanOrEqual(res.body.data[1].returns);
      }
    });

    it('should respect limit parameter', async () => {
      const res = await request(app)
        .get('/api/portfolio/top-performers?limit=3')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeLessThanOrEqual(3);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .get('/api/portfolio/top-performers');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/portfolio/activity', () => {
    it('should return empty array for user with no transactions', async () => {
      const res = await request(app)
        .get('/api/portfolio/activity')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    it('should return recent transactions', async () => {
      // Create transactions
      await prisma.transaction.createMany({
        data: [
          {
            userId: testUser.id,
            type: 'buy',
            symbol: 'RELIANCE',
            quantity: 10,
            price: 2500,
            amount: 25000,
            platform: 'zerodha'
          },
          {
            userId: testUser.id,
            type: 'sell',
            symbol: 'INFY',
            quantity: 5,
            price: 1450,
            amount: 7250,
            platform: 'zerodha'
          }
        ]
      });

      const res = await request(app)
        .get('/api/portfolio/activity')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0]).toHaveProperty('id');
      expect(res.body.data[0]).toHaveProperty('type');
      expect(res.body.data[0]).toHaveProperty('symbol');
      expect(res.body.data[0]).toHaveProperty('amount');
    });

    it('should respect limit parameter', async () => {
      const res = await request(app)
        .get('/api/portfolio/activity?limit=5')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeLessThanOrEqual(5);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .get('/api/portfolio/activity');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/portfolio/connect', () => {
    it('should connect platform without credentials (manual)', async () => {
      const res = await request(app)
        .post('/api/portfolio/connect')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          platform: 'manual'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Platform connected successfully');
      expect(res.body.platformId).toBeDefined();
    });

    it('should connect platform with credentials', async () => {
      const res = await request(app)
        .post('/api/portfolio/connect')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          platform: 'zerodha',
          credentials: {
            apiKey: 'test-api-key',
            apiSecret: 'test-api-secret'
          }
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.platformId).toBeDefined();
    });

    it('should reject platform without required credentials', async () => {
      const res = await request(app)
        .post('/api/portfolio/connect')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          platform: 'zerodha'
          // Missing credentials
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject duplicate platform connection', async () => {
      // Connect first time
      await request(app)
        .post('/api/portfolio/connect')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          platform: 'manual'
        });

      // Try to connect again
      const res = await request(app)
        .post('/api/portfolio/connect')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          platform: 'manual'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('already connected');
    });

    it('should reject invalid platform name', async () => {
      const res = await request(app)
        .post('/api/portfolio/connect')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          platform: 'invalid-platform'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject request without platform name', async () => {
      const res = await request(app)
        .post('/api/portfolio/connect')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/portfolio/connect')
        .send({
          platform: 'manual'
        });

      expect(res.statusCode).toBe(401);
    });
  });
});
