'use client';

import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import KnowledgeCard from '@/components/business/KnowledgeCard';

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
  // Sample data
  const stats = [
    {
      title: 'Total Knowledge Items',
      value: '2,847',
      change: '+12.5%',
      trend: 'up' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Content Generated',
      value: '342',
      change: '+8.3%',
      trend: 'up' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      title: 'Tickets Resolved',
      value: '1,289',
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
      value: '87%',
      change: '+3.1%',
      trend: 'up' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  const recentKnowledge = [
    {
      id: '1',
      title: 'How to pair Liberty 4 Pro with iOS devices',
      content: 'Step-by-step guide for pairing Soundcore Liberty 4 Pro earbuds with iPhone and iPad. Includes troubleshooting tips for common connection issues.',
      type: 'Guide' as const,
      product: 'Liberty 4 Pro',
      language: 'EN',
      qualityScore: 92,
      updatedAt: '2024-10-15',
    },
    {
      id: '2',
      title: 'Space A40 battery life specifications',
      content: 'Complete technical specifications for Space A40 battery performance, including playtime, charging time, and power consumption details.',
      type: 'Spec' as const,
      product: 'Space A40',
      language: 'EN',
      qualityScore: 88,
      updatedAt: '2024-10-14',
    },
    {
      id: '3',
      title: 'Troubleshooting connection drops',
      content: 'Common solutions for Bluetooth connection issues with Soundcore devices. Covers interference, distance, and firmware update procedures.',
      type: 'FAQ' as const,
      product: 'General',
      language: 'EN',
      qualityScore: 85,
      updatedAt: '2024-10-13',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </Button>
              <Button variant="primary" size="medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Knowledge
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
