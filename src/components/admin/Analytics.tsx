import React, { useState, useEffect } from 'react';
import { TrendingUp, Eye, Users, Calendar, BarChart3, PieChart, Activity } from 'lucide-react';
import { blogService, projectService, isSQLiteAvailable } from '../../lib/sqlite';
import { blogPosts as mockBlogPosts } from '../../data/blogPosts';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    totalPosts: 0,
    totalProjects: 0,
    recentActivity: [],
    topPosts: [],
    monthlyViews: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);

    // Use mock data if SQLite is not available
    if (!isSQLiteAvailable()) {
      try {
        const posts = mockBlogPosts;
        const projects = []; // Empty array for projects
        
        const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
        const topPosts = posts
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 5)
          .map(post => ({
            title: post.title,
            views: post.views || 0,
            date: post.date
          }));

        const monthlyViews = generateMockMonthlyViews();
        const recentActivity = generateMockActivity(posts, projects);

        setAnalytics({
          totalViews,
          totalPosts: posts.length,
          totalProjects: projects.length,
          recentActivity,
          topPosts,
          monthlyViews
        });
      } catch (err) {
        setError('Failed to load mock analytics data');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      // Fetch real data from SQLite
      const [postsResult, projectsResult] = await Promise.all([
        blogService.getAllPosts(),
        projectService.getAllProjects()
      ]);

      const posts = postsResult.data || [];
      const projects = projectsResult.data || [];

      const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
      const topPosts = posts
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5)
        .map(post => ({
          title: post.title,
          views: post.views || 0,
          date: post.created_at
        }));

      const monthlyViews = await generateMonthlyViews(posts);
      const recentActivity = generateRecentActivity(posts, projects);

      setAnalytics({
        totalViews,
        totalPosts: posts.length,
        totalProjects: projects.length,
        recentActivity,
        topPosts,
        monthlyViews
      });
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateMockMonthlyViews = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      views: Math.floor(Math.random() * 1000) + 100
    }));
  };

  const generateMockActivity = (posts, projects) => {
    const activities = [];
    
    posts.slice(0, 3).forEach(post => {
      activities.push({
        type: 'post',
        title: post.title,
        date: post.date,
        views: post.views || 0
      });
    });

    return activities.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const generateMonthlyViews = async (posts) => {
    // Generate monthly view data based on posts
    const monthlyData = {};
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      monthlyData[monthKey] = 0;
    }

    posts.forEach(post => {
      const postDate = new Date(post.created_at);
      const monthKey = postDate.toLocaleDateString('en-US', { month: 'short' });
      if (monthlyData.hasOwnProperty(monthKey)) {
        monthlyData[monthKey] += post.views || 0;
      }
    });

    return Object.entries(monthlyData).map(([month, views]) => ({
      month,
      views
    }));
  };

  const generateRecentActivity = (posts, projects) => {
    const activities = [];
    
    posts.slice(0, 5).forEach(post => {
      activities.push({
        type: 'post',
        title: post.title,
        date: post.created_at,
        views: post.views || 0
      });
    });

    projects.slice(0, 3).forEach(project => {
      activities.push({
        type: 'project',
        title: project.title,
        date: project.created_at,
        views: 0
      });
    });

    return activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Analytics</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <button
          onClick={fetchAnalytics}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Activity className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalViews.toLocaleString()}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalPosts}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalProjects}</p>
            </div>
            <PieChart className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Views/Post</p>
              <p className="text-3xl font-bold text-gray-900">
                {analytics.totalPosts > 0 ? Math.round(analytics.totalViews / analytics.totalPosts) : 0}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Views Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Views</h2>
          <div className="space-y-4">
            {analytics.monthlyViews.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{data.month}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min((data.views / Math.max(...analytics.monthlyViews.map(d => d.views))) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{data.views}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Posts */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Posts</h2>
          <div className="space-y-4">
            {analytics.topPosts.map((post, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 truncate">{post.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <Eye className="h-4 w-4" />
                  <span className="font-bold">{post.views}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {analytics.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-full ${
                activity.type === 'post' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
              }`}>
                {activity.type === 'post' ? <BarChart3 className="h-4 w-4" /> : <PieChart className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{activity.title}</h3>
                <p className="text-sm text-gray-600">
                  {activity.type === 'post' ? 'Blog Post' : 'Project'} • {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
              {activity.type === 'post' && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Eye className="h-4 w-4" />
                  <span>{activity.views}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;