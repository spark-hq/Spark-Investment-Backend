import express from 'express';
import * as portfolioController from '../controllers/portfolioController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All portfolio routes require authentication
router.use(authenticate);

// GET /api/portfolio/summary
router.get('/summary', portfolioController.getSummary);

// GET /api/portfolio/platforms
router.get('/platforms', portfolioController.getPlatforms);

// GET /api/portfolio/performance
router.get('/performance', portfolioController.getPerformance);

// GET /api/portfolio/allocation
router.get('/allocation', portfolioController.getAllocation);

// GET /api/portfolio/top-performers
router.get('/top-performers', portfolioController.getTopPerformers);

// GET /api/portfolio/activity
router.get('/activity', portfolioController.getActivity);

// POST /api/portfolio/connect
router.post('/connect', portfolioController.connectPlatform);

export default router;
