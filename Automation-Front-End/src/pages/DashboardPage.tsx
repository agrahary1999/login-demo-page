import React, { useEffect, useState } from 'react';
import { getDashboardStats, getDashboardSummary, DashboardStats, DashboardSummary } from '../services/dashboard.service';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statsData, summaryData] = await Promise.all([
          getDashboardStats(),
          getDashboardSummary()
        ]);
        setStats(statsData);
        setSummary(summaryData);
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
        if (err.response?.status === 401) {
          navigate('/auth');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    CREATED: 'bg-gray-100 text-gray-800',
    QA: 'bg-yellow-100 text-yellow-800',
    QA_APPROVED: 'bg-green-100 text-green-800',
    DEV: 'bg-blue-100 text-blue-800',
    PLAN_APPROVED: 'bg-purple-100 text-purple-800',
    CODE_GEN: 'bg-indigo-100 text-indigo-800',
    PR_CREATED: 'bg-orange-100 text-orange-800',
    DONE: 'bg-emerald-100 text-emerald-800'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={() => {
                localStorage.removeItem('accessToken');
                navigate('/auth');
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Features</h3>
              <p className="mt-2 text-4xl font-bold text-gray-900">{stats?.totalFeatures || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Recent Activity</h3>
              <p className="mt-2 text-4xl font-bold text-gray-900">{stats?.recentActivity || 0}</p>
              <p className="mt-1 text-xs text-gray-500">Last 30 days</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Projects</h3>
              <p className="mt-2 text-4xl font-bold text-gray-900">{summary?.projects.length || 0}</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Features by Status</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
              {stats?.statusCounts && Object.entries(stats.statusCounts).map(([status, count]) => (
                <div key={status} className="text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
                    {status.replace(/_/g, ' ')}
                  </span>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{count}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Projects</h2>
          {summary?.projects && summary.projects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {summary.projects.map((project) => (
                <div key={project.projectId} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{project.featureCount} features</span>
                    <span>Updated {new Date(project.lastActivity).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              <p>No projects found. Start creating features to see them here.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;