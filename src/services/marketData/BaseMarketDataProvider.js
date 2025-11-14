/**
 * Base Market Data Provider Interface
 * All market data providers must implement these methods
 */
export class BaseMarketDataProvider {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Get current price for a symbol
   * @param {string} symbol - Stock symbol (e.g., 'RELIANCE', 'INFY')
   * @returns {Promise<number>} Current price
   */
  async getPrice(symbol) {
    throw new Error('getPrice() must be implemented by provider');
  }

  /**
   * Get detailed quote for a symbol
   * @param {string} symbol - Stock symbol
   * @returns {Promise<Object>} Quote data with price, change, volume, etc.
   */
  async getQuote(symbol) {
    throw new Error('getQuote() must be implemented by provider');
  }

  /**
   * Get historical data for a symbol
   * @param {string} symbol - Stock symbol
   * @param {string} period - Time period (1D, 1W, 1M, 3M, 6M, 1Y, ALL)
   * @returns {Promise<Array>} Historical price data
   */
  async getHistoricalData(symbol, period = '1M') {
    throw new Error('getHistoricalData() must be implemented by provider');
  }

  /**
   * Get multiple quotes at once
   * @param {Array<string>} symbols - Array of stock symbols
   * @returns {Promise<Object>} Map of symbol to quote data
   */
  async getBulkQuotes(symbols) {
    throw new Error('getBulkQuotes() must be implemented by provider');
  }

  /**
   * Get market indices (NIFTY, SENSEX, etc.)
   * @returns {Promise<Array>} Market indices data
   */
  async getIndices() {
    throw new Error('getIndices() must be implemented by provider');
  }

  /**
   * Validate if provider is properly configured
   * @returns {boolean} True if configured correctly
   */
  isConfigured() {
    return true;
  }
}
