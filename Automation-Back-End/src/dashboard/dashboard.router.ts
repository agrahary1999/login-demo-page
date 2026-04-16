import { Router } from 'express';
import { dashboardController } from './dashboard.controller';

const router = Router();

router.get('/stats', (req, res, next) => dashboardController.getDashboardStats(req, res, next));
router.get('/summary', (req, res, next) => dashboardController.getDashboardSummary(req, res, next));

export const dashboardRouter = router;