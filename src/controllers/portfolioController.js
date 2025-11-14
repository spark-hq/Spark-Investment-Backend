import portfolioService from '../services/portfolioService.js';
import logger from '../config/logger.js';

/**
 * GET /api/portfolio/summary
 * Get portfolio summary for current user
 */
export const getSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const summary = await portfolioService.getSummary(userId);

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    logger.error('Error in getSummary:', { error: error.message, userId: req.user?.id });
    next(error);
  }
};

/**
 * GET /api/portfolio/platforms
 * Get all connected platforms for current user
 */
export const getPlatforms = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const platforms = await portfolioService.getPlatforms(userId);

    res.json({
      success: true,
      data: platforms
    });
  } catch (error) {
    logger.error('Error in getPlatforms:', { error: error.message, userId: req.user?.id });
    next(error);
  }
};

/**
 * GET /api/portfolio/performance
 * Get portfolio performance over time
 * Query params: period (1D, 1W, 1M, 3M, 6M, 1Y, ALL)
 */
export const getPerformance = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const period = req.query.period || '1M';

    // Validate period
    const validPeriods = ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'];
    if (!validPeriods.includes(period)) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Invalid period. Must be one of: ${validPeriods.join(', ')}`
        }
      });
    }

    const performance = await portfolioService.getPerformance(userId, period);

    res.json({
      success: true,
      data: performance
    });
  } catch (error) {
    logger.error('Error in getPerformance:', { error: error.message, userId: req.user?.id });
    next(error);
  }
};

/**
 * GET /api/portfolio/allocation
 * Get asset allocation breakdown
 */
export const getAllocation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const allocation = await portfolioService.getAllocation(userId);

    res.json({
      success: true,
      data: allocation
    });
  } catch (error) {
    logger.error('Error in getAllocation:', { error: error.message, userId: req.user?.id });
    next(error);
  }
};

/**
 * GET /api/portfolio/top-performers
 * Get top performing investments
 * Query params: limit (default: 5)
 */
export const getTopPerformers = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;

    const topPerformers = await portfolioService.getTopPerformers(userId, limit);

    res.json({
      success: true,
      data: topPerformers
    });
  } catch (error) {
    logger.error('Error in getTopPerformers:', { error: error.message, userId: req.user?.id });
    next(error);
  }
};

/**
 * GET /api/portfolio/activity
 * Get recent portfolio activity
 * Query params: limit (default: 10)
 */
export const getActivity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    const activity = await portfolioService.getActivity(userId, limit);

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    logger.error('Error in getActivity:', { error: error.message, userId: req.user?.id });
    next(error);
  }
};

/**
 * POST /api/portfolio/connect
 * Connect a new investment platform
 * Body: { platform, credentials }
 */
export const connectPlatform = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const platformData = req.body;

    if (!platformData.platform) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Platform name is required'
        }
      });
    }

    const result = await portfolioService.connectPlatform(userId, platformData);

    res.status(201).json({
      success: true,
      message: 'Platform connected successfully',
      platformId: result.platformId
    });
  } catch (error) {
    logger.error('Error in connectPlatform:', { error: error.message, userId: req.user?.id });
    next(error);
  }
};
