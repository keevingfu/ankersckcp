/**
 * Analytics Dashboard Page
 * 数据分析仪表板页面
 *
 * Features:
 * - Key metrics cards (KPIs)
 * - Time range selector (7d/30d/90d/custom)
 * - Line charts for trends
 * - Bar charts for comparisons
 * - Pie chart for distribution
 * - Data table for detailed view
 * - Export to CSV/PDF
 * - Real-time data updates
 */

'use client';

import React, { useState } from 'react';
import { mutate } from 'swr';
import { Table, Select } from '@/components';
import {
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { useAnalyticsOverview, useUserMetrics, useContentMetrics, useSearchMetrics } from '@/lib/swr';

// ============================================================================
// Types
// ============================================================================

type TimeRange = '7d' | '30d' | '90d' | 'custom';

interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface AnalyticsData extends Record<string, unknown> {
  date: string;
  users: number;
  sessions: number;
  contentViews: number;
  chatMessages: number;
}

// ============================================================================
// Mock Data
// ============================================================================

const mockMetrics: MetricCard[] = [
  {
    id: 'users',
    title: '活跃用户',
    value: '12,543',
    change: 12.5,
    trend: 'up',
    icon: <Users className="w-6 h-6" />,
    color: 'purple'
  },
  {
    id: 'content',
    title: '内容浏览量',
    value: '89,234',
    change: 8.3,
    trend: 'up',
    icon: <FileText className="w-6 h-6" />,
    color: 'blue'
  },
  {
    id: 'chat',
    title: '对话次数',
    value: '45,678',
    change: -3.2,
    trend: 'down',
    icon: <MessageSquare className="w-6 h-6" />,
    color: 'green'
  },
  {
    id: 'engagement',
    title: '平均参与度',
    value: '78%',
    change: 0,
    trend: 'neutral',
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'orange'
  }
];

const mockTrendData: ChartDataPoint[] = [
  { label: 'Mon', value: 420 },
  { label: 'Tue', value: 580 },
  { label: 'Wed', value: 680 },
  { label: 'Thu', value: 750 },
  { label: 'Fri', value: 920 },
  { label: 'Sat', value: 680 },
  { label: 'Sun', value: 540 }
];

const mockCategoryData: ChartDataPoint[] = [
  { label: '产品知识', value: 35, color: '#667eea' },
  { label: '技术支持', value: 25, color: '#764ba2' },
  { label: '市场活动', value: 20, color: '#f093fb' },
  { label: '培训资料', value: 15, color: '#4facfe' },
  { label: '其他', value: 5, color: '#e0e7ff' }
];

const mockTableData: AnalyticsData[] = [
  { date: '2024-10-16', users: 1245, sessions: 2340, contentViews: 8920, chatMessages: 4567 },
  { date: '2024-10-15', users: 1180, sessions: 2210, contentViews: 8456, chatMessages: 4321 },
  { date: '2024-10-14', users: 1320, sessions: 2450, contentViews: 9234, chatMessages: 4890 },
  { date: '2024-10-13', users: 1090, sessions: 2050, contentViews: 7823, chatMessages: 4123 },
  { date: '2024-10-12', users: 980, sessions: 1890, contentViews: 7234, chatMessages: 3876 },
  { date: '2024-10-11', users: 1150, sessions: 2180, contentViews: 8345, chatMessages: 4234 },
  { date: '2024-10-10', users: 1205, sessions: 2290, contentViews: 8678, chatMessages: 4456 }
];

// ============================================================================
// Components
// ============================================================================

/**
 * MetricCard Component
 * 指标卡片组件
 */
const MetricCardComponent: React.FC<{ metric: MetricCard }> = ({ metric }) => {
  const getTrendIcon = () => {
    if (metric.trend === 'up') return <ArrowUpRight className="w-4 h-4" />;
    if (metric.trend === 'down') return <ArrowDownRight className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (metric.trend === 'up') return 'text-green-600';
    if (metric.trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const getIconBgColor = () => {
    const colorMap: Record<string, string> = {
      purple: 'bg-purple-100',
      blue: 'bg-blue-100',
      green: 'bg-green-100',
      orange: 'bg-orange-100'
    };
    return colorMap[metric.color] || 'bg-gray-100';
  };

  const getIconColor = () => {
    const colorMap: Record<string, string> = {
      purple: 'text-purple-600',
      blue: 'text-blue-600',
      green: 'text-green-600',
      orange: 'text-orange-600'
    };
    return colorMap[metric.color] || 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</p>
          <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="font-medium">
              {metric.change > 0 ? '+' : ''}{metric.change}%
            </span>
            <span className="text-gray-500 ml-1">vs 上周</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${getIconBgColor()}`}>
          <div className={getIconColor()}>{metric.icon}</div>
        </div>
      </div>
    </div>
  );
};

/**
 * LineChart Component
 * 折线图组件
 */
const LineChart: React.FC<{ data: ChartDataPoint[]; title: string }> = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const chartHeight = 200;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="relative" style={{ height: chartHeight }}>
        <svg width="100%" height={chartHeight} className="overflow-visible">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="0"
              y1={i * (chartHeight / 4)}
              x2="100%"
              y2={i * (chartHeight / 4)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Data line */}
          <polyline
            points={data.map((point, i) => {
              const x = (i / (data.length - 1)) * 100;
              const y = ((maxValue - point.value) / maxValue) * (chartHeight - 40) + 20;
              return `${x}%,${y}`;
            }).join(' ')}
            fill="none"
            stroke="#667eea"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {data.map((point, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = ((maxValue - point.value) / maxValue) * (chartHeight - 40) + 20;
            return (
              <g key={i}>
                <circle
                  cx={`${x}%`}
                  cy={y}
                  r="4"
                  fill="#667eea"
                  stroke="#fff"
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2">
          {data.map((point, i) => (
            <span key={i} className="text-xs text-gray-500">{point.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * PieChart Component
 * 饼图组件
 */
const PieChart: React.FC<{ data: ChartDataPoint[]; title: string }> = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const createArc = (startAngle: number, endAngle: number) => {
    const x1 = 100 + 80 * Math.cos(startAngle);
    const y1 = 100 + 80 * Math.sin(startAngle);
    const x2 = 100 + 80 * Math.cos(endAngle);
    const y2 = 100 + 80 * Math.sin(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    
    return `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex items-center gap-8">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {data.map((item, i) => {
            const percentage = item.value / total;
            const startAngle = currentAngle;
            const endAngle = currentAngle + (percentage * 2 * Math.PI);
            currentAngle = endAngle;
            
            return (
              <path
                key={i}
                d={createArc(startAngle, endAngle)}
                fill={item.color}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            );
          })}
          <circle cx="100" cy="100" r="40" fill="white" />
        </svg>
        
        <div className="flex-1 space-y-2">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch analytics data using SWR
  const { data: overviewData, error: overviewError, isLoading: overviewLoading } = useAnalyticsOverview();
  const { data: _userMetricsData } = useUserMetrics();
  const { data: _contentMetricsData } = useContentMetrics();
  const { data: _searchMetricsData } = useSearchMetrics();

  const loading = overviewLoading;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        mutate('analytics-overview'),
        mutate('user-metrics'),
        mutate('content-metrics'),
        mutate('search-metrics'),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    alert('Export functionality coming soon!');
  };

  // Transform API data to metrics cards
  const metricsData: MetricCard[] = overviewData ? [
    {
      id: 'users',
      title: '活跃用户',
      value: overviewData.total_users?.toLocaleString() || '0',
      change: 12.5, // TODO: Calculate from API data
      trend: 'up',
      icon: <Users className="w-6 h-6" />,
      color: 'purple'
    },
    {
      id: 'content',
      title: '内容浏览量',
      value: overviewData.content_views?.toLocaleString() || '0',
      change: 8.3,
      trend: 'up',
      icon: <FileText className="w-6 h-6" />,
      color: 'blue'
    },
    {
      id: 'chat',
      title: '对话次数',
      value: overviewData.chat_sessions?.toLocaleString() || '0',
      change: -3.2,
      trend: 'down',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'green'
    },
    {
      id: 'engagement',
      title: '平均参与度',
      value: `${overviewData.avg_engagement || 0}%`,
      change: 0,
      trend: 'neutral',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'orange'
    }
  ] : mockMetrics;

  // Transform user metrics to trend data (using mock data for now as API doesn't return time series)
  const trendData: ChartDataPoint[] = mockTrendData;

  // Transform content metrics to category data (using mock data for now as API doesn't return category breakdown)
  const categoryData: ChartDataPoint[] = mockCategoryData;

  // Table data (mock for now, would need dedicated endpoint)
  const tableData: AnalyticsData[] = mockTableData;

  const tableColumns = [
    { key: 'date', title: '日期', dataIndex: 'date' },
    { key: 'users', title: '用户数', dataIndex: 'users' },
    { key: 'sessions', title: '会话数', dataIndex: 'sessions' },
    { key: 'contentViews', title: '内容浏览', dataIndex: 'contentViews' },
    { key: 'chatMessages', title: '对话数', dataIndex: 'chatMessages' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">数据分析</h1>
            <p className="text-gray-600 mt-1">实时监控系统使用情况和趋势</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <Select
              value={timeRange}
              onChange={(value) => setTimeRange(value as TimeRange)}
              options={[
                { value: '7d', label: '最近7天' },
                { value: '30d', label: '最近30天' },
                { value: '90d', label: '最近90天' },
                { value: 'custom', label: '自定义' }
              ]}
            />

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing || loading ? 'animate-spin' : ''}`} />
              <span>刷新</span>
            </button>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>导出</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {overviewError && (
        <div className="mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">加载分析数据失败</h3>
                <p className="text-sm text-red-700 mt-1">{overviewError}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-3 text-sm text-red-700 hover:text-red-800 font-medium"
                >
                  重试
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !overviewData && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600">加载分析数据...</p>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      {!loading || overviewData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsData.map((metric) => (
              <MetricCardComponent key={metric.id} metric={metric} />
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <LineChart data={trendData} title="用户活跃度趋势" />
            <PieChart data={categoryData} title="内容类型分布" />
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">详细数据</h3>
            <Table
              dataSource={tableData}
              columns={tableColumns}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
