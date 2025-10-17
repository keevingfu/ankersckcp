/**
 * Home Page
 * Landing page with navigation to all KCP features
 */

'use client';

import Link from 'next/link';
import {
  Network,
  FileText,
  MessageSquare,
  BarChart3,
  Database,
  LayoutDashboard,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface FeatureCard {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
}

const features: FeatureCard[] = [
  {
    title: 'Knowledge Graph',
    description: 'Visualize and explore knowledge relationships with interactive graph',
    href: '/knowledge-graph',
    icon: Network,
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Content Generator',
    description: 'AI-powered content creation with real-time preview and quality scoring',
    href: '/content-generator',
    icon: FileText,
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Smart Chat',
    description: 'Intelligent customer service with context-aware responses',
    href: '/smart-chat',
    icon: MessageSquare,
    color: 'text-green-600',
    gradient: 'from-green-500 to-green-600',
  },
  {
    title: 'Analytics',
    description: 'Comprehensive data visualization and insights dashboard',
    href: '/analytics',
    icon: BarChart3,
    color: 'text-orange-600',
    gradient: 'from-orange-500 to-orange-600',
  },
  {
    title: 'Knowledge Base',
    description: 'Centralized knowledge repository with advanced search',
    href: '/knowledge',
    icon: Database,
    color: 'text-indigo-600',
    gradient: 'from-indigo-500 to-indigo-600',
  },
  {
    title: 'Dashboard',
    description: 'Overview of system metrics and key performance indicators',
    href: '/dashboard',
    icon: LayoutDashboard,
    color: 'text-pink-600',
    gradient: 'from-pink-500 to-pink-600',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Soundcore KCP</h1>
                <p className="text-xs text-gray-500">Knowledge Control Plane</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            AI-Driven Enterprise
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Knowledge Operating System
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Unified knowledge hub enabling intelligent operations across all Soundcore brand touchpoints
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.href}
                href={feature.href}
                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                {/* Content */}
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <ArrowRight
                      className={`w-5 h-5 ${feature.color} opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300`}
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Knowledge Items', value: '100K+' },
            { label: 'Content Generated', value: '50K+' },
            { label: 'Daily Queries', value: '10K+' },
            { label: 'Accuracy Rate', value: '95%+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 Anker Soundcore. Built with Next.js 14 and Tailwind CSS.</p>
            <p className="mt-2">
              <Link href="/component-test" className="text-purple-600 hover:underline">
                Component Test Page
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
