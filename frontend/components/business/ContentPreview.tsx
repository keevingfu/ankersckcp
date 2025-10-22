/**
 * ContentPreview Component
 * 内容预览卡片组件 - 用于内容生成器和知识库
 * 
 * Features:
 * - Thumbnail display (16:9 ratio)
 * - SEO & Readability scores
 * - Action buttons (Edit, Publish, Delete)
 * - Hover preview effect
 * - Loading state
 */

'use client';

import React from 'react';
import Image from 'next/image';

// ============================================================================
// Types
// ============================================================================

export interface ContentPreviewProps {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  seoScore?: number;
  readabilityScore?: number;
  status?: 'draft' | 'published' | 'scheduled';
  author?: string;
  updatedAt?: Date | string;
  tags?: string[];
  onEdit?: () => void;
  onPublish?: () => void;
  onDelete?: () => void;
  onPreview?: () => void;
  loading?: boolean;
  className?: string;
}

// ============================================================================
// Helper Components
// ============================================================================

const ScoreBadge: React.FC<{ label: string; score: number }> = ({ label, score }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-700 bg-green-100';
    if (score >= 60) return 'text-yellow-700 bg-yellow-100';
    if (score >= 40) return 'text-orange-700 bg-orange-100';
    return 'text-red-700 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return '✓';
    if (score >= 60) return '!';
    return '✕';
  };

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getScoreColor(score)}`}>
      <span>{getScoreIcon(score)}</span>
      <span>{label}:</span>
      <span className="font-semibold">{score}%</span>
    </div>
  );
};

const StatusBadge: React.FC<{ status: 'draft' | 'published' | 'scheduled' }> = ({ status }) => {
  const styles = {
    draft: 'bg-gray-100 text-gray-700',
    published: 'bg-green-100 text-green-700',
    scheduled: 'bg-blue-100 text-blue-700',
  };

  const labels = {
    draft: 'Draft',
    published: 'Published',
    scheduled: 'Scheduled',
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const ActionButton: React.FC<{
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}> = ({ onClick, icon, label, variant = 'secondary', disabled }) => {
  const variants = {
    primary: 'text-white bg-primary-500 hover:bg-primary-600',
    secondary: 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50',
    danger: 'text-red-700 bg-white border border-red-300 hover:bg-red-50',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
        transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

// ============================================================================
// Icons
// ============================================================================

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const PublishIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

// ============================================================================
// Loading Skeleton
// ============================================================================

const ContentPreviewSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
    <div className="aspect-video bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="flex gap-2 pt-2">
        <div className="h-8 bg-gray-200 rounded w-24" />
        <div className="h-8 bg-gray-200 rounded w-24" />
      </div>
    </div>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

export const ContentPreview: React.FC<ContentPreviewProps> = ({
  id: _id,
  title,
  description,
  thumbnail,
  seoScore,
  readabilityScore,
  status = 'draft',
  author,
  updatedAt,
  tags = [],
  onEdit,
  onPublish,
  onDelete,
  onPreview,
  loading = false,
  className = '',
}) => {
  // Format date
  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d);
  };

  // Loading state
  if (loading) {
    return <ContentPreviewSkeleton />;
  }

  return (
    <div
      className={`
        group relative bg-white rounded-lg shadow-sm overflow-hidden
        border border-gray-200 transition-all hover:shadow-md
        ${className}
      `}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Preview Overlay */}
        {onPreview && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={onPreview}
              className="px-4 py-2 bg-white rounded-lg text-gray-900 font-medium flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-transform"
            >
              <EyeIcon />
              Preview
            </button>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-500 cursor-pointer">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Scores */}
        {(seoScore !== undefined || readabilityScore !== undefined) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {seoScore !== undefined && <ScoreBadge label="SEO" score={seoScore} />}
            {readabilityScore !== undefined && <ScoreBadge label="Readability" score={readabilityScore} />}
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-3 border-b border-gray-200">
          <span>
            {author && <span className="font-medium">{author}</span>}
            {author && updatedAt && <span className="mx-1">•</span>}
            {updatedAt && <span>{formatDate(updatedAt)}</span>}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {onEdit && (
            <ActionButton
              onClick={onEdit}
              icon={<EditIcon />}
              label="Edit"
              variant="secondary"
            />
          )}
          {onPublish && status !== 'published' && (
            <ActionButton
              onClick={onPublish}
              icon={<PublishIcon />}
              label="Publish"
              variant="primary"
            />
          )}
          {onDelete && (
            <ActionButton
              onClick={onDelete}
              icon={<DeleteIcon />}
              label="Delete"
              variant="danger"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentPreview;
