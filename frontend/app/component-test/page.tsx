/**
 * Component Test Page
 * 组件测试页面 - 测试 Table, Select, ContentPreview 组件
 */

'use client';

import React, { useState } from 'react';
import { Table, Select, ContentPreview } from '@/components';
import type { Column } from '@/components/ui/Table';
import type { Option } from '@/components/ui/Select';

interface TableDataRow {
  id: number;
  title: string;
  category: string;
  status: string;
  updatedAt: string;
}

export default function ComponentTestPage() {
  // ============================================================================
  // State
  // ============================================================================
  const [tablePage, setTablePage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<TableDataRow[]>([]);

  // ============================================================================
  // Mock Data
  // ============================================================================

  // Table Data
  const tableColumns: Column[] = [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      sortable: true,
    },
    {
      key: 'title',
      title: 'Knowledge Title',
      dataIndex: 'title',
      sortable: true,
    },
    {
      key: 'category',
      title: 'Category',
      dataIndex: 'category',
      sortable: true,
      render: (value) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          {String(value)}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: (value) => {
        const colors: Record<string, string> = {
          Active: 'bg-green-100 text-green-700',
          Pending: 'bg-yellow-100 text-yellow-700',
          Inactive: 'bg-gray-100 text-gray-700',
        };
        const statusValue = String(value);
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[statusValue]}`}>
            {statusValue}
          </span>
        );
      },
    },
    {
      key: 'updatedAt',
      title: 'Updated',
      dataIndex: 'updatedAt',
      sortable: true,
    },
  ];

  const tableData = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Knowledge Item ${i + 1}: ${['Product Features', 'User Guide', 'FAQ', 'Troubleshooting', 'Tutorial'][i % 5]}`,
    category: ['Product', 'Feature', 'FAQ', 'Tutorial'][i % 4],
    status: ['Active', 'Pending', 'Inactive'][i % 3],
    updatedAt: new Date(2024, 9, (i % 28) + 1).toLocaleDateString(),
  }));

  // Select Options
  const categoryOptions: Option[] = [
    { label: 'Product', value: 'product' },
    { label: 'Feature', value: 'feature' },
    { label: 'FAQ', value: 'faq' },
    { label: 'Tutorial', value: 'tutorial' },
    { label: 'Guide', value: 'guide' },
  ];

  const productOptions: Option[] = [
    { label: 'Liberty 4 NC', value: 'liberty4nc' },
    { label: 'Liberty 3 Pro', value: 'liberty3pro' },
    { label: 'Space One', value: 'spaceone' },
    { label: 'Space Q45', value: 'spaceq45' },
    { label: 'AeroFit', value: 'aerofit' },
    { label: 'AeroFit Pro', value: 'aerofitpro' },
  ];

  // ContentPreview Data
  const contentItems = [
    {
      id: '1',
      title: 'Liberty 4 NC vs Sony WF-1000XM5: Ultimate Comparison',
      description: 'A comprehensive comparison of two flagship TWS earbuds, analyzing ANC performance, sound quality, and value proposition.',
      thumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
      seoScore: 92,
      readabilityScore: 78,
      status: 'published' as const,
      author: 'Sarah Chen',
      updatedAt: new Date(2024, 9, 14),
      tags: ['Comparison', 'TWS', 'ANC'],
    },
    {
      id: '2',
      title: 'New Color Alert: Liberty 4 NC in Midnight Blue',
      description: 'Introducing our latest color way - perfect for style-conscious audiophiles.',
      thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      seoScore: 85,
      readabilityScore: 95,
      status: 'scheduled' as const,
      author: 'Marketing Team',
      updatedAt: new Date(2024, 9, 15),
      tags: ['Product Launch', 'Social Media'],
    },
    {
      id: '3',
      title: 'Welcome to Soundcore - Your Audio Journey Starts Here',
      description: 'Thank you for joining the Soundcore family. Discover our best-selling products.',
      seoScore: 88,
      readabilityScore: 88,
      status: 'draft' as const,
      author: 'Email Team',
      updatedAt: new Date(2024, 9, 16),
      tags: ['Welcome Series', 'EDM'],
    },
  ];

  // ============================================================================
  // Handlers
  // ============================================================================

  const handleTablePageChange = (page: number) => {
    setTablePage(page);
    console.log('Table page changed to:', page);
  };

  const handleRowSelectionChange = (_keys: React.Key[], rows: TableDataRow[]) => {
    setSelectedRows(rows);
    console.log('Selected rows:', rows);
  };

  const handleContentEdit = (id: string) => {
    console.log('Edit content:', id);
    alert(`Editing content: ${id}`);
  };

  const handleContentPublish = (id: string) => {
    console.log('Publish content:', id);
    alert(`Publishing content: ${id}`);
  };

  const handleContentDelete = (id: string) => {
    console.log('Delete content:', id);
    if (confirm('Are you sure you want to delete this content?')) {
      alert(`Deleted content: ${id}`);
    }
  };

  const handleContentPreview = (id: string) => {
    console.log('Preview content:', id);
    alert(`Previewing content: ${id}`);
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Component Test Page</h1>
          <p className="mt-2 text-gray-600">
            Testing Table, Select, and ContentPreview components
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        {/* ===== TABLE COMPONENT TEST ===== */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Table Component</h2>
            <p className="text-gray-600">
              Enterprise-grade data table with sorting, selection, and pagination
            </p>
          </div>

          {selectedRows.length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-900 font-medium">
                {selectedRows.length} row(s) selected
              </p>
            </div>
          )}

          <Table
            columns={tableColumns}
            dataSource={tableData}
            rowKey="id"
            hoverable
            pagination={{
              current: tablePage,
              pageSize: 10,
              total: tableData.length,
              onChange: handleTablePageChange,
            }}
            rowSelection={{
              selectedRowKeys: selectedRows.map((r) => r.id),
              onChange: handleRowSelectionChange,
            }}
          />
        </section>

        {/* ===== SELECT COMPONENT TEST ===== */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Component</h2>
            <p className="text-gray-600">
              Flexible dropdown with single/multiple selection and search
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Single Select */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Single Select</h3>
              <Select
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value as string)}
                options={categoryOptions}
                placeholder="Select a category"
                searchable
                clearable
              />
              {selectedCategory && (
                <p className="mt-3 text-sm text-gray-600">
                  Selected: <span className="font-medium">{selectedCategory}</span>
                </p>
              )}
            </div>

            {/* Multiple Select */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Multiple Select</h3>
              <Select
                value={selectedProducts}
                onChange={(value) => setSelectedProducts(value as string[])}
                options={productOptions}
                placeholder="Select products"
                multiple
                searchable
                clearable
                maxTagCount={2}
              />
              {selectedProducts.length > 0 && (
                <p className="mt-3 text-sm text-gray-600">
                  Selected: <span className="font-medium">{selectedProducts.length} product(s)</span>
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ===== CONTENTPREVIEW COMPONENT TEST ===== */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">ContentPreview Component</h2>
            <p className="text-gray-600">
              Rich content cards with thumbnails, scores, and quick actions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentItems.map((item) => (
              <ContentPreview
                key={item.id}
                {...item}
                onEdit={() => handleContentEdit(item.id)}
                onPublish={() => handleContentPublish(item.id)}
                onDelete={() => handleContentDelete(item.id)}
                onPreview={() => handleContentPreview(item.id)}
              />
            ))}
          </div>
        </section>

        {/* Test Summary */}
        <section className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Test Summary</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Table:</span> {selectedRows.length} rows selected, page {tablePage}
            </p>
            <p>
              <span className="font-medium">Single Select:</span> {selectedCategory || 'None'}
            </p>
            <p>
              <span className="font-medium">Multiple Select:</span> {selectedProducts.length} products selected
            </p>
            <p>
              <span className="font-medium">ContentPreview:</span> {contentItems.length} items displayed
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
