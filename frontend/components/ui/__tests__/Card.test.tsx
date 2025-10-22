import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card, { CardHeader, CardBody, CardFooter, StatCard } from '../Card';

describe('Card Component', () => {
  // Basic Rendering Tests
  describe('Rendering', () => {
    it('should render card with children', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(<Card className="custom-class">Test</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Card</Card>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  // Variant Tests
  describe('Variants', () => {
    it('should render default variant', () => {
      const { container } = render(<Card>Default</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('bg-white', 'rounded-lg');
    });

    it('should render hoverable variant', () => {
      const { container } = render(<Card variant="hoverable">Hoverable</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('hover:shadow-lg', 'cursor-pointer');
    });

    it('should render bordered variant', () => {
      const { container } = render(<Card variant="bordered">Bordered</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('border-2', 'border-gray-200');
    });

    it('should render interactive variant', () => {
      const { container } = render(<Card variant="interactive">Interactive</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('hover:shadow-lg', 'cursor-pointer', 'active:scale-[0.98]');
    });
  });

  // Padding Tests
  describe('Padding', () => {
    it('should render medium padding by default', () => {
      const { container } = render(<Card>Medium</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('p-6');
    });

    it('should render no padding', () => {
      const { container } = render(<Card padding="none">None</Card>);
      const card = container.querySelector('div');
      expect(card).not.toHaveClass('p-4', 'p-6', 'p-8');
    });

    it('should render small padding', () => {
      const { container } = render(<Card padding="small">Small</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('p-4');
    });

    it('should render large padding', () => {
      const { container } = render(<Card padding="large">Large</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('p-8');
    });
  });

  // Shadow Tests
  describe('Shadow', () => {
    it('should render medium shadow by default', () => {
      const { container } = render(<Card>Shadow</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('shadow-md');
    });

    it('should render no shadow', () => {
      const { container } = render(<Card shadow="none">No shadow</Card>);
      const card = container.querySelector('div');
      expect(card).not.toHaveClass('shadow-sm', 'shadow-md', 'shadow-lg');
    });

    it('should render small shadow', () => {
      const { container } = render(<Card shadow="sm">Small shadow</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('shadow-sm');
    });

    it('should render large shadow', () => {
      const { container } = render(<Card shadow="lg">Large shadow</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('shadow-lg');
    });
  });

  // Selected State Tests
  describe('Selected State', () => {
    it('should not be selected by default', () => {
      const { container } = render(<Card>Not selected</Card>);
      const card = container.querySelector('div');
      expect(card).not.toHaveClass('border-purple-500');
    });

    it('should render selected state', () => {
      const { container } = render(<Card selected>Selected</Card>);
      const card = container.querySelector('div');
      expect(card).toHaveClass('border-2', 'border-purple-500', 'ring-2', 'ring-purple-200');
    });
  });

  // Event Handler Tests
  describe('Event Handlers', () => {
    it('should support onClick handler', () => {
      const handleClick = jest.fn();
      render(<Card onClick={handleClick}>Clickable</Card>);
      const card = screen.getByText('Clickable');
      card.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should pass through native div props', () => {
      render(<Card data-testid="test-card">Test</Card>);
      expect(screen.getByTestId('test-card')).toBeInTheDocument();
    });
  });
});

describe('CardHeader Component', () => {
  it('should render children', () => {
    render(<CardHeader>Header Title</CardHeader>);
    expect(screen.getByText('Header Title')).toBeInTheDocument();
  });

  it('should render with icon', () => {
    const icon = <span data-testid="header-icon">Icon</span>;
    render(<CardHeader icon={icon}>Title</CardHeader>);
    expect(screen.getByTestId('header-icon')).toBeInTheDocument();
  });

  it('should render with actions', () => {
    const actions = <button data-testid="action-btn">Action</button>;
    render(<CardHeader actions={actions}>Title</CardHeader>);
    expect(screen.getByTestId('action-btn')).toBeInTheDocument();
  });

  it('should render icon and actions together', () => {
    const icon = <span data-testid="header-icon">Icon</span>;
    const actions = <button data-testid="action-btn">Action</button>;
    render(
      <CardHeader icon={icon} actions={actions}>
        Title
      </CardHeader>
    );
    expect(screen.getByTestId('header-icon')).toBeInTheDocument();
    expect(screen.getByTestId('action-btn')).toBeInTheDocument();
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardHeader ref={ref}>Header</CardHeader>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('CardBody Component', () => {
  it('should render children', () => {
    render(<CardBody>Body content</CardBody>);
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    const { container } = render(<CardBody className="custom">Body</CardBody>);
    const body = screen.getByText('Body');
    expect(body).toHaveClass('custom', 'text-gray-600');
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardBody ref={ref}>Body</CardBody>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('CardFooter Component', () => {
  it('should render children', () => {
    render(<CardFooter>Footer content</CardFooter>);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('should have border top', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);
    const footer = screen.getByText('Footer');
    expect(footer).toHaveClass('border-t', 'border-gray-200');
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardFooter ref={ref}>Footer</CardFooter>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('StatCard Component', () => {
  const defaultProps = {
    title: 'Total Users',
    value: '1,234',
  };

  it('should render title and value', () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('should render with icon', () => {
    const icon = <span data-testid="stat-icon">Icon</span>;
    render(<StatCard {...defaultProps} icon={icon} />);
    expect(screen.getByTestId('stat-icon')).toBeInTheDocument();
  });

  it('should render description', () => {
    render(<StatCard {...defaultProps} description="Active users" />);
    expect(screen.getByText('Active users')).toBeInTheDocument();
  });

  describe('Trend indicators', () => {
    it('should render positive trend', () => {
      render(<StatCard {...defaultProps} change={15} trend="up" />);
      expect(screen.getByText('15%')).toBeInTheDocument();
      const changeElement = screen.getByText('15%').parentElement;
      expect(changeElement).toHaveClass('text-green-600');
    });

    it('should render negative trend', () => {
      render(<StatCard {...defaultProps} change={10} trend="down" />);
      expect(screen.getByText('10%')).toBeInTheDocument();
      const changeElement = screen.getByText('10%').parentElement;
      expect(changeElement).toHaveClass('text-red-600');
    });

    it('should render neutral trend', () => {
      render(<StatCard {...defaultProps} change={0} trend="neutral" />);
      expect(screen.getByText('0%')).toBeInTheDocument();
      const changeElement = screen.getByText('0%').parentElement;
      expect(changeElement).toHaveClass('text-gray-600');
    });

    it('should display absolute value for negative changes', () => {
      render(<StatCard {...defaultProps} change={-20} trend="down" />);
      // Should display 20% not -20%
      expect(screen.getByText('20%')).toBeInTheDocument();
    });
  });

  it('should not render change when not provided', () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it('should render numeric value', () => {
    render(<StatCard title="Count" value={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});
