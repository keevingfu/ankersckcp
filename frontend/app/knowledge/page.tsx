/**
 * Knowledge Base Page - 知识库页面
 * 展示、搜索和管理知识库内容
 */

'use client';

import React, { useState } from 'react';
import { mutate } from 'swr';
import MainLayout from '@/components/ui/MainLayout';
import KnowledgeCard, { Knowledge } from '@/components/business/KnowledgeCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { useKnowledgeItems, useKnowledgeStats, deleteKnowledgeItem } from '@/lib/swr';
import type { KnowledgeItem, KnowledgeType, KnowledgeStatus } from '@/lib/api/types';

const KnowledgeBasePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'latest' | 'views' | 'likes' | 'quality'>('latest');

  // Fetch knowledge items using SWR
  const { data: knowledgeData, error, isLoading: loading } = useKnowledgeItems({
    page,
    page_size: 20,
    types: selectedCategory !== 'all' ? [(selectedCategory as KnowledgeType)] : undefined,
    status: selectedStatus !== 'all' ? [(selectedStatus as KnowledgeStatus)] : undefined,
  });

  // Fetch statistics for category counts
  const { data: stats } = useKnowledgeStats();

  // Convert API data to component format
  const knowledgeList: Knowledge[] = (knowledgeData?.items || []).map((item: KnowledgeItem) => ({
    id: String(item.id),
    title: item.title,
    summary: item.content.substring(0, 200) + (item.content.length > 200 ? '...' : ''),
    category: item.type,
    tags: item.tags || [],
    lastUpdated: new Date(item.updated_at).toISOString().split('T')[0],
    views: item.view_count,
    likes: item.like_count,
    status: item.status,
    confidence: Math.round(item.quality_score),
  }));

  // Category counts
  const categories = [
    { id: 'all', label: 'All Categories', count: stats?.total_items || 0 },
    { id: 'faq', label: 'FAQ', count: stats?.items_by_type?.faq || 0 },
    { id: 'guide', label: 'Guide', count: stats?.items_by_type?.guide || 0 },
    { id: 'troubleshooting', label: 'Troubleshooting', count: stats?.items_by_type?.troubleshooting || 0 },
    { id: 'technical', label: 'Technical', count: stats?.items_by_type?.technical || 0 },
  ];

  // Client-side search filtering (for demo - ideally should be server-side)
  const filteredKnowledge = knowledgeList.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return item.title.toLowerCase().includes(query) ||
           item.summary.toLowerCase().includes(query) ||
           item.tags.some((tag: string) => tag.toLowerCase().includes(query));
  });

  // Sort filtered knowledge
  const sortedKnowledge = [...filteredKnowledge].sort((a, b) => {
    switch (sortBy) {
      case 'views':
        return b.views - a.views;
      case 'likes':
        return b.likes - a.likes;
      case 'quality':
        return b.confidence - a.confidence;
      case 'latest':
      default:
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    }
  });

  // Handle delete with SWR mutation
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this knowledge item?')) {
      try {
        await deleteKnowledgeItem(Number(id));
        // Revalidate the knowledge items list
        mutate(['knowledge-items', {
          page,
          page_size: 20,
          types: selectedCategory !== 'all' ? [(selectedCategory as KnowledgeType)] : undefined,
          status: selectedStatus !== 'all' ? [(selectedStatus as KnowledgeStatus)] : undefined,
        }]);
        // Also revalidate stats
        mutate('knowledge-stats');
      } catch (err) {
        console.error('Failed to delete knowledge item:', err);
        alert('Failed to delete knowledge item. Please try again.');
      }
    }
  };

  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  return (
    <MainLayout>
      {/* Page Header - Optimized for mobile */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Knowledge Base</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
              Browse and manage your knowledge repository
            </p>
          </div>

          <Button variant="primary" size="medium" onClick={() => setShowAddModal(true)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline ml-2">Add Knowledge</span>
            <span className="sm:hidden ml-2">Add</span>
          </Button>
        </div>
      </div>

      {/* Error Alert - Optimized padding */}
      {error && (
        <div className="mx-4 sm:mx-8 mt-4 sm:mt-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">Failed to load knowledge items</h3>
                <p className="text-sm text-red-700 mt-1">{String(error)}</p>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => mutate(['knowledge-items', {
                    page,
                    page_size: 20,
                    types: selectedCategory !== 'all' ? [(selectedCategory as KnowledgeType)] : undefined,
                    status: selectedStatus !== 'all' ? [(selectedStatus as KnowledgeStatus)] : undefined,
                  }])}
                  className="mt-3"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            size="medium"
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="w-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="ml-2">Filters</span>
          </Button>
        </div>

        <div className="flex gap-4 sm:gap-6">
          {/* Left Sidebar - Filters - Hidden on mobile, shown on lg+ */}
          <div className={`
            ${showMobileSidebar ? 'block' : 'hidden'} lg:block
            w-full lg:w-64 flex-shrink-0 mb-6 lg:mb-0
          `}>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:sticky lg:top-24">
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
          <div className="flex-1 min-w-0">
            {/* Search and Controls - Optimized for mobile */}
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <div className="flex-1">
                  <Input
                    variant="search"
                    placeholder="Search knowledge..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    clearable
                  />
                </div>

                <div className="flex items-center justify-end space-x-2">
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

            {/* Results Count - Optimized for mobile */}
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-gray-600">
                Showing <span className="font-semibold">{sortedKnowledge.length}</span> result{sortedKnowledge.length !== 1 ? 's' : ''}
                {knowledgeData && knowledgeData.total > sortedKnowledge.length && (
                  <span className="ml-1 hidden sm:inline">of {knowledgeData.total} total</span>
                )}
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'latest' | 'views' | 'likes' | 'quality')}
                className="w-full sm:w-auto text-xs sm:text-sm border border-gray-200 rounded-lg px-3 py-2 sm:py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="latest">Sort by: Latest</option>
                <option value="views">Sort by: Most Viewed</option>
                <option value="likes">Sort by: Most Liked</option>
                <option value="quality">Sort by: Highest Confidence</option>
              </select>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                  <p className="text-gray-600">Loading knowledge items...</p>
                </div>
              </div>
            )}

            {/* Knowledge Grid/List - Optimized for all screen sizes */}
            {!loading && !error && (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6'
                  : 'space-y-3 sm:space-y-4'
              }>
                {sortedKnowledge.map((knowledge) => (
                  <KnowledgeCard
                    key={knowledge.id}
                    knowledge={knowledge}
                    onClick={() => console.log('View knowledge:', knowledge.id)}
                    onEdit={() => console.log('Edit knowledge:', knowledge.id)}
                    onDelete={() => handleDelete(knowledge.id)}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && sortedKnowledge.length === 0 && (
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

            {/* Pagination */}
            {!loading && !error && knowledgeData && knowledgeData.total_pages > 1 && (
              <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
                <div className="text-sm text-gray-600">
                  Page {knowledgeData.page} of {knowledgeData.total_pages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => setPage(page + 1)}
                    disabled={page === knowledgeData.total_pages}
                  >
                    Next
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
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
