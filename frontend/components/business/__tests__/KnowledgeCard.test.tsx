import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import KnowledgeCard, { Knowledge, KnowledgeCardProps } from '../KnowledgeCard';

describe('KnowledgeCard Component', () => {
  const defaultProps: KnowledgeCardProps = {
    id: '1',
    title: 'Test Knowledge Item',
    content: 'This is test content for the knowledge item',
    type: 'Guide',
    product: 'Product A',
    language: 'EN',
    qualityScore: 85,
    updatedAt: '2024-01-15',
  };

  const mockKnowledge: Knowledge = {
    id: '2',
    title: 'Mock Knowledge',
    summary: 'Mock summary content',
    category: 'Category A',
    tags: ['tag1', 'tag2'],
    lastUpdated: '2024-01-20',
    views: 100,
    likes: 50,
    status: 'active',
    confidence: 92,
  };

  // Basic Rendering Tests
  describe('Rendering', () => {
    it('should render with individual props', () => {
      render(<KnowledgeCard {...defaultProps} />);
      expect(screen.getByText('Test Knowledge Item')).toBeInTheDocument();
      expect(screen.getByText(/This is test content/)).toBeInTheDocument();
    });

    it('should render with knowledge object', () => {
      render(<KnowledgeCard knowledge={mockKnowledge} />);
      expect(screen.getByText('Mock Knowledge')).toBeInTheDocument();
      expect(screen.getByText('Mock summary content')).toBeInTheDocument();
    });

    it('should prioritize knowledge object over individual props', () => {
      render(<KnowledgeCard {...defaultProps} knowledge={mockKnowledge} />);
      expect(screen.getByText('Mock Knowledge')).toBeInTheDocument();
      expect(screen.queryByText('Test Knowledge Item')).not.toBeInTheDocument();
    });

    it('should render with empty defaults when no data provided', () => {
      const { container } = render(<KnowledgeCard />);
      expect(container).toBeInTheDocument();
    });
  });

  // Type Badge Tests
  describe('Type Badges', () => {
    it('should render FAQ type with correct styling', () => {
      render(<KnowledgeCard {...defaultProps} type="FAQ" />);
      const badge = screen.getByText('FAQ');
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-700');
    });

    it('should render Guide type with correct styling', () => {
      render(<KnowledgeCard {...defaultProps} type="Guide" />);
      const badge = screen.getByText('Guide');
      expect(badge).toHaveClass('bg-green-100', 'text-green-700');
    });

    it('should render Spec type with correct styling', () => {
      render(<KnowledgeCard {...defaultProps} type="Spec" />);
      const badge = screen.getByText('Spec');
      expect(badge).toHaveClass('bg-purple-100', 'text-purple-700');
    });

    it('should render Tutorial type with correct styling', () => {
      render(<KnowledgeCard {...defaultProps} type="Tutorial" />);
      const badge = screen.getByText('Tutorial');
      expect(badge).toHaveClass('bg-orange-100', 'text-orange-700');
    });

    it('should default to Guide type when not specified', () => {
      const { type, ...propsWithoutType } = defaultProps;
      render(<KnowledgeCard {...propsWithoutType} />);
      const badge = screen.getByText('Guide');
      expect(badge).toBeInTheDocument();
    });
  });

  // Quality Score Tests
  describe('Quality Score', () => {
    it('should display quality score percentage', () => {
      render(<KnowledgeCard {...defaultProps} qualityScore={75} />);
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('should show green color for high quality (>= 80)', () => {
      const { container } = render(<KnowledgeCard {...defaultProps} qualityScore={85} />);
      const progressBar = container.querySelector('.bg-green-500');
      expect(progressBar).toBeInTheDocument();
    });

    it('should show yellow color for medium quality (60-79)', () => {
      const { container } = render(<KnowledgeCard {...defaultProps} qualityScore={70} />);
      const progressBar = container.querySelector('.bg-yellow-500');
      expect(progressBar).toBeInTheDocument();
    });

    it('should show orange color for low quality (40-59)', () => {
      const { container } = render(<KnowledgeCard {...defaultProps} qualityScore={50} />);
      const progressBar = container.querySelector('.bg-orange-500');
      expect(progressBar).toBeInTheDocument();
    });

    it('should show red color for very low quality (< 40)', () => {
      const { container } = render(<KnowledgeCard {...defaultProps} qualityScore={30} />);
      const progressBar = container.querySelector('.bg-red-500');
      expect(progressBar).toBeInTheDocument();
    });

    it('should set progress bar width based on score', () => {
      const { container } = render(<KnowledgeCard {...defaultProps} qualityScore={65} />);
      const progressBar = container.querySelector('[style*="width"]');
      expect(progressBar).toHaveStyle({ width: '65%' });
    });

    it('should use confidence from knowledge object', () => {
      render(<KnowledgeCard knowledge={mockKnowledge} />);
      expect(screen.getByText('92%')).toBeInTheDocument();
    });
  });

  // Metadata Tests
  describe('Metadata Display', () => {
    it('should display product badge', () => {
      render(<KnowledgeCard {...defaultProps} />);
      expect(screen.getByText('Product A')).toBeInTheDocument();
    });

    it('should display language badge', () => {
      render(<KnowledgeCard {...defaultProps} />);
      expect(screen.getByText('EN')).toBeInTheDocument();
    });

    it('should display updated date', () => {
      render(<KnowledgeCard {...defaultProps} />);
      expect(screen.getByText('2024-01-15')).toBeInTheDocument();
    });

    it('should use category as product from knowledge object', () => {
      render(<KnowledgeCard knowledge={mockKnowledge} />);
      expect(screen.getByText('Category A')).toBeInTheDocument();
    });

    it('should use lastUpdated from knowledge object', () => {
      render(<KnowledgeCard knowledge={mockKnowledge} />);
      expect(screen.getByText('2024-01-20')).toBeInTheDocument();
    });
  });

  // Action Buttons Tests
  describe('Action Buttons', () => {
    it('should render View Details button when onView is provided', () => {
      const onView = jest.fn();
      render(<KnowledgeCard {...defaultProps} onView={onView} />);
      expect(screen.getByText('View Details')).toBeInTheDocument();
    });

    it('should call onView when View Details is clicked', () => {
      const onView = jest.fn();
      render(<KnowledgeCard {...defaultProps} onView={onView} />);
      const viewButton = screen.getByText('View Details');
      fireEvent.click(viewButton);
      expect(onView).toHaveBeenCalledTimes(1);
    });

    it('should render Edit button when onEdit is provided', () => {
      const onEdit = jest.fn();
      render(<KnowledgeCard {...defaultProps} onEdit={onEdit} />);
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    it('should call onEdit when Edit button is clicked', () => {
      const onEdit = jest.fn();
      render(<KnowledgeCard {...defaultProps} onEdit={onEdit} />);
      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);
      expect(onEdit).toHaveBeenCalledTimes(1);
    });

    it('should render Delete button when onDelete is provided', () => {
      const onDelete = jest.fn();
      render(<KnowledgeCard {...defaultProps} onDelete={onDelete} />);
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('should call onDelete when Delete button is clicked', () => {
      const onDelete = jest.fn();
      render(<KnowledgeCard {...defaultProps} onDelete={onDelete} />);
      const deleteButton = screen.getByText('Delete');
      fireEvent.click(deleteButton);
      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('should render all action buttons when all handlers provided', () => {
      const handlers = {
        onView: jest.fn(),
        onEdit: jest.fn(),
        onDelete: jest.fn(),
      };
      render(<KnowledgeCard {...defaultProps} {...handlers} />);
      expect(screen.getByText('View Details')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('should not render action buttons when handlers not provided', () => {
      render(<KnowledgeCard {...defaultProps} />);
      expect(screen.queryByText('View Details')).not.toBeInTheDocument();
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
      expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });

    it('should have delete button with red styling', () => {
      const onDelete = jest.fn();
      render(<KnowledgeCard {...defaultProps} onDelete={onDelete} />);
      const deleteButton = screen.getByText('Delete');
      expect(deleteButton).toHaveClass('text-red-600', 'hover:bg-red-50');
    });
  });

  // Card Header Tests
  describe('Card Header', () => {
    it('should render header icon', () => {
      const { container } = render(<KnowledgeCard {...defaultProps} />);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should render title in header', () => {
      render(<KnowledgeCard {...defaultProps} />);
      const title = screen.getByText('Test Knowledge Item');
      // Title should be within the header structure
      expect(title.parentElement?.parentElement).toHaveClass('flex', 'items-center');
    });

    it('should render three-dot menu button', () => {
      const { container } = render(<KnowledgeCard {...defaultProps} onView={jest.fn()} />);
      const menuButton = container.querySelector('button');
      expect(menuButton).toBeInTheDocument();
    });
  });

  // Card Body Tests
  describe('Card Body', () => {
    it('should truncate long content with line-clamp', () => {
      const longContent = 'A'.repeat(500);
      const { container } = render(<KnowledgeCard {...defaultProps} content={longContent} />);
      const contentElement = container.querySelector('.line-clamp-3');
      expect(contentElement).toBeInTheDocument();
    });

    it('should display all badges in flex layout', () => {
      const { container } = render(<KnowledgeCard {...defaultProps} />);
      const badgeContainer = container.querySelector('.flex.flex-wrap.gap-2');
      expect(badgeContainer).toBeInTheDocument();
      expect(badgeContainer?.children.length).toBeGreaterThan(0);
    });
  });

  // Card Footer Tests
  describe('Card Footer', () => {
    it('should render quality label', () => {
      render(<KnowledgeCard {...defaultProps} />);
      expect(screen.getByText('Quality:')).toBeInTheDocument();
    });

    it('should render updated date in footer', () => {
      render(<KnowledgeCard {...defaultProps} />);
      const footer = screen.getByText('2024-01-15');
      expect(footer).toHaveClass('text-xs', 'text-gray-500');
    });

    it('should display quality score and date in same row', () => {
      const { container } = render(<KnowledgeCard {...defaultProps} />);
      const footerContent = container.querySelector('.flex.items-center.justify-between');
      expect(footerContent).toBeInTheDocument();
    });
  });

  // Integration Tests
  describe('Integration', () => {
    it('should handle mixed prop sources correctly', () => {
      render(
        <KnowledgeCard
          title="Prop Title"
          type="Guide"
          knowledge={{ ...mockKnowledge, title: 'Knowledge Title' }}
          qualityScore={75}
        />
      );
      // Knowledge object should take precedence for title
      expect(screen.getByText('Knowledge Title')).toBeInTheDocument();
      // But individual props should be used when not in knowledge object
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('should work with all features enabled', () => {
      const handlers = {
        onView: jest.fn(),
        onEdit: jest.fn(),
        onDelete: jest.fn(),
      };
      render(<KnowledgeCard {...defaultProps} {...handlers} />);

      // Verify all parts are rendered
      expect(screen.getByText('Test Knowledge Item')).toBeInTheDocument();
      expect(screen.getByText(/This is test content/)).toBeInTheDocument();
      expect(screen.getByText('Guide')).toBeInTheDocument();
      expect(screen.getByText('Product A')).toBeInTheDocument();
      expect(screen.getByText('EN')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
      expect(screen.getByText('2024-01-15')).toBeInTheDocument();
      expect(screen.getByText('View Details')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('should handle multiple clicks on different actions', () => {
      const handlers = {
        onView: jest.fn(),
        onEdit: jest.fn(),
        onDelete: jest.fn(),
      };
      render(<KnowledgeCard {...defaultProps} {...handlers} />);

      fireEvent.click(screen.getByText('View Details'));
      fireEvent.click(screen.getByText('Edit'));
      fireEvent.click(screen.getByText('Delete'));

      expect(handlers.onView).toHaveBeenCalledTimes(1);
      expect(handlers.onEdit).toHaveBeenCalledTimes(1);
      expect(handlers.onDelete).toHaveBeenCalledTimes(1);
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('should handle zero quality score', () => {
      const { container } = render(<KnowledgeCard {...defaultProps} qualityScore={0} />);
      expect(screen.getByText('0%')).toBeInTheDocument();
      const progressBar = container.querySelector('[style*="width"]');
      expect(progressBar).toHaveStyle({ width: '0%' });
    });

    it('should handle 100 quality score', () => {
      const { container } = render(<KnowledgeCard {...defaultProps} qualityScore={100} />);
      expect(screen.getByText('100%')).toBeInTheDocument();
      const progressBar = container.querySelector('[style*="width"]');
      expect(progressBar).toHaveStyle({ width: '100%' });
    });

    it('should handle empty strings gracefully', () => {
      const { container } = render(
        <KnowledgeCard
          title=""
          content=""
          product=""
          language=""
          updatedAt=""
        />
      );
      expect(container).toBeInTheDocument();
    });

    it('should handle undefined values gracefully', () => {
      const { container } = render(
        <KnowledgeCard
          title={undefined}
          content={undefined}
          type={undefined}
        />
      );
      expect(container).toBeInTheDocument();
    });

    it('should handle very long titles', () => {
      const longTitle = 'A'.repeat(200);
      render(<KnowledgeCard {...defaultProps} title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });
  });
});
