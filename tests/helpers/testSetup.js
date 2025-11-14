import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../src/utils/password.js';

const prisma = new PrismaClient();

// Clean database before each test
export const cleanDatabase = async () => {
  // Delete in correct order to avoid foreign key constraints
  await prisma.transaction.deleteMany();
  await prisma.investment.deleteMany();
  await prisma.autoInvestStrategy.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.platform.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.marketDataCache.deleteMany();
  await prisma.user.deleteMany();
};

// Create test user
export const createTestUser = async (userData = {}) => {
  const defaultData = {
    email: 'test@example.com',
    password: 'Test123!',
    name: 'Test User',
    phone: '+91-9876543210'
  };

  const data = { ...defaultData, ...userData };

  return await prisma.user.create({
    data: {
      email: data.email,
      password: await hashPassword(data.password),
      name: data.name,
      phone: data.phone
    }
  });
};

// Create test platform for user
export const createTestPlatform = async (userId, platformData = {}) => {
  const defaultData = {
    name: 'zerodha',
    type: 'broker',
    status: 'connected',
    balance: 10000
  };

  const data = { ...defaultData, ...platformData };

  return await prisma.platform.create({
    data: {
      userId,
      ...data
    }
  });
};

// Disconnect prisma after all tests
export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};

export { prisma };
