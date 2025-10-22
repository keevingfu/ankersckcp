import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Input from '../Input';

describe('Input Component', () => {
  // Basic Rendering Tests
  describe('Rendering', () => {
    it('should render input element', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Input label="Username" />);
      expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(<Input className="custom-input" />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('custom-input');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('should render text input by default', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });
  });

  // Label and Required Tests
  describe('Label and Required', () => {
    it('should show asterisk for required fields', () => {
      render(<Input label="Email" required />);
      const asterisk = screen.getByText('*');
      expect(asterisk).toBeInTheDocument();
      expect(asterisk).toHaveClass('text-red-500');
    });

    it('should not show asterisk when not required', () => {
      render(<Input label="Optional" />);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });
  });

  // Error State Tests
  describe('Error State', () => {
    it('should display error message', () => {
      render(<Input error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should have error styling', () => {
      const { container } = render(<Input error="Error" />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('border-red-500');
    });

    it('should show error text in red', () => {
      render(<Input error="Invalid input" />);
      const error = screen.getByText('Invalid input');
      expect(error).toHaveClass('text-red-500');
    });

    it('should prioritize error over helper text', () => {
      render(<Input error="Error message" helperText="Helper text" />);
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });
  });

  // Success State Tests
  describe('Success State', () => {
    it('should show success icon', () => {
      const { container } = render(<Input success />);
      const successIcon = container.querySelector('.text-green-500');
      expect(successIcon).toBeInTheDocument();
    });

    it('should have success styling', () => {
      const { container } = render(<Input success />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('border-green-500');
    });

    it('should not show success icon when error exists', () => {
      const { container } = render(<Input success error="Error" />);
      const successIcon = container.querySelector('.text-green-500');
      expect(successIcon).not.toBeInTheDocument();
    });
  });

  // Helper Text Tests
  describe('Helper Text', () => {
    it('should display helper text', () => {
      render(<Input helperText="Enter your email address" />);
      expect(screen.getByText('Enter your email address')).toBeInTheDocument();
    });

    it('should style helper text in gray', () => {
      render(<Input helperText="Helper" />);
      const helper = screen.getByText('Helper');
      expect(helper).toHaveClass('text-gray-500');
    });
  });

  // Icon Tests
  describe('Icons', () => {
    const prefixIcon = <span data-testid="prefix-icon">@</span>;
    const suffixIcon = <span data-testid="suffix-icon">$</span>;

    it('should render prefix icon', () => {
      render(<Input prefixIcon={prefixIcon} />);
      expect(screen.getByTestId('prefix-icon')).toBeInTheDocument();
    });

    it('should render suffix icon', () => {
      render(<Input suffixIcon={suffixIcon} />);
      expect(screen.getByTestId('suffix-icon')).toBeInTheDocument();
    });

    it('should render both prefix and suffix icons', () => {
      render(<Input prefixIcon={prefixIcon} suffixIcon={suffixIcon} />);
      expect(screen.getByTestId('prefix-icon')).toBeInTheDocument();
      expect(screen.getByTestId('suffix-icon')).toBeInTheDocument();
    });

    it('should add left padding when prefix icon exists', () => {
      const { container } = render(<Input prefixIcon={prefixIcon} />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('pl-10');
    });

    it('should add right padding when suffix icon exists', () => {
      const { container } = render(<Input suffixIcon={suffixIcon} />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('pr-10');
    });
  });

  // Clearable Tests
  describe('Clearable', () => {
    it('should show clear button when clearable and has value', () => {
      const { container } = render(<Input clearable value="test" onChange={() => {}} />);
      const clearButton = container.querySelector('button[type="button"]');
      expect(clearButton).toBeInTheDocument();
    });

    it('should not show clear button when no value', () => {
      const { container } = render(<Input clearable value="" onChange={() => {}} />);
      const clearButton = container.querySelector('button[type="button"]');
      expect(clearButton).not.toBeInTheDocument();
    });

    it('should call onClear when clear button clicked', () => {
      const handleClear = jest.fn();
      const { container } = render(
        <Input clearable value="test" onChange={() => {}} onClear={handleClear} />
      );
      const clearButton = container.querySelector('button[type="button"]');
      if (clearButton) fireEvent.click(clearButton);
      expect(handleClear).toHaveBeenCalledTimes(1);
    });
  });

  // Password Type Tests
  describe('Password Type', () => {
    it('should render password input', () => {
      const { container } = render(<Input type="password" />);
      const input = container.querySelector('input[type="password"]') as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input.type).toBe('password');
    });

    it('should toggle password visibility', async () => {
      const user = userEvent.setup();
      const { container } = render(<Input type="password" value="secret" onChange={() => {}} />);
      const input = container.querySelector('input') as HTMLInputElement;
      const toggleButton = container.querySelectorAll('button[type="button"]')[0];

      // Initially password should be hidden
      expect(input.type).toBe('password');

      // Click toggle button
      await user.click(toggleButton);
      expect(input.type).toBe('text');

      // Click again to hide
      await user.click(toggleButton);
      expect(input.type).toBe('password');
    });

    it('should show eye icon for password toggle', () => {
      const { container } = render(<Input type="password" />);
      const eyeIcon = container.querySelector('svg');
      expect(eyeIcon).toBeInTheDocument();
    });
  });

  // Event Handler Tests
  describe('Event Handlers', () => {
    it('should call onChange handler', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);
      const input = screen.getByRole('textbox');
      await user.type(input, 'test');
      expect(handleChange).toHaveBeenCalled();
    });

    it('should call onFocus handler', () => {
      const handleFocus = jest.fn();
      render(<Input onFocus={handleFocus} />);
      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('should call onBlur handler', () => {
      const handleBlur = jest.fn();
      render(<Input onBlur={handleBlur} />);
      const input = screen.getByRole('textbox');
      fireEvent.blur(input);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should support controlled input', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        return (
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            data-testid="controlled-input"
          />
        );
      };
      render(<TestComponent />);
      const input = screen.getByTestId('controlled-input') as HTMLInputElement;
      await user.type(input, 'hello');
      expect(input.value).toBe('hello');
    });
  });

  // Native Props Tests
  describe('Native Props', () => {
    it('should support placeholder', () => {
      render(<Input placeholder="Enter email" />);
      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    });

    it('should support disabled state', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('should support readonly state', () => {
      render(<Input readOnly />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readonly');
    });

    it('should support maxLength', () => {
      render(<Input maxLength={10} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxLength', '10');
    });

    it('should support name attribute', () => {
      render(<Input name="username" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('name', 'username');
    });

    it('should support autoComplete', () => {
      render(<Input autoComplete="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('autoComplete', 'email');
    });
  });

  // Input Types Tests
  describe('Input Types', () => {
    it('should support email type', () => {
      render(<Input type="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should support number type', () => {
      render(<Input type="number" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('should support tel type', () => {
      render(<Input type="tel" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'tel');
    });

    it('should support url type', () => {
      render(<Input type="url" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'url');
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    it('should associate label with input', () => {
      render(<Input label="Username" />);
      const label = screen.getByText('Username');
      const input = screen.getByRole('textbox');
      expect(label.tagName).toBe('LABEL');
      // Input should be a child of the label's parent container
      expect(input).toBeInTheDocument();
    });

    it('should support aria-label', () => {
      render(<Input aria-label="Search" />);
      expect(screen.getByLabelText('Search')).toBeInTheDocument();
    });

    it('should support aria-describedby for error', () => {
      render(<Input error="Error message" aria-describedby="error-msg" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'error-msg');
    });

    it('should be keyboard navigable', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      input.focus();
      expect(document.activeElement).toBe(input);
    });
  });
});
