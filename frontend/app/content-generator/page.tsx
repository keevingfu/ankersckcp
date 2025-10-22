/**
 * Content Generator Page
 * AI驱动的内容生成器页面
 * 
 * Features:
 * - Product selector
 * - Content type selection (SEO/Social/Email/Video)
 * - Tone and style options
 * - Length control
 * - Keyword tags input
 * - Real-time preview
 * - Quality score display
 * - Edit/Copy/Export actions
 * - Generation progress indicator
 */

'use client';

import React, { useState } from 'react';
import { Select } from '@/components';

// ============================================================================
// Types
// ============================================================================

type ContentType = 'seo' | 'social' | 'email' | 'video';
type ToneType = 'professional' | 'casual' | 'technical' | 'friendly';
type LengthType = 'short' | 'medium' | 'long';

interface GeneratorConfig {
  product: string;
  contentType: ContentType;
  tone: ToneType;
  length: LengthType;
  keywords: string[];
  targetAudience?: string;
  platform?: string;
}

interface GeneratedContent {
  title: string;
  content: string;
  seoScore: number;
  readabilityScore: number;
  wordCount: number;
  estimatedReadTime: string;
}

// ============================================================================
// Constants
// ============================================================================

const PRODUCTS = [
  { label: 'Liberty 4', value: 'liberty-4' },
  { label: 'Liberty 4 NC', value: 'liberty-4-nc' },
  { label: 'Space A40', value: 'space-a40' },
  { label: 'AeroFit', value: 'aerofit' },
  { label: 'Life Q30', value: 'life-q30' },
];

const CONTENT_TYPES = [
  { label: 'SEO Blog Article', value: 'seo', icon: '📝' },
  { label: 'Social Media Post', value: 'social', icon: '📱' },
  { label: 'Email Campaign', value: 'email', icon: '📧' },
  { label: 'Video Script', value: 'video', icon: '🎬' },
];

const TONE_OPTIONS = [
  { label: 'Professional', value: 'professional' },
  { label: 'Casual', value: 'casual' },
  { label: 'Technical', value: 'technical' },
  { label: 'Friendly', value: 'friendly' },
];

const LENGTH_OPTIONS = [
  { label: 'Short (300-500 words)', value: 'short' },
  { label: 'Medium (800-1200 words)', value: 'medium' },
  { label: 'Long (1500-2500 words)', value: 'long' },
];

// ============================================================================
// Helper Components
// ============================================================================

const SparklesIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

// ============================================================================
// Tag Input Component
// ============================================================================

const TagInput: React.FC<{
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}> = ({ tags, onChange, placeholder = 'Add keyword and press Enter...' }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        onChange([...tags, input.trim()]);
      }
      setInput('');
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 rounded text-sm"
          >
            {tag}
            <button
              onClick={() => removeTag(index)}
              className="hover:text-primary-900 transition-colors"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[150px] outline-none bg-transparent"
        />
      </div>
    </div>
  );
};

// ============================================================================
// Progress Bar Component
// ============================================================================

