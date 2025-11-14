import { BaseMarketDataProvider } from './BaseMarketDataProvider.js';

/**
 * Mock Market Data Provider
 * Returns hardcoded data for testing and development
 * No external API calls, no rate limits, instant responses
 */
export class MockMarketDataProvider extends BaseMarketDataProvider {
  constructor(config = {}) {
    super(config);

    // Mock price database
    this.mockPrices = {
      // Indian Stocks
      'RELIANCE': 2850.75,
      'INFY': 1450.50,
      'TCS': 3520.30,
      'HDFC': 1680.25,
      'ICICIBANK': 945.80,
      'SBIN': 598.45,
      'BHARTIARTL': 875.20,
      'ITC': 425.60,
      'KOTAKBANK': 1785.90,
      'LT': 3245.75,
      'HDFCBANK': 1625.40,
      'WIPRO': 425.80,
      'TATAMOTORS': 625.90,
      'TATASTEEL': 135.50,
      'AXISBANK': 1085.65,
      'MARUTI': 10250.30,
      'SUNPHARMA': 1545.20,
      'ADANIPORTS': 785.40,
      'ONGC': 185.75,
      'POWERGRID': 245.90,

      // Mutual Funds (NAV)
      'HDFC_EQUITY_FUND': 850.50,
      'ICICI_BLUECHIP_FUND': 95.30,
      'SBI_SMALL_CAP_FUND': 125.75,
      'AXIS_MIDCAP_FUND': 78.90,

      // Crypto
      'BTC': 3500000,  // Bitcoin in INR
      'ETH': 180000,   // Ethereum in INR
      'BNB': 25000,    // Binance Coin
      'USDT': 83.50,   // Tether
    };

    // Mock historical data patterns
    this.historicalPatterns = {
      '1D': 24,   // 24 data points (hourly)
      '1W': 7,    // 7 data points (daily)
      '1M': 30,   // 30 data points (daily)
      '3M': 90,   // 90 data points (daily)
      '6M': 180,  // 180 data points (daily)
      '1Y': 365,  // 365 data points (daily)
      'ALL': 730, // 2 years of data (daily)
    };
  }

  /**
   * Get current price for a symbol
   */
  async getPrice(symbol) {
    // Simulate API delay
    await this._simulateDelay();

    const price = this.mockPrices[symbol.toUpperCase()];
    if (!price) {
      throw new Error(`Symbol ${symbol} not found in mock data`);
    }

    return price;
  }

  /**
   * Get detailed quote for a symbol
   */
  async getQuote(symbol) {
    await this._simulateDelay();

    const price = await this.getPrice(symbol);
    const change = this._generateRandomChange(-50, 50);
    const changePercent = (change / price) * 100;

    return {
      symbol: symbol.toUpperCase(),
      price: price,
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: this._generateRandomVolume(),
      high: parseFloat((price + Math.abs(change)).toFixed(2)),
      low: parseFloat((price - Math.abs(change)).toFixed(2)),
      open: parseFloat((price - change).toFixed(2)),
      close: price,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get historical data for a symbol
   */
  async getHistoricalData(symbol, period = '1M') {
    await this._simulateDelay();

    const currentPrice = await this.getPrice(symbol);
    const dataPoints = this.historicalPatterns[period] || 30;
    const data = [];

    // Generate historical data points
    const startDate = this._getStartDate(period);
    const priceVariation = currentPrice * 0.15; // 15% variation range

    for (let i = 0; i < dataPoints; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      // Generate price with upward trend
      const trendFactor = (i / dataPoints);
      const randomFactor = Math.random() * 0.1 - 0.05; // ±5% random
      const price = currentPrice * (0.85 + trendFactor * 0.15 + randomFactor);

      data.push({
        date: date.toISOString().split('T')[0],
        value: parseFloat(price.toFixed(2)),
        returns: parseFloat(((price - currentPrice * 0.85) / (currentPrice * 0.85) * 100).toFixed(2))
      });
    }

    return data;
  }

  /**
   * Get multiple quotes at once
   */
  async getBulkQuotes(symbols) {
    await this._simulateDelay();

    const quotes = {};
    for (const symbol of symbols) {
      try {
        quotes[symbol] = await this.getQuote(symbol);
      } catch (error) {
        quotes[symbol] = null;
      }
    }

    return quotes;
  }

  /**
   * Get market indices
   */
  async getIndices() {
    await this._simulateDelay();

    return [
      {
        symbol: 'NIFTY50',
        name: 'NIFTY 50',
        value: 19485.50,
        change: 125.30,
        changePercent: 0.65
      },
      {
        symbol: 'SENSEX',
        name: 'BSE SENSEX',
        value: 65450.75,
        change: 285.60,
        changePercent: 0.44
      },
      {
        symbol: 'BANKNIFTY',
        name: 'BANK NIFTY',
        value: 45320.80,
        change: -150.25,
        changePercent: -0.33
      },
      {
        symbol: 'NIFTYIT',
        name: 'NIFTY IT',
        value: 31245.90,
        change: 420.50,
        changePercent: 1.36
      }
    ];
  }

  /**
   * Provider is always configured (mock data)
   */
  isConfigured() {
    return true;
  }

  // Private helper methods

  _simulateDelay() {
    // Simulate API latency (10-50ms)
    const delay = Math.random() * 40 + 10;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  _generateRandomChange(min, max) {
    return Math.random() * (max - min) + min;
  }

  _generateRandomVolume() {
    return Math.floor(Math.random() * 5000000) + 500000;
  }

  _getStartDate(period) {
    const now = new Date();
    const startDate = new Date(now);

    switch(period) {
      case '1D':
        startDate.setDate(now.getDate() - 1);
        break;
      case '1W':
        startDate.setDate(now.getDate() - 7);
        break;
      case '1M':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6M':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1Y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'ALL':
        startDate.setFullYear(now.getFullYear() - 2);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    return startDate;
  }
}
