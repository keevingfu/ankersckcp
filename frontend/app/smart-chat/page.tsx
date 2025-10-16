/**
 * Smart Chat Page
 * 智能客服聊天页面
 * 
 * Features:
 * - Conversation list (left sidebar)
 * - Chat window (right main area)
 * - User messages (right-aligned)
 * - AI responses (left-aligned)
 * - Message actions (like/copy/regenerate)
 * - Text input with file upload
 * - Quick reply buttons
 * - Knowledge base search results
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  liked?: boolean;
  knowledgeBase?: KnowledgeResult[];
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  unread?: number;
}

interface KnowledgeResult {
  id: string;
  title: string;
  snippet: string;
  relevance: number;
}

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    title: 'Liberty 4 Pairing Issue',
    lastMessage: 'Thank you for the help!',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    unread: 0,
  },
  {
    id: '2',
    title: 'ANC Not Working',
    lastMessage: 'Can you help me troubleshoot?',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    unread: 2,
  },
  {
    id: '3',
    title: 'Battery Life Question',
    lastMessage: 'How long does the battery last?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
  },
];

const QUICK_REPLIES = [
  'Reset my earbuds',
  'Pairing instructions',
  'Check warranty status',
  'Battery tips',
  'ANC troubleshooting',
];

// ============================================================================
// Helper Components
// ============================================================================

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const SendIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const ThumbUpIcon: React.FC<{ filled?: boolean }> = ({ filled }) => (
  <svg className="w-4 h-4" fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const AttachIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
  </svg>
);

const NewChatIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

// ============================================================================
// Conversation List Component
// ============================================================================

const ConversationList: React.FC<{
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
}> = ({ conversations, activeId, onSelect, onNew }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Conversations</h2>
          <button
            onClick={onNew}
            className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            title="New conversation"
          >
            <NewChatIcon />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </div>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map(conv => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
              activeId === conv.id ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-medium text-gray-900 text-sm line-clamp-1">{conv.title}</h3>
              <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{formatTime(conv.timestamp)}</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 line-clamp-1">{conv.lastMessage}</p>
              {conv.unread && conv.unread > 0 && (
                <span className="ml-2 flex-shrink-0 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                  {conv.unread}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// Knowledge Result Card Component
// ============================================================================

const KnowledgeResultCard: React.FC<{ result: KnowledgeResult }> = ({ result }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
    <div className="flex items-start justify-between">
      <h4 className="text-sm font-semibold text-blue-900">{result.title}</h4>
      <span className="text-xs text-blue-600 font-medium">{result.relevance}% match</span>
    </div>
    <p className="text-xs text-blue-800">{result.snippet}</p>
    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
      View full article →
    </button>
  </div>
);

// ============================================================================
// Message Bubble Component
// ============================================================================

const MessageBubble: React.FC<{
  message: Message;
  onLike: () => void;
  onCopy: () => void;
  onRegenerate?: () => void;
}> = ({ message, onLike, onCopy, onRegenerate }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isUser ? '' : 'space-y-3'}`}>
        {/* Message bubble */}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Knowledge base results (assistant only) */}
        {!isUser && message.knowledgeBase && message.knowledgeBase.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-600 font-medium">📚 Related Knowledge:</p>
            {message.knowledgeBase.map(kb => (
              <KnowledgeResultCard key={kb.id} result={kb} />
            ))}
          </div>
        )}

        {/* Timestamp and actions */}
        <div className={`flex items-center gap-2 text-xs text-gray-500 ${isUser ? 'justify-end' : ''}`}>
          <span>{message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>

          {!isUser && (
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={onLike}
                className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                  message.liked ? 'text-primary-500' : 'text-gray-400'
                }`}
                title="Like"
              >
                <ThumbUpIcon filled={message.liked} />
              </button>
              <button
                onClick={onCopy}
                className="p-1 rounded hover:bg-gray-200 transition-colors text-gray-400"
                title="Copy"
              >
                <CopyIcon />
              </button>
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="p-1 rounded hover:bg-gray-200 transition-colors text-gray-400"
                  title="Regenerate"
                >
                  <RefreshIcon />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export default function SmartChatPage() {
  // State
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState('1');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your Soundcore assistant. How can I help you today?",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
    },
    {
      id: '2',
      role: 'user',
      content: "I'm having trouble pairing my Liberty 4 earbuds with my phone",
      timestamp: new Date(Date.now() - 1000 * 60 * 9),
    },
    {
      id: '3',
      role: 'assistant',
      content: "I can help you with that! Let's troubleshoot the pairing issue. First, make sure your earbuds are in pairing mode (the LED should be flashing blue). Then, go to your phone's Bluetooth settings and look for 'Soundcore Liberty 4'.",
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      knowledgeBase: [
        {
          id: 'kb1',
          title: 'How to Pair Liberty 4',
          snippet: 'Step-by-step guide for pairing your Liberty 4 earbuds with any device...',
          relevance: 95,
        },
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle send message
  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I understand you're asking about that. Let me help you with a detailed response...",
        timestamp: new Date(),
        knowledgeBase: [
          {
            id: 'kb_auto',
            title: 'Relevant Article',
            snippet: 'This knowledge base article contains information related to your question...',
            relevance: 88,
          },
        ],
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Handle quick reply
  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
  };

  // Handle message actions
  const handleLike = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, liked: !msg.liked } : msg
      )
    );
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    alert('Copied to clipboard!');
  };

  const handleRegenerate = (messageId: string) => {
    alert('Regenerating response...');
  };

  // Handle file upload
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`File uploaded: ${file.name}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Conversation List */}
      <ConversationList
        conversations={conversations}
        activeId={activeConvId}
        onSelect={setActiveConvId}
        onNew={() => alert('New conversation')}
      />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <h2 className="text-lg font-bold text-gray-900">
            {conversations.find(c => c.id === activeConvId)?.title}
          </h2>
          <p className="text-sm text-gray-600">Smart AI Assistant</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
          {messages.map(message => (
            <MessageBubble
              key={message.id}
              message={message}
              onLike={() => handleLike(message.id)}
              onCopy={() => handleCopy(message.content)}
              onRegenerate={message.role === 'assistant' ? () => handleRegenerate(message.id) : undefined}
            />
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="px-8 py-3 bg-white border-t border-gray-200">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {QUICK_REPLIES.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(reply)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-8 py-4">
          <div className="flex items-end gap-3">
            <button
              onClick={handleFileUpload}
              className="p-3 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              title="Attach file"
            >
              <AttachIcon />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your message... (Shift+Enter for new line)"
                rows={1}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>

            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="p-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