const ProgressBar: React.FC<{ progress: number; status: string }> = ({ progress, status }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-700 font-medium">{status}</span>
      <span className="text-gray-500">{progress}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div
        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-full rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

export default function ContentGeneratorPage() {
  // State
  const [config, setConfig] = useState<GeneratorConfig>({
    product: '',
    contentType: 'seo',
    tone: 'professional',
    length: 'medium',
    keywords: [],
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  // Mock generation function
  const handleGenerate = async () => {
    if (!config.product) {
      alert('Please select a product first');
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    // Simulate generation progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate API call
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      // Mock generated content
      setGeneratedContent({
        title: `Best Wireless Earbuds Under $100: ${PRODUCTS.find(p => p.value === config.product)?.label} Review`,
        content: `# Introduction

Wireless earbuds have revolutionized how we experience audio on the go. In this comprehensive review, we'll explore why the ${PRODUCTS.find(p => p.value === config.product)?.label} stands out as one of the best options under $100.

## Key Features

The ${PRODUCTS.find(p => p.value === config.product)?.label} combines premium sound quality with affordability. Here's what makes it special:

- **Active Noise Cancellation**: Industry-leading ANC technology blocks out 98% of ambient noise
- **Long Battery Life**: Up to 50 hours of playtime with the charging case
- **Comfortable Fit**: Ergonomic design ensures all-day comfort
- **Premium Sound**: LDAC codec support for Hi-Res audio

## Performance Analysis

In our testing, the ${PRODUCTS.find(p => p.value === config.product)?.label} exceeded expectations in every category. The sound profile is well-balanced with deep bass, clear mids, and crisp highs.

## Conclusion

For anyone seeking premium features without the premium price tag, the ${PRODUCTS.find(p => p.value === config.product)?.label} is an excellent choice. It delivers exceptional value and performance that rivals more expensive alternatives.`,
        seoScore: 85,
        readabilityScore: 78,
        wordCount: 178,
        estimatedReadTime: '2 min read',
      });

      setIsGenerating(false);
      setProgress(0);
    }, 3000);
  };

  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent.content);
      alert('Content copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (generatedContent) {
      const blob = new Blob([generatedContent.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedContent.title.toLowerCase().replace(/\s+/g, '-')}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleRegenerate = () => {
    setGeneratedContent(null);
    handleGenerate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900">Content Generator</h1>
        <p className="text-sm text-gray-600 mt-1">Generate high-quality content powered by AI</p>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Configuration */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Configuration</h2>

              <div className="space-y-6">
                {/* Product Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={PRODUCTS}
                    value={config.product}
                    onChange={(value) => setConfig({ ...config, product: value as string })}
                    placeholder="Select a product..."
                  />
                </div>

                {/* Content Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {CONTENT_TYPES.map(type => (
                      <button
                        key={type.value}
                        onClick={() => setConfig({ ...config, contentType: type.value as ContentType })}
                        className={`
                          flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all
                          ${config.contentType === type.value
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }
                        `}
                      >
                        <span className="text-2xl">{type.icon}</span>
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tone & Style
                  </label>
                  <Select
                    options={TONE_OPTIONS}
                    value={config.tone}
                    onChange={(value) => setConfig({ ...config, tone: value as ToneType })}
                  />
                </div>

                {/* Length */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Length
                  </label>
                  <Select
                    options={LENGTH_OPTIONS}
                    value={config.length}
                    onChange={(value) => setConfig({ ...config, length: value as LengthType })}
                  />
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Keywords
                  </label>
                  <TagInput
                    tags={config.keywords}
                    onChange={(keywords) => setConfig({ ...config, keywords })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Add keywords to optimize content for search engines
                  </p>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !config.product}
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <LoadingSpinner />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon />
                      <span>Generate Content</span>
                    </>
                  )}
                </button>

                {/* Progress Bar */}
                {isGenerating && (
                  <ProgressBar
                    progress={progress}
                    status="Analyzing product data and generating content..."
                  />
                )}
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Pro Tips</h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Use specific keywords for better SEO optimization</li>
                <li>• Match tone to your target audience</li>
                <li>• Longer content typically ranks better for SEO</li>
                <li>• Review and edit generated content before publishing</li>
              </ul>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Preview</h2>
                
                {generatedContent && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      <CopyIcon />
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Download as Markdown"
                    >
                      <DownloadIcon />
                    </button>
                    <button
                      onClick={handleRegenerate}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Regenerate"
                    >
                      <RefreshIcon />
                    </button>
                  </div>
                )}
              </div>

              {generatedContent ? (
                <div className="p-6 space-y-6">
                  {/* Quality Scores */}
                  <div className="flex gap-4">
                    <div className="flex-1 bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="text-xs font-medium text-green-700 mb-1">SEO Score</div>
                      <div className="text-2xl font-bold text-green-900">{generatedContent.seoScore}%</div>
                    </div>
                    <div className="flex-1 bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="text-xs font-medium text-blue-700 mb-1">Readability</div>
                      <div className="text-2xl font-bold text-blue-900">{generatedContent.readabilityScore}%</div>
                    </div>
                    <div className="flex-1 bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <div className="text-xs font-medium text-purple-700 mb-1">Word Count</div>
                      <div className="text-2xl font-bold text-purple-900">{generatedContent.wordCount}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="prose prose-sm max-w-none">
                    <h1 className="text-xl font-bold text-gray-900 mb-4">{generatedContent.title}</h1>
                    <div className="text-gray-700 whitespace-pre-wrap">{generatedContent.content}</div>
                  </div>

                  {/* Meta Info */}
                  <div className="pt-4 border-t border-gray-200 text-xs text-gray-500">
                    Estimated read time: {generatedContent.estimatedReadTime}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <SparklesIcon />
                  </div>
                  <p className="text-sm">Configure your settings and click "Generate Content" to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
