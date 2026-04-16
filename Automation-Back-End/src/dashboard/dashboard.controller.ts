import { Request, Response, NextFunction } from 'express';
import { dashboardService } from './dashboard.service';

export class DashboardController {
  async getDashboardStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.sub;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized: User ID not found' });
        return;
      }

      const stats = await dashboardService.getStatsForUser(userId);
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }

  async getDashboardSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.sub;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized: User ID not found' });
        return;
      }

      const summary = await dashboardService.getSummaryForUser(userId);
      res.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();