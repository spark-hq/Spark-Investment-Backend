import prisma from '../config/database.js';
import marketData from './marketData/MarketDataService.js';
import logger from '../config/logger.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

/**
 * Portfolio Service
 * Handles all portfolio-related business logic
 */
class PortfolioService {
  /**
   * Get portfolio summary for a user
   * Calculates total value, returns, allocation across all platforms
   */
  async getSummary(userId) {
    // Get all user's platforms with their investments
    const platforms = await prisma.platform.findMany({
      where: { userId },
      include: {
        investments: true
      }
    });

    if (platforms.length === 0) {
      // User has no platforms yet - return zero values
      return {
        totalValue: 0,
        totalInvested: 0,
        totalReturns: 0,
        returnsPercentage: 0,
        dayChange: 0,
        dayChangePercentage: 0,
        lastUpdated: new Date().toISOString()
      };
    }

    let totalInvested = 0;
    let totalCurrentValue = 0;

    // Calculate values from all investments
    for (const platform of platforms) {
      for (const investment of platform.investments) {
        totalInvested += investment.investedValue;

        try {
          // Get current price from market data
          const currentPrice = await marketData.getPrice(investment.symbol);
          const currentValue = currentPrice * investment.quantity;
          totalCurrentValue += currentValue;

          // Update investment in database
          await prisma.investment.update({
            where: { id: investment.id },
            data: {
              currentPrice,
              currentValue,
              returns: currentValue - investment.investedValue,
              returnsPercent: ((currentValue - investment.investedValue) / investment.investedValue) * 100
            }
          });
        } catch (error) {
          logger.error(`Error updating investment ${investment.symbol}:`, { error: error.message });
          // Use last known value if price fetch fails
          totalCurrentValue += investment.currentValue;
        }
      }
    }

    const totalReturns = totalCurrentValue - totalInvested;
    const returnsPercentage = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;

    // Mock day change (in real implementation, compare with yesterday's closing)
    const dayChange = totalCurrentValue * 0.0096; // Mock: 0.96% gain
    const dayChangePercentage = 0.96;

    return {
      totalValue: parseFloat(totalCurrentValue.toFixed(2)),
      totalInvested: parseFloat(totalInvested.toFixed(2)),
      totalReturns: parseFloat(totalReturns.toFixed(2)),
      returnsPercentage: parseFloat(returnsPercentage.toFixed(2)),
      dayChange: parseFloat(dayChange.toFixed(2)),
      dayChangePercentage: parseFloat(dayChangePercentage.toFixed(2)),
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Get all connected platforms for a user
   */
  async getPlatforms(userId) {
    const platforms = await prisma.platform.findMany({
      where: { userId },
      include: {
        _count: {
          select: { investments: true }
        }
      }
    });

    return platforms.map(platform => ({
      id: platform.id,
      name: platform.name,
      type: platform.type,
      status: platform.status,
      balance: platform.balance,
      holdings: platform._count.investments,
      lastSync: platform.lastSync
    }));
  }

  /**
   * Get portfolio performance over time
   */
  async getPerformance(userId, period = '1M') {
    const platforms = await prisma.platform.findMany({
      where: { userId },
      include: {
        investments: true
      }
    });

    if (platforms.length === 0) {
      return {
        period,
        dataPoints: []
      };
    }

    // Get historical data for first investment as sample
    // In real implementation, aggregate all investments
    const firstInvestment = platforms[0]?.investments[0];

    if (!firstInvestment) {
      return {
        period,
        dataPoints: []
      };
    }

    try {
      const historicalData = await marketData.getHistoricalData(firstInvestment.symbol, period);

      // Calculate portfolio value for each data point
      // For now, using simplified calculation
      const dataPoints = historicalData.map(point => ({
        date: point.date,
        value: point.value * firstInvestment.quantity, // Simplified
        returns: point.returns
      }));

      return {
        period,
        dataPoints
      };
    } catch (error) {
      logger.error('Error getting performance data:', { error: error.message });
      return {
        period,
        dataPoints: []
      };
    }
  }

  /**
   * Get asset allocation breakdown
   */
  async getAllocation(userId) {
    const platforms = await prisma.platform.findMany({
      where: { userId },
      include: {
        investments: true
      }
    });

    if (platforms.length === 0) {
      return {
        equity: 0,
        debt: 0,
        gold: 0,
        crypto: 0
      };
    }

    let totalValue = 0;
    const allocation = {
      equity: 0,
      debt: 0,
      gold: 0,
      crypto: 0
    };

    // Calculate allocation based on investment types
    for (const platform of platforms) {
      for (const investment of platform.investments) {
        const value = investment.currentValue;
        totalValue += value;

        switch (investment.type.toLowerCase()) {
          case 'equity':
          case 'stock':
            allocation.equity += value;
            break;
          case 'debt':
          case 'bond':
          case 'mutual_fund':
            allocation.debt += value;
            break;
          case 'gold':
            allocation.gold += value;
            break;
          case 'crypto':
            allocation.crypto += value;
            break;
        }
      }
    }

    // Convert to percentages
    if (totalValue > 0) {
      return {
        equity: parseFloat(((allocation.equity / totalValue) * 100).toFixed(1)),
        debt: parseFloat(((allocation.debt / totalValue) * 100).toFixed(1)),
        gold: parseFloat(((allocation.gold / totalValue) * 100).toFixed(1)),
        crypto: parseFloat(((allocation.crypto / totalValue) * 100).toFixed(1))
      };
    }

    return {
      equity: 0,
      debt: 0,
      gold: 0,
      crypto: 0
    };
  }

  /**
   * Get top performing investments
   */
  async getTopPerformers(userId, limit = 5) {
    const platforms = await prisma.platform.findMany({
      where: { userId },
      include: {
        investments: {
          where: {
            status: 'active'
          },
          orderBy: {
            returnsPercent: 'desc'
          },
          take: limit
        }
      }
    });

    const topPerformers = [];

    for (const platform of platforms) {
      for (const investment of platform.investments) {
        topPerformers.push({
          id: investment.id,
          symbol: investment.symbol,
          name: investment.name,
          returns: investment.returnsPercent,
          currentValue: investment.currentValue
        });
      }
    }

    // Sort by returns and take top performers
    return topPerformers
      .sort((a, b) => b.returns - a.returns)
      .slice(0, limit);
  }

  /**
   * Get recent portfolio activity
   */
  async getActivity(userId, limit = 10) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: {
        date: 'desc'
      },
      take: limit,
      include: {
        investment: true
      }
    });

    return transactions.map(tx => ({
      id: tx.id,
      type: tx.type,
      symbol: tx.symbol,
      amount: tx.amount,
      timestamp: tx.date.toISOString()
    }));
  }

  /**
   * Connect a new platform
   * Handles platforms with and without API credentials
   */
  async connectPlatform(userId, platformData) {
    const { platform, credentials } = platformData;

    // Validate platform name
    const validPlatforms = ['zerodha', 'groww', 'upstox', 'manual', 'wazirx', 'binance'];
    if (!validPlatforms.includes(platform.toLowerCase())) {
      throw new ValidationError(`Invalid platform: ${platform}`);
    }

    // Check if platform already connected
    const existing = await prisma.platform.findFirst({
      where: {
        userId,
        name: platform.toLowerCase()
      }
    });

    if (existing) {
      throw new ValidationError(`Platform ${platform} is already connected`);
    }

    // Handle platforms that don't need credentials (like 'manual')
    const requiresCredentials = !['manual'].includes(platform.toLowerCase());

    if (requiresCredentials && !credentials) {
      throw new ValidationError(`Platform ${platform} requires API credentials`);
    }

    // Create platform connection
    const newPlatform = await prisma.platform.create({
      data: {
        userId,
        name: platform.toLowerCase(),
        type: this._getPlatformType(platform),
        status: 'connected',
        apiKey: credentials?.apiKey || null,
        apiSecret: credentials?.apiSecret || null,
        accessToken: credentials?.accessToken || null,
        balance: 0,
        lastSync: new Date()
      }
    });

    logger.info(`Platform ${platform} connected for user ${userId}`);

    return {
      platformId: newPlatform.id,
      name: newPlatform.name,
      status: 'connected'
    };
  }

  /**
   * Get platform type based on name
   */
  _getPlatformType(platformName) {
    const brokers = ['zerodha', 'groww', 'upstox'];
    const exchanges = ['wazirx', 'binance'];

    if (brokers.includes(platformName.toLowerCase())) {
      return 'broker';
    } else if (exchanges.includes(platformName.toLowerCase())) {
      return 'exchange';
    } else {
      return 'manual';
    }
  }
}

export default new PortfolioService();
