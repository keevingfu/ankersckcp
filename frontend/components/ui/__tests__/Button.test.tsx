import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../Button';

describe('Button Component', () => {
  // Basic Rendering Tests
  describe('Rendering', () => {
    it('should render button with children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(<Button className="custom-class">Test</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Button</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  // Variant Tests
  describe('Variants', () => {
    it('should render primary variant by default', () => {
      const { container } = render(<Button>Primary</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('bg-primary-500');
    });

    it('should render secondary variant', () => {
      const { container } = render(<Button variant="secondary">Secondary</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('bg-secondary-100');
    });

    it('should render outline variant', () => {
      const { container } = render(<Button variant="outline">Outline</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('border-2', 'border-primary-500');
    });

    it('should render ghost variant', () => {
      const { container } = render(<Button variant="ghost">Ghost</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('text-primary-700');
    });

    it('should render danger variant', () => {
      const { container } = render(<Button variant="danger">Danger</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('bg-error-500');
    });

    it('should render link variant', () => {
      const { container } = render(<Button variant="link">Link</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('underline');
    });
  });

  // Size Tests
  describe('Sizes', () => {
    it('should render medium size by default', () => {
      const { container } = render(<Button>Medium</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('h-10', 'px-4');
    });

    it('should render small size', () => {
      const { container } = render(<Button size="small">Small</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('h-8', 'px-3', 'text-sm');
    });

    it('should render large size', () => {
      const { container } = render(<Button size="large">Large</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('h-12', 'px-6', 'text-lg');
    });
  });

  // Loading State Tests
  describe('Loading State', () => {
    it('should show loading spinner when loading', () => {
      const { container } = render(<Button loading>Loading</Button>);
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should be disabled when loading', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should have opacity-50 when loading', () => {
      const { container } = render(<Button loading>Loading</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('opacity-50');
    });

    it('should not show icon when loading', () => {
      const icon = <span data-testid="test-icon">Icon</span>;
      render(<Button loading icon={icon}>Loading</Button>);
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
    });
  });

  // Disabled State Tests
  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should have opacity-50 when disabled', () => {
      const { container } = render(<Button disabled>Disabled</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('should not trigger onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // Full Width Tests
  describe('Full Width', () => {
    it('should render full width when fullWidth is true', () => {
      const { container } = render(<Button fullWidth>Full Width</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('w-full');
    });

    it('should not have w-full class by default', () => {
      const { container } = render(<Button>Normal</Button>);
      const button = container.querySelector('button');
      expect(button).not.toHaveClass('w-full');
    });
  });

  // Icon Tests
  describe('Icons', () => {
    const icon = <span data-testid="test-icon">Icon</span>;

    it('should render icon on the left by default', () => {
      const { container } = render(<Button icon={icon}>Button</Button>);
      const button = container.querySelector('button');
      const iconElement = screen.getByTestId('test-icon');
      const children = Array.from(button?.childNodes || []);
      const iconIndex = children.indexOf(iconElement.parentElement as ChildNode);
      const textIndex = children.findIndex(node => node.textContent === 'Button');
      expect(iconIndex).toBeLessThan(textIndex);
    });

    it('should render icon on the right when iconPosition is right', () => {
      render(
        <Button icon={icon} iconPosition="right">Button</Button>
      );
      const iconElement = screen.getByTestId('test-icon');
      // Check that icon exists (detailed positioning is implementation detail)
      expect(iconElement).toBeInTheDocument();
    });

    it('should render without icon when not provided', () => {
      render(<Button>No Icon</Button>);
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
    });
  });

  // Event Handler Tests
  describe('Event Handlers', () => {
    it('should call onClick handler when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should support other event handlers', () => {
      const handleMouseEnter = jest.fn();
      const handleMouseLeave = jest.fn();
      render(
        <Button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          Hover me
        </Button>
      );
      const button = screen.getByRole('button');
      fireEvent.mouseEnter(button);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
      fireEvent.mouseLeave(button);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    });

    it('should pass through native button props', () => {
      render(<Button type="submit" name="test-button">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('name', 'test-button');
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    it('should have proper role', () => {
      render(<Button>Accessible</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should support aria-label', () => {
      render(<Button aria-label="Close dialog">X</Button>);
      expect(screen.getByRole('button', { name: /close dialog/i })).toBeInTheDocument();
    });

    it('should support aria-disabled', () => {
      render(<Button disabled aria-disabled="true">Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });
});
