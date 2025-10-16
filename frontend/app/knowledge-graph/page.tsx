/**
 * Knowledge Graph Page
 * 交互式知识图谱可视化页面
 * 
 * Features:
 * - Interactive node graph visualization
 * - Node types: Product, Feature, UseCase, Problem
 * - Real-time search and filtering
 * - Zoom and pan controls
 * - Node detail panel
 * - Export to image
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

type NodeType = 'product' | 'feature' | 'usecase' | 'problem';

interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  description?: string;
  metadata?: Record<string, any>;
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: string[];
}

interface GraphEdge {
  source: string;
  target: string;
  type: 'has_feature' | 'solves' | 'suitable_for';
  label?: string;
}

// ============================================================================
// Constants
// ============================================================================

const NODE_COLORS: Record<NodeType, string> = {
  product: '#667eea',   // Primary purple
  feature: '#48bb78',   // Green
  usecase: '#f6ad55',   // Orange
  problem: '#fc8181',   // Red
};

const NODE_RADIUS = 40;
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 700;

// Mock data - replace with real API data
const MOCK_NODES: GraphNode[] = [
  { id: '1', label: 'Liberty 4', type: 'product', description: 'Premium wireless earbuds', x: 600, y: 350, vx: 0, vy: 0, connections: ['2', '3', '4'] },
  { id: '2', label: 'ANC', type: 'feature', description: 'Active Noise Cancellation', x: 400, y: 250, vx: 0, vy: 0, connections: ['1', '5'] },
  { id: '3', label: 'Spatial Audio', type: 'feature', description: '3D audio experience', x: 800, y: 250, vx: 0, vy: 0, connections: ['1'] },
  { id: '4', label: 'Working Out', type: 'usecase', description: 'Perfect for gym and running', x: 600, y: 150, vx: 0, vy: 0, connections: ['1', '6'] },
  { id: '5', label: 'Noise Problem', type: 'problem', description: 'External noise interference', x: 300, y: 350, vx: 0, vy: 0, connections: ['2'] },
  { id: '6', label: 'Secure Fit', type: 'feature', description: 'Ear hook design', x: 500, y: 500, vx: 0, vy: 0, connections: ['4'] },
];

// ============================================================================
// Helper Components
// ============================================================================

const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const ZoomInIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
  </svg>
);

const ZoomOutIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
  </svg>
);

const ResetIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ============================================================================
// Node Legend Component
// ============================================================================

const NodeLegend: React.FC<{ filterType: NodeType | 'all'; onFilterChange: (type: NodeType | 'all') => void }> = ({ filterType, onFilterChange }) => {
  const types: Array<{ type: NodeType | 'all'; label: string; color: string }> = [
    { type: 'all', label: 'All', color: '#9ca3af' },
    { type: 'product', label: 'Product', color: NODE_COLORS.product },
    { type: 'feature', label: 'Feature', color: NODE_COLORS.feature },
    { type: 'usecase', label: 'Use Case', color: NODE_COLORS.usecase },
    { type: 'problem', label: 'Problem', color: NODE_COLORS.problem },
  ];

  return (
    <div className="flex items-center gap-4">
      {types.map(({ type, label, color }) => (
        <button
          key={type}
          onClick={() => onFilterChange(type)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            filterType === type
              ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

// ============================================================================
// Node Detail Panel Component
// ============================================================================

const NodeDetailPanel: React.FC<{ node: GraphNode | null; onClose: () => void }> = ({ node, onClose }) => {
  if (!node) return null;

  const relatedNodes = MOCK_NODES.filter(n => node.connections.includes(n.id));

  return (
    <div className="absolute top-4 right-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-10">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between" style={{ backgroundColor: `${NODE_COLORS[node.type]}10` }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: NODE_COLORS[node.type] }} />
            <span className="text-xs font-medium text-gray-600 uppercase">{node.type}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">{node.label}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
        {/* Description */}
        {node.description && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
            <p className="text-sm text-gray-600">{node.description}</p>
          </div>
        )}

        {/* Connections */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Connected Nodes ({relatedNodes.length})
          </h4>
          <div className="space-y-2">
            {relatedNodes.map(relatedNode => (
              <div
                key={relatedNode.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: NODE_COLORS[relatedNode.type] }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{relatedNode.label}</div>
                  <div className="text-xs text-gray-500">{relatedNode.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metadata */}
        {node.metadata && Object.keys(node.metadata).length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Additional Info</h4>
            <div className="space-y-2">
              {Object.entries(node.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-600">{key}:</span>
                  <span className="font-medium text-gray-900">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-2">
        <button className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium">
          View Details
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
          Edit
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export default function KnowledgeGraphPage() {
  // State
  const [nodes, setNodes] = useState<GraphNode[]>(MOCK_NODES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<NodeType | 'all'>('all');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Force-directed layout simulation
  useEffect(() => {
    const simulate = () => {
      setNodes(prevNodes => {
        const newNodes = [...prevNodes];
        
        // Simple force simulation
        for (const node of newNodes) {
          let fx = 0;
          let fy = 0;
          
          // Repulsion from other nodes
          for (const other of newNodes) {
            if (node.id === other.id) continue;
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = 500 / (dist * dist);
            fx += (dx / dist) * force;
            fy += (dy / dist) * force;
          }
          
          // Attraction to connected nodes
          node.connections.forEach(connId => {
            const connected = newNodes.find(n => n.id === connId);
            if (connected) {
              const dx = connected.x - node.x;
              const dy = connected.y - node.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const force = dist * 0.01;
              fx += (dx / dist) * force;
              fy += (dy / dist) * force;
            }
          });
          
          // Center gravity
          fx += (CANVAS_WIDTH / 2 - node.x) * 0.001;
          fy += (CANVAS_HEIGHT / 2 - node.y) * 0.001;
          
          // Apply forces
          node.vx = (node.vx + fx) * 0.85;
          node.vy = (node.vy + fy) * 0.85;
          node.x += node.vx;
          node.y += node.vy;
        }
        
        return newNodes;
      });
    };

    const interval = setInterval(simulate, 50);
    return () => clearInterval(interval);
  }, [nodes.length]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    
    // Apply transformations
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);
    
    // Draw connections
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    nodes.forEach(node => {
      node.connections.forEach(connId => {
        const connected = nodes.find(n => n.id === connId);
        if (connected) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connected.x, connected.y);
          ctx.stroke();
        }
      });
    });
    
    // Draw nodes
    nodes.forEach(node => {
      // Skip if filtered
      if (filterType !== 'all' && node.type !== filterType) return;
      if (searchQuery && !node.label.toLowerCase().includes(searchQuery.toLowerCase())) return;
      
      const isSelected = selectedNode?.id === node.id;
      
      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = NODE_COLORS[node.type];
      ctx.fill();
      
      if (isSelected) {
        ctx.strokeStyle = '#1e40af';
        ctx.lineWidth = 4;
        ctx.stroke();
      }
      
      // Label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Multi-line text
      const words = node.label.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      
      words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > NODE_RADIUS * 1.6 && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      lines.push(currentLine);
      
      lines.forEach((line, i) => {
        ctx.fillText(line, node.x, node.y + (i - lines.length / 2 + 0.5) * 14);
      });
    });
    
    ctx.restore();
  }, [nodes, selectedNode, searchQuery, filterType, zoom, offset]);

  // Handle canvas interactions
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / zoom;
    const y = (e.clientY - rect.top - offset.y) / zoom;
    
    // Find clicked node
    const clicked = nodes.find(node => {
      if (filterType !== 'all' && node.type !== filterType) return false;
      if (searchQuery && !node.label.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < NODE_RADIUS;
    });
    
    setSelectedNode(clicked || null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Control functions
  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'knowledge-graph.png';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Knowledge Graph</h1>
            <p className="text-sm text-gray-600 mt-1">Interactive visualization of knowledge relationships</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleZoomIn}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Zoom In"
            >
              <ZoomInIcon />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Zoom Out"
            >
              <ZoomOutIcon />
            </button>
            <button
              onClick={handleReset}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Reset View"
            >
              <ResetIcon />
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
            >
              <DownloadIcon />
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <SearchIcon />
            </div>
          </div>
          
          <NodeLegend filterType={filterType} onFilterChange={setFilterType} />
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="cursor-grab active:cursor-grabbing"
            style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
          />

          {/* Stats Overlay */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
            <div className="text-xs text-gray-600">
              <div className="flex items-center gap-4">
                <span>Nodes: <strong className="text-gray-900">{nodes.length}</strong></span>
                <span>Zoom: <strong className="text-gray-900">{(zoom * 100).toFixed(0)}%</strong></span>
              </div>
            </div>
          </div>

          {/* Node Detail Panel */}
          <NodeDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
        </div>

        {/* Instructions */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 How to Use</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• <strong>Click</strong> on nodes to view details</li>
            <li>• <strong>Drag</strong> canvas to pan around</li>
            <li>• <strong>Use zoom controls</strong> to zoom in/out</li>
            <li>• <strong>Search</strong> to highlight specific nodes</li>
            <li>• <strong>Filter by type</strong> to focus on specific node categories</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
