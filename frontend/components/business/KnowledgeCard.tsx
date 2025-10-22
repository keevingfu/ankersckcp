import React from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '../ui/Card';

export type KnowledgeStatus = 'FAQ' | 'Guide' | 'Spec' | 'Tutorial';

export interface Knowledge {
  id: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  lastUpdated: string;
  views: number;
  likes: number;
  status: string;
  confidence: number;
}

export interface KnowledgeCardProps {
  id?: string;
  title?: string;
  content?: string;
  type?: KnowledgeStatus;
  product?: string;
  language?: string;
  qualityScore?: number;
  updatedAt?: string;
  knowledge?: Knowledge;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

const KnowledgeCard: React.FC<KnowledgeCardProps> = ({
  id: _propId,
  title: propTitle,
  content: propContent,
  type: propType,
  product: propProduct,
  language: propLanguage,
  qualityScore: propQualityScore,
  updatedAt: propUpdatedAt,
  knowledge,
  onClick: _onClick,
  onEdit,
  onDelete,
  onView,
}) => {
  // Use knowledge object if provided, otherwise use individual props
  const title = knowledge?.title || propTitle || '';
  const content = knowledge?.summary || propContent || '';
  const type = propType || 'Guide';
  const product = propProduct || knowledge?.category || '';
  const language = propLanguage || '';
  const qualityScore = propQualityScore || knowledge?.confidence || 0;
  const updatedAt = propUpdatedAt || knowledge?.lastUpdated || '';

  const typeColors = {
    FAQ: 'bg-blue-100 text-blue-700',
    Guide: 'bg-green-100 text-green-700',
    Spec: 'bg-purple-100 text-purple-700',
    Tutorial: 'bg-orange-100 text-orange-700',
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <Card variant="hoverable" padding="medium">
      <CardHeader
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        }
        actions={
          <div className="relative group">
            {/* Increased touch target to 44px minimum */}
            <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-all active:scale-95 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="py-1">
                {onView && (
                  <button
                    onClick={onView}
                    className="w-full text-left px-4 py-3 min-h-[44px] text-sm text-gray-700 hover:bg-purple-50 active:bg-purple-100 flex items-center gap-2 touch-manipulation transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="w-full text-left px-4 py-3 min-h-[44px] text-sm text-gray-700 hover:bg-purple-50 active:bg-purple-100 flex items-center gap-2 touch-manipulation transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={onDelete}
                    className="w-full text-left px-4 py-3 min-h-[44px] text-sm text-red-600 hover:bg-red-50 active:bg-red-100 flex items-center gap-2 touch-manipulation transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        }
      >
        {title}
      </CardHeader>

      <CardBody>
        <p className="text-gray-600 line-clamp-3 mb-4">{content}</p>
        
        <div className="flex flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[type]}`}>
            {type}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {product}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {language}
          </span>
        </div>
      </CardBody>

      <CardFooter>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-500">Quality:</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[120px]">
                <div
                  className={`h-full ${getQualityColor(qualityScore)} transition-all duration-300`}
                  style={{ width: `${qualityScore}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700">{qualityScore}%</span>
            </div>
          </div>
          <span className="text-xs text-gray-500">{updatedAt}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default KnowledgeCard;
