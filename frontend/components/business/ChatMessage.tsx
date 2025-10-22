/**
 * ChatMessage Component
 * 聊天消息气泡组件 - 用于智能客服界面
 * 
 * Features:
 * - User & AI message styles
 * - Avatar display
 * - Timestamp
 * - Message actions (Like, Copy, Regenerate)
 * - Markdown support
 * - Code block highlighting
 * - Typing animation
 * - Loading state
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// ============================================================================
// Types
// ============================================================================

export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageStatus = 'sending' | 'sent' | 'error';

export interface ChatMessageProps {
  id: string;
  role: MessageRole;
  content: string;
  timestamp?: Date | string;
  avatar?: string;
  userName?: string;
  status?: MessageStatus;
  isTyping?: boolean;
  showActions?: boolean;
  liked?: boolean;
  onLike?: () => void;
  onDislike?: () => void;
  onCopy?: () => void;
  onRegenerate?: () => void;
  className?: string;
}

// ============================================================================
// Helper Components
// ============================================================================

const Avatar: React.FC<{ src?: string; name?: string; role: MessageRole }> = ({ src, name, role }) => {
  const getInitials = (name?: string) => {
    if (!name) return role === 'user' ? 'U' : 'AI';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const bgColor = role === 'user' ? 'bg-primary-500' : 'bg-green-500';

  return (
    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${bgColor} flex items-center justify-center text-white text-sm font-medium overflow-hidden`}>
      {src ? (
        <Image src={src} alt={name || 'Avatar'} width={32} height={32} className="w-full h-full object-cover" />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};

const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-1 px-4 py-3 bg-gray-100 rounded-2xl w-fit">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
  </div>
);

const MessageActions: React.FC<{
  liked?: boolean;
  onLike?: () => void;
  onDislike?: () => void;
  onCopy?: () => void;
  onRegenerate?: () => void;
}> = ({ liked, onLike, onDislike, onCopy, onRegenerate }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
      {onLike && (
        <button
          onClick={onLike}
          className={`p-1.5 rounded-md hover:bg-gray-100 transition-colors ${liked ? 'text-primary-500' : 'text-gray-500'}`}
          title="Like"
        >
          <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
        </button>
      )}

      {onDislike && (
        <button
          onClick={onDislike}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
          title="Dislike"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
          </svg>
        </button>
      )}

      {onCopy && (
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
          title={copied ? 'Copied!' : 'Copy'}
        >
          {copied ? (
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          )}
        </button>
      )}

      {onRegenerate && (
        <button
          onClick={onRegenerate}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
          title="Regenerate"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      )}
    </div>
  );
};

// ============================================================================
// Message Content Renderer
// ============================================================================

const MessageContent: React.FC<{ content: string; role: MessageRole }> = ({ content }) => {
  // Simple Markdown-like rendering
  const renderContent = (text: string) => {
    // Code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    text.replace(codeBlockRegex, (match, _lang, code, offset) => {
      // Add text before code block
      if (offset > lastIndex) {
        parts.push(renderInlineMarkdown(text.slice(lastIndex, offset)));
      }

      // Add code block
      parts.push(
        <pre key={offset} className="bg-gray-900 text-gray-100 rounded-lg p-4 my-2 overflow-x-auto">
          <code className="text-sm">{code.trim()}</code>
        </pre>
      );

      lastIndex = offset + match.length;
      return match;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(renderInlineMarkdown(text.slice(lastIndex)));
    }

    return parts.length > 0 ? parts : renderInlineMarkdown(text);
  };

  const renderInlineMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => (
      <p key={i} className="mb-2 last:mb-0">
        {renderInlineFormatting(line)}
      </p>
    ));
  };

  const renderInlineFormatting = (text: string) => {
    // Bold: **text**
    let result: React.ReactNode = text;
    result = text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );

    // Note: For production, use a proper Markdown library like react-markdown
    return result;
  };

  return (
    <div className="prose prose-sm max-w-none">
      {renderContent(content)}
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export const ChatMessage: React.FC<ChatMessageProps> = ({
  id: _id,
  role,
  content,
  timestamp,
  avatar,
  userName,
  status = 'sent',
  isTyping = false,
  showActions = true,
  liked,
  onLike,
  onDislike,
  onCopy,
  onRegenerate,
  className = '',
}) => {
  const isUser = role === 'user';
  const isAssistant = role === 'assistant';

  // Format timestamp
  const formatTime = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} ${className} group`}>
      {/* Avatar */}
      {!isUser && <Avatar src={avatar} name={userName} role={role} />}

      {/* Message Content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
        {/* User Name (for assistant) */}
        {isAssistant && userName && (
          <span className="text-xs text-gray-500 mb-1 px-1">{userName}</span>
        )}

        {/* Message Bubble */}
        {isTyping ? (
          <TypingIndicator />
        ) : (
          <div
            className={`
              px-4 py-3 rounded-2xl
              ${isUser
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                : 'bg-white border border-gray-200 text-gray-900'
              }
              ${status === 'sending' ? 'opacity-70' : ''}
              ${status === 'error' ? 'border-red-300 bg-red-50' : ''}
            `}
          >
            <MessageContent content={content} role={role} />

            {status === 'error' && (
              <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Failed to send</span>
              </div>
            )}
          </div>
        )}

        {/* Timestamp */}
        {timestamp && !isTyping && (
          <span className="text-xs text-gray-400 mt-1 px-1">
            {formatTime(timestamp)}
          </span>
        )}

        {/* Actions (Assistant only) */}
        {isAssistant && showActions && !isTyping && status === 'sent' && (
          <MessageActions
            liked={liked}
            onLike={onLike}
            onDislike={onDislike}
            onCopy={onCopy}
            onRegenerate={onRegenerate}
          />
        )}
      </div>

      {/* Avatar (User) */}
      {isUser && <Avatar src={avatar} name={userName} role={role} />}
    </div>
  );
};

export default ChatMessage;
