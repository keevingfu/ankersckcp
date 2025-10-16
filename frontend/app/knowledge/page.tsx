/**
 * Knowledge Base Page - 知识库页面
 * 展示、搜索和管理知识库内容
 */

'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/ui/MainLayout';
import KnowledgeCard, { Knowledge } from '@/components/business/KnowledgeCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

const KnowledgeBasePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data
  const knowledgeList: Knowledge[] = [
    {
      id: '1',
      title: 'Liberty 4 Pro Quick Start Guide',
      summary: 'Comprehensive guide for setting up and using Liberty 4 Pro earbuds including pairing, controls, and app setup.',
      category: 'Product Guide',
      tags: ['Liberty 4 Pro', 'Setup', 'Pairing'],
      lastUpdated: '2024-10-10',
      views: 1245,
      likes: 89,
      status: 'published',
      confidence: 98,
    },
    {
      id: '2',
      title: 'Soundcore App Setup Instructions',
      summary: 'Step-by-step instructions for downloading, installing, and configuring the Soundcore mobile app for iOS and Android.',
      category: 'App Guide',
      tags: ['App', 'Setup', 'iOS', 'Android'],
      lastUpdated: '2024-10-08',
      views: 1103,
      likes: 76,
      status: 'published',
      confidence: 95,
    },
    {
      id: '3',
      title: 'Noise Cancellation Technology Explained',
      summary: 'Technical overview of hybrid active noise cancellation technology used in Soundcore products.',
      category: 'Technical',
      tags: ['ANC', 'Technology', 'Features'],
      lastUpdated: '2024-10-05',
      views: 987,
      likes: 134,
      status: 'published',
      confidence: 92,
    },
    {
      id: '4',
      title: 'Battery Care Best Practices',
      summary: 'Tips and recommendations for extending battery life and maintaining optimal performance.',
      category: 'Support',
      tags: ['Battery', 'Maintenance', 'Tips'],
      lastUpdated: '2024-10-03',
      views: 856,
      likes: 67,
      status: 'published',
      confidence: 90,
    },
    {
      id: '5',
      title: 'Warranty & Support Information',
      summary: 'Complete warranty coverage details, claim process, and customer support contact information.',
      category: 'Support',
      tags: ['Warranty', 'Support', 'Policy'],
      lastUpdated: '2024-10-01',
      views: 734,
      likes: 45,
      status: 'published',
      confidence: 89,
    },
    {
      id: '6',
      title: 'Space A40 User Manual - Draft',
      summary: 'Draft version of comprehensive user manual for Space A40 over-ear headphones.',
      category: 'Product Guide',
      tags: ['Space A40', 'Manual', 'Draft'],
      lastUpdated: '2024-09-28',
      views: 234,
      likes: 12,
      status: 'draft',
      confidence: 75,
    },
  ];

  const categories = [
    { id: 'all', label: 'All Categories', count: knowledgeList.length },
    { id: 'product', label: 'Product Guide', count: 2 },
    { id: 'app', label: 'App Guide', count: 1 },
    { id: 'technical', label: 'Technical', count: 1 },
    { id: 'support', label: 'Support', count: 2 },
  ];

  const filteredKnowledge = knowledgeList.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
                           item.category.toLowerCase().replace(' ', '') === selectedCategory;
    
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
            <p className="text-sm text-gray-600 mt-2">
              Browse and manage your knowledge repository
            </p>
          </div>

          <Button variant="primary" size="medium" onClick={() => setShowAddModal(true)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="ml-2">Add Knowledge</span>
          </Button>
        </div>
      </div>

      <div className="p-8">
        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition
                        ${selectedCategory === category.id
                          ? 'bg-purple-50 text-purple-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <span>{category.label}</span>
                      <span className={`
                        px-2 py-0.5 rounded-full text-xs font-semibold
                        ${selectedCategory === category.id
                          ? 'bg-purple-200 text-purple-800'
                          : 'bg-gray-200 text-gray-600'
                        }
                      `}>
                        {category.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Status</h3>
                <ul className="space-y-2">
                  {[
                    { id: 'all', label: 'All Status' },
                    { id: 'published', label: 'Published' },
                    { id: 'draft', label: 'Draft' },
                    { id: 'archived', label: 'Archived' },
                  ].map((status) => (
                    <li key={status.id}>
                      <button
                        onClick={() => setSelectedStatus(status.id)}
                        className={`
                          w-full text-left px-3 py-2 rounded-lg text-sm transition
                          ${selectedStatus === status.id
                            ? 'bg-purple-50 text-purple-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                          }
                        `}
                      >
                        {status.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Controls */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    variant="search"
                    placeholder="Search knowledge by title, content, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    clearable
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`
                      p-2 rounded-lg transition
                      ${viewMode === 'grid'
                        ? 'bg-purple-100 text-purple-600'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                      }
                    `}
                    title="Grid view"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`
                      p-2 rounded-lg transition
                      ${viewMode === 'list'
                        ? 'bg-purple-100 text-purple-600'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                      }
                    `}
                    title="List view"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredKnowledge.length}</span> result{filteredKnowledge.length !== 1 ? 's' : ''}
              </p>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>Sort by: Latest</option>
                <option>Sort by: Most Viewed</option>
                <option>Sort by: Most Liked</option>
                <option>Sort by: Highest Confidence</option>
              </select>
            </div>

            {/* Knowledge Grid/List */}
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredKnowledge.map((knowledge) => (
                <KnowledgeCard
                  key={knowledge.id}
                  knowledge={knowledge}
                  onClick={() => console.log('View knowledge:', knowledge.id)}
                  onEdit={() => console.log('Edit knowledge:', knowledge.id)}
                  onDelete={() => console.log('Delete knowledge:', knowledge.id)}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredKnowledge.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No knowledge found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button variant="primary" onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Knowledge Modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Knowledge"
        size="large"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary">
              Create Knowledge
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="Enter knowledge title"
          />
          <Input
            label="Category"
            placeholder="Select category"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Summary
            </label>
            <textarea
              className="w-full rounded-md border border-gray-200 px-4 py-2 min-h-[100px] focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              placeholder="Enter a brief summary..."
            />
          </div>
          <Input
            label="Tags"
            placeholder="Add tags (comma separated)"
          />
        </div>
      </Modal>
    </MainLayout>
  );
};

export default KnowledgeBasePage;
