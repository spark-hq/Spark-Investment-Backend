import { MockMarketDataProvider } from './MockMarketDataProvider.js';
import { YahooFinanceProvider } from './YahooFinanceProvider.js';
import logger from '../../config/logger.js';

/**
 * Market Data Service
 * Provides a unified interface for getting market data
 * Supports multiple providers (mock, yahoo, zerodha, etc.)
 *
 * Usage:
 * const marketData = MarketDataService.getInstance();
 * const price = await marketData.getPrice('RELIANCE');
 *
 * Switch providers via .env:
 * MARKET_DATA_PROVIDER=mock|yahoo|zerodha
 */
class MarketDataService {
  static instance = null;

  constructor() {
    this.provider = null;
    this.providerType = null;
    this.initializeProvider();
  }

  /**
   * Singleton instance
   */
  static getInstance() {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  /**
   * Initialize market data provider based on configuration
   */
  initializeProvider() {
    const providerType = process.env.MARKET_DATA_PROVIDER || 'mock';

    logger.info(`Initializing market data provider: ${providerType}`);

    switch (providerType.toLowerCase()) {
      case 'mock':
        this.provider = new MockMarketDataProvider();
        this.providerType = 'mock';
        logger.info('✅ Mock Market Data Provider initialized');
        break;

      case 'yahoo':
        try {
          this.provider = new YahooFinanceProvider();
          this.providerType = 'yahoo';
          logger.info('✅ Yahoo Finance Provider initialized');
        } catch (error) {
          logger.warn('⚠️  Yahoo Finance not available, falling back to mock');
          this.provider = new MockMarketDataProvider();
          this.providerType = 'mock';
        }
        break;

      case 'zerodha':
        logger.warn('⚠️  Zerodha provider not yet implemented, using mock');
        this.provider = new MockMarketDataProvider();
        this.providerType = 'mock';
        break;

      case 'groww':
        logger.warn('⚠️  Groww provider not yet implemented, using mock');
        this.provider = new MockMarketDataProvider();
        this.providerType = 'mock';
        break;

      case 'binance':
        logger.warn('⚠️  Binance provider not yet implemented, using mock');
        this.provider = new MockMarketDataProvider();
        this.providerType = 'mock';
        break;

      default:
        logger.warn(`⚠️  Unknown provider '${providerType}', using mock`);
        this.provider = new MockMarketDataProvider();
        this.providerType = 'mock';
    }

    // Verify provider is configured
    if (!this.provider.isConfigured()) {
      logger.error('❌ Market data provider not properly configured');
      throw new Error('Market data provider configuration failed');
    }
  }

  /**
   * Get current provider type
   */
  getProviderType() {
    return this.providerType;
  }

  /**
   * Switch to a different provider (useful for testing)
   */
  switchProvider(providerType) {
    logger.info(`Switching market data provider from ${this.providerType} to ${providerType}`);
    process.env.MARKET_DATA_PROVIDER = providerType;
    this.initializeProvider();
  }

  // Delegate methods to the current provider

  /**
   * Get current price for a symbol
   * @param {string} symbol - Stock symbol
   * @returns {Promise<number>} Current price
   */
  async getPrice(symbol) {
    try {
      return await this.provider.getPrice(symbol);
    } catch (error) {
      logger.error(`Error getting price for ${symbol}:`, { error: error.message });
      throw error;
    }
  }

  /**
   * Get detailed quote for a symbol
   * @param {string} symbol - Stock symbol
   * @returns {Promise<Object>} Quote data
   */
  async getQuote(symbol) {
    try {
      return await this.provider.getQuote(symbol);
    } catch (error) {
      logger.error(`Error getting quote for ${symbol}:`, { error: error.message });
      throw error;
    }
  }

  /**
   * Get historical data for a symbol
   * @param {string} symbol - Stock symbol
   * @param {string} period - Time period
   * @returns {Promise<Array>} Historical data
   */
  async getHistoricalData(symbol, period = '1M') {
    try {
      return await this.provider.getHistoricalData(symbol, period);
    } catch (error) {
      logger.error(`Error getting historical data for ${symbol}:`, { error: error.message });
      throw error;
    }
  }

  /**
   * Get multiple quotes at once
   * @param {Array<string>} symbols - Array of stock symbols
   * @returns {Promise<Object>} Map of symbol to quote data
   */
  async getBulkQuotes(symbols) {
    try {
      return await this.provider.getBulkQuotes(symbols);
    } catch (error) {
      logger.error('Error getting bulk quotes:', { error: error.message });
      throw error;
    }
  }

  /**
   * Get market indices
   * @returns {Promise<Array>} Market indices data
   */
  async getIndices() {
    try {
      return await this.provider.getIndices();
    } catch (error) {
      logger.error('Error getting indices:', { error: error.message });
      throw error;
    }
  }
}

// Export singleton instance
export default MarketDataService.getInstance();
