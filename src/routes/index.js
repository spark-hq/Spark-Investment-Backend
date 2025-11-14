import express from 'express';
import authRoutes from './auth.js';
import portfolioRoutes from './portfolio.js';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/portfolio', portfolioRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

export default router;
