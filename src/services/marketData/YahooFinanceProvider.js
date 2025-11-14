import { BaseMarketDataProvider } from './BaseMarketDataProvider.js';

/**
 * Yahoo Finance Market Data Provider
 *
 * CURRENTLY DISABLED - Ready to activate when needed
 *
 * To enable:
 * 1. Install: npm install yahoo-finance2
 * 2. Uncomment the code below
 * 3. Set MARKET_DATA_PROVIDER=yahoo in .env
 *
 * Features:
 * - Free, no API key required
 * - Real-time stock prices
 * - Historical data
 * - Global market coverage
 *
 * Limitations:
 * - Unofficial API (may have rate limits)
 * - Data might be 15-min delayed
 * - No guaranteed uptime
 */

export class YahooFinanceProvider extends BaseMarketDataProvider {
  constructor(config = {}) {
    super(config);
    throw new Error('Yahoo Finance Provider not yet activated. To enable, see instructions in YahooFinanceProvider.js');
  }
}

/*
// UNCOMMENT THIS CODE WHEN READY TO USE YAHOO FINANCE

import yahooFinance from 'yahoo-finance2';
import { BaseMarketDataProvider } from './BaseMarketDataProvider.js';

export class YahooFinanceProvider extends BaseMarketDataProvider {
  constructor(config = {}) {
    super(config);
    this.yahooFinance = yahooFinance;

    // Indian stock symbols need .NS or .BO suffix
    this.symbolSuffix = config.exchange || 'NS'; // NS = NSE, BO = BSE
  }

  async getPrice(symbol) {
    const yahooSymbol = this._formatSymbol(symbol);
    const quote = await this.yahooFinance.quote(yahooSymbol);
    return quote.regularMarketPrice;
  }

  async getQuote(symbol) {
    const yahooSymbol = this._formatSymbol(symbol);
    const quote = await this.yahooFinance.quote(yahooSymbol);

    return {
      symbol: symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      volume: quote.regularMarketVolume,
      high: quote.regularMarketDayHigh,
      low: quote.regularMarketDayLow,
      open: quote.regularMarketOpen,
      close: quote.regularMarketPreviousClose,
      timestamp: new Date().toISOString()
    };
  }

  async getHistoricalData(symbol, period = '1M') {
    const yahooSymbol = this._formatSymbol(symbol);
    const { startDate, endDate, interval } = this._parsePeriod(period);

    const history = await this.yahooFinance.historical(yahooSymbol, {
      period1: startDate,
      period2: endDate,
      interval: interval
    });

    return history.map(item => ({
      date: item.date.toISOString().split('T')[0],
      value: item.close,
      returns: 0 // Calculate based on first value
    }));
  }

  async getBulkQuotes(symbols) {
    const quotes = {};

    // Yahoo Finance supports batch requests
    const yahooSymbols = symbols.map(s => this._formatSymbol(s));
    const results = await this.yahooFinance.quote(yahooSymbols);

    results.forEach((quote, index) => {
      quotes[symbols[index]] = {
        symbol: symbols[index],
        price: quote.regularMarketPrice,
        change: quote.regularMarketChange,
        changePercent: quote.regularMarketChangePercent,
        volume: quote.regularMarketVolume
      };
    });

    return quotes;
  }

  async getIndices() {
    const indices = [
      { symbol: '^NSEI', name: 'NIFTY 50' },
      { symbol: '^BSESN', name: 'BSE SENSEX' },
      { symbol: '^NSEBANK', name: 'BANK NIFTY' }
    ];

    const quotes = await Promise.all(
      indices.map(index => this.yahooFinance.quote(index.symbol))
    );

    return quotes.map((quote, i) => ({
      symbol: indices[i].symbol,
      name: indices[i].name,
      value: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent
    }));
  }

  isConfigured() {
    return true; // Yahoo Finance doesn't require API key
  }

  _formatSymbol(symbol) {
    // Indian stocks: RELIANCE -> RELIANCE.NS
    // Already formatted symbols are returned as-is
    if (symbol.includes('.')) {
      return symbol;
    }
    return `${symbol}.${this.symbolSuffix}`;
  }

  _parsePeriod(period) {
    const endDate = new Date();
    const startDate = new Date();
    let interval = '1d';

    switch(period) {
      case '1D':
        startDate.setDate(endDate.getDate() - 1);
        interval = '1h';
        break;
      case '1W':
        startDate.setDate(endDate.getDate() - 7);
        interval = '1d';
        break;
      case '1M':
        startDate.setMonth(endDate.getMonth() - 1);
        interval = '1d';
        break;
      case '3M':
        startDate.setMonth(endDate.getMonth() - 3);
        interval = '1d';
        break;
      case '6M':
        startDate.setMonth(endDate.getMonth() - 6);
        interval = '1d';
        break;
      case '1Y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        interval = '1wk';
        break;
      case 'ALL':
        startDate.setFullYear(endDate.getFullYear() - 5);
        interval = '1mo';
        break;
    }

    return { startDate, endDate, interval };
  }
}

*/
