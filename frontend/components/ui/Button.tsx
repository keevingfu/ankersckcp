import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'medium',
      loading = false,
      fullWidth = false,
      icon,
      iconPosition = 'left',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles using design system
    const baseStyles =
      'inline-flex items-center justify-center font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2';

    // Variant styles using design system tokens
    const variantStyles = {
      primary:
        'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white focus:ring-primary-500 shadow-md hover:shadow-lg transition-all',
      secondary:
        'bg-secondary-100 hover:bg-secondary-200 active:bg-secondary-300 text-secondary-700 focus:ring-secondary-500 transition-all',
      outline:
        'border-2 border-primary-500 hover:border-primary-600 text-primary-700 hover:bg-primary-50 focus:ring-primary-500 transition-all',
      ghost:
        'text-primary-700 hover:bg-primary-50 active:bg-primary-100 focus:ring-primary-500 transition-all',
      danger:
        'bg-error-500 hover:bg-error-600 active:bg-error-700 text-white focus:ring-error-500 shadow-md hover:shadow-lg transition-all',
      link:
        'text-primary-700 underline hover:text-primary-900 focus:ring-primary-500 transition-colors',
    };

    // Size styles using design system spacing
    const sizeStyles = {
      small: 'h-8 px-3 text-sm rounded-md gap-1.5',
      medium: 'h-10 px-4 text-base rounded-lg gap-2',
      large: 'h-12 px-6 text-lg rounded-lg gap-2.5',
    };

    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';

    // Disabled/Loading styles
    const disabledStyles = (disabled || loading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${disabledStyles} ${className}`;

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && icon && iconPosition === 'left' && icon}
        {children}
        {!loading && icon && iconPosition === 'right' && icon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
