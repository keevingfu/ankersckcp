/**
 * Table Component - Complete Implementation
 * 企业级数据表格组件 - 符合KCP设计系统规范
 */

'use client';

import React, { useState } from 'react';

// ============================================================================
// Types
// ============================================================================

export type SortDirection = 'asc' | 'desc' | null;

export interface Column<T = Record<string, unknown>> {
  key: string;
  title: string;
  dataIndex?: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
}

export interface TableProps<T = Record<string, unknown>> {
  columns: Column<T>[];
  dataSource: T[];
  rowKey?: string | ((record: T) => string);
  loading?: boolean;
  hoverable?: boolean;
  size?: 'small' | 'medium' | 'large';
  pagination?: PaginationConfig | false;
  rowSelection?: RowSelectionConfig<T>;
  emptyText?: React.ReactNode;
  className?: string;
}

export interface PaginationConfig {
  current?: number;
  pageSize?: number;
  total?: number;
  onChange?: (page: number, pageSize: number) => void;
}

export interface RowSelectionConfig<T = Record<string, unknown>> {
  selectedRowKeys?: React.Key[];
  onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
}

// ============================================================================
// Helper Components
// ============================================================================

const SortIcon: React.FC<{ direction: SortDirection }> = ({ direction }) => (
  <span className="ml-1 inline-flex flex-col">
    <svg className={`w-3 h-3 -mb-1 ${direction === 'asc' ? 'text-primary-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
      <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
    </svg>
    <svg className={`w-3 h-3 ${direction === 'desc' ? 'text-primary-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
      <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" />
    </svg>
  </span>
);

const LoadingSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ rows = 5, columns = 4 }) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <tr key={rowIndex} className="border-b border-gray-200">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <td key={colIndex} className="px-6 py-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

const EmptyState: React.FC<{ text?: React.ReactNode }> = ({ text }) => (
  <tr>
    <td colSpan={100} className="px-6 py-12 text-center">
      <div className="flex flex-col items-center text-gray-500">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-sm">{text || 'No Data'}</p>
      </div>
    </td>
  </tr>
);

// ============================================================================
// Pagination Component
// ============================================================================

const Pagination: React.FC<PaginationConfig> = ({ current = 1, pageSize = 10, total = 0, onChange }) => {
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== current) {
      onChange?.(page, pageSize);
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
      <div className="text-sm text-gray-600">
        Showing {Math.min((current - 1) * pageSize + 1, total)} to {Math.min(current * pageSize, total)} of {total} results
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(current - 1)}
          disabled={current === 1}
          className="px-3 py-2 text-sm rounded-md hover:bg-gray-100 disabled:opacity-50"
        >
          Previous
        </button>

        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 text-sm rounded-md ${page === current ? 'bg-primary-500 text-white' : 'hover:bg-gray-100'}`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => handlePageChange(current + 1)}
          disabled={current === totalPages}
          className="px-3 py-2 text-sm rounded-md hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// Main Table Component
// ============================================================================

export const Table = <T extends Record<string, unknown>>({
  columns,
  dataSource,
  rowKey = 'id',
  loading = false,
  hoverable = true,
  size = 'medium',
  pagination = false,
  rowSelection,
  emptyText,
  className = '',
}: TableProps<T>) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(rowSelection?.selectedRowKeys || []);

  const getRowKey = (record: T, index: number): React.Key => {
    if (typeof rowKey === 'function') return rowKey(record);
    const key = record[rowKey];
    if (typeof key === 'string' || typeof key === 'number') return key;
    return index;
  };

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc');
      if (sortDirection === 'desc') setSortColumn(null);
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    // Handle undefined or invalid dataSource
    if (!dataSource || !Array.isArray(dataSource)) return [];
    if (!sortColumn || !sortDirection) return dataSource;

    const column = columns.find(col => col.key === sortColumn);
    if (!column) return dataSource;

    const dataIndex = column.dataIndex || column.key;
    return [...dataSource].sort((a, b) => {
      const aVal = a[dataIndex];
      const bVal = b[dataIndex];
      // Handle comparison for different types
      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const comparison = aVal > bVal ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [dataSource, sortColumn, sortDirection, columns]);

  const handleSelectRow = (key: React.Key, checked: boolean) => {
    const newKeys = checked ? [...selectedKeys, key] : selectedKeys.filter(k => k !== key);
    setSelectedKeys(newKeys);
    rowSelection?.onChange?.(newKeys, sortedData.filter((r, i) => newKeys.includes(getRowKey(r, i))));
  };

  const cellPadding = { small: 'px-4 py-2', medium: 'px-6 py-4', large: 'px-8 py-6' }[size];

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {rowSelection && (
                <th className={cellPadding}>
                  <input type="checkbox" className="w-4 h-4 text-primary-500 rounded" />
                </th>
              )}
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`${cellPadding} font-semibold text-gray-700 text-${col.align || 'left'} ${col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.title}
                    {col.sortable && <SortIcon direction={sortColumn === col.key ? sortDirection : null} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <LoadingSkeleton rows={5} columns={columns.length + (rowSelection ? 1 : 0)} />
            ) : sortedData.length === 0 ? (
              <EmptyState text={emptyText} />
            ) : (
              sortedData.map((record, index) => {
                const key = getRowKey(record, index);
                const isSelected = selectedKeys.includes(key);
                
                return (
                  <tr key={key} className={`border-b border-gray-200 ${hoverable ? 'hover:bg-gray-50' : ''} ${isSelected ? 'bg-primary-50' : ''}`}>
                    {rowSelection && (
                      <td className={cellPadding}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={e => handleSelectRow(key, e.target.checked)}
                          className="w-4 h-4 text-primary-500 rounded"
                        />
                      </td>
                    )}
                    {columns.map(col => {
                      const value = record[col.dataIndex || col.key];
                      const content = col.render ? col.render(value, record, index) : (value as React.ReactNode);
                      return (
                        <td key={col.key} className={`${cellPadding} text-gray-900 text-${col.align || 'left'}`}>
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {pagination && !loading && sortedData.length > 0 && <Pagination {...pagination} />}
    </div>
  );
};

export default Table;
