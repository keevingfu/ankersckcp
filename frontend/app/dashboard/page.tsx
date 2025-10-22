'use client';

import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import KnowledgeCard from '@/components/business/KnowledgeCard';
import { useKnowledgeStats, useKnowledgeItems } from '@/lib/swr';
import type { KnowledgeItem } from '@/lib/api/types';

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon }) => {
  const trendColor = trend === 'up' ? 'text-green-500' : 'text-red-500';
  const trendIcon = trend === 'up' ? '↑' : '↓';

  return (
    <Card padding="medium" shadow="md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          <p className={`text-sm font-medium ${trendColor} flex items-center gap-1`}>
            <span>{trendIcon}</span>
            <span>{change}</span>
          </p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg text-purple-500">
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default function DashboardPage() {
  // Fetch knowledge stats using SWR
  const { data: statsData, isLoading: statsLoading } = useKnowledgeStats();

  // Fetch recent knowledge items using SWR
  const { data: knowledgeData, isLoading: knowledgeLoading } = useKnowledgeItems({
    page: 1,
    page_size: 3,
  });

  // Convert stats data to card format
  const stats = [
    {
      title: 'Total Knowledge Items',
      value: statsData?.total_items?.toLocaleString() || '-',
      change: '+12.5%',
      trend: 'up' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Published Items',
      value: statsData?.published_items?.toLocaleString() || '-',
      change: '+8.3%',
      trend: 'up' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      title: 'Total Views',
      value: statsData?.total_views?.toLocaleString() || '-',
      change: '+15.2%',
      trend: 'up' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Avg Quality Score',
      value: statsData?.avg_quality_score ? `${Math.round(statsData.avg_quality_score)}%` : '-',
      change: '+3.1%',
      trend: 'up' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  // Convert knowledge items to card format for KnowledgeCard component
  const recentKnowledge = (knowledgeData?.items || []).map((item: KnowledgeItem) => {
    // Map knowledge type to KnowledgeStatus for KnowledgeCard
    const typeMap: Record<string, 'FAQ' | 'Guide' | 'Spec' | 'Tutorial'> = {
      'faq': 'FAQ',
      'guide': 'Guide',
      'tutorial': 'Tutorial',
      'spec': 'Spec',
      'troubleshooting': 'Guide',
      'review': 'Guide',
    };

    return {
      id: String(item.id),
      title: item.title,
      content: item.content.substring(0, 150) + (item.content.length > 150 ? '...' : ''),
      type: typeMap[item.type] || 'Guide',
      product: item.product_id ? `Product ${item.product_id}` : 'General',
      language: item.language.toUpperCase(),
      qualityScore: Math.round(item.quality_score),
      updatedAt: new Date(item.updated_at).toISOString().split('T')[0],
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Optimized for mobile */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-sm sm:text-base text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Hide text on mobile, show icon only */}
              <Button variant="outline" size="medium" className="flex-1 sm:flex-initial">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden sm:inline ml-2">Export</span>
                <span className="sm:hidden ml-2">Export</span>
              </Button>
              <Button variant="primary" size="medium" className="flex-1 sm:flex-initial">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline ml-2">New Knowledge</span>
                <span className="sm:hidden ml-2">New</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Optimized padding for mobile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Grid - Optimized for all screen sizes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {statsLoading ? (
            // Loading skeleton for stats
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} padding="medium" shadow="md">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </Card>
            ))
          ) : (
            stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))
          )}
        </div>

        {/* Recent Knowledge */}
        <div className="mb-8">
          <Card padding="medium">
            <CardHeader
              actions={
                <Button variant="ghost" size="small">
                  View All
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              }
            >
              Recent Knowledge Items
            </CardHeader>
            <CardBody>
              {knowledgeLoading ? (
                // Loading skeleton for knowledge items
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} padding="medium" shadow="sm">
                      <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                        <div className="flex gap-2">
                          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {recentKnowledge.map((item) => (
                    <KnowledgeCard
                      key={item.id}
                      {...item}
                      onView={() => console.log('View', item.id)}
                      onEdit={() => console.log('Edit', item.id)}
                      onDelete={() => console.log('Delete', item.id)}
                    />
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Activity Chart Placeholder */}
        <Card padding="medium">
          <CardHeader>Activity Overview</CardHeader>
          <CardBody>
            <div className="h-64 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-purple-600 font-medium">Chart visualization will be displayed here</p>
                <p className="text-purple-400 text-sm mt-1">Using Recharts or Chart.js</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
