import { Feature } from '../feature/feature.model';

export interface DashboardStats {
  totalFeatures: number;
  statusCounts: {
    CREATED: number;
    QA: number;
    QA_APPROVED: number;
    DEV: number;
    PLAN_APPROVED: number;
    CODE_GEN: number;
    PR_CREATED: number;
    DONE: number;
  };
  recentActivity: number;
}

export interface ProjectSummary {
  projectId: string;
  name: string;
  featureCount: number;
  lastActivity: string;
}

export interface DashboardSummary {
  projects: ProjectSummary[];
}

export class DashboardService {
  async getStatsForUser(userId: string): Promise<DashboardStats> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalFeatures, statusAggregation, recentActivity] = await Promise.all([
      Feature.countDocuments({ userId }),
      Feature.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      Feature.countDocuments({
        userId,
        updatedAt: { $gte: thirtyDaysAgo }
      })
    ]);

    const statusCounts = {
      CREATED: 0,
      QA: 0,
      QA_APPROVED: 0,
      DEV: 0,
      PLAN_APPROVED: 0,
      CODE_GEN: 0,
      PR_CREATED: 0,
      DONE: 0
    };

    statusAggregation.forEach((item: any) => {
      if (item._id in statusCounts) {
        statusCounts[item._id as keyof typeof statusCounts] = item.count;
      }
    });

    return {
      totalFeatures,
      statusCounts,
      recentActivity
    };
  }

  async getSummaryForUser(userId: string): Promise<DashboardSummary> {
    const projectAggregation = await Feature.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$projectId',
          featureCount: { $sum: 1 },
          lastActivity: { $max: '$updatedAt' }
        }
      },
      { $sort: { lastActivity: -1 } }
    ]);

    const projects: ProjectSummary[] = projectAggregation.map((proj: any) => ({
      projectId: proj._id || 'unknown',
      name: proj._id ? `Project ${proj._id}` : 'Unnamed Project',
      featureCount: proj.featureCount,
      lastActivity: proj.lastActivity ? proj.lastActivity.toISOString() : new Date().toISOString()
    }));

    return { projects };
  }
}

export const dashboardService = new DashboardService();