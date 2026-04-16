import axios from '../utils/axios';

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

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axios.get<DashboardStats>('/api/dashboard/stats');
  return response.data;
};

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await axios.get<DashboardSummary>('/api/dashboard/summary');
  return response.data;
};