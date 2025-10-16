import React, { useState, useRef, useEffect, ReactNode } from 'react';

export interface DropdownItem {
  key: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  onClick?: () => void;
}

export interface DropdownProps {
  items: DropdownItem[];
  trigger?: ReactNode;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  disabled?: boolean;
  className?: string;
  onItemClick?: (key: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  trigger,
  placement = 'bottom-start',
  disabled = false,
  className = '',
  onItemClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || !menuRef.current) return;

      const menuItems = Array.from(
        menuRef.current.querySelectorAll('[role="menuitem"]:not([disabled])')
      ) as HTMLElement[];

      const currentIndex = menuItems.findIndex((item) => item === document.activeElement);

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          const nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
          menuItems[nextIndex]?.focus();
          break;
        case 'ArrowUp':
          event.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
          menuItems[prevIndex]?.focus();
          break;
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (currentIndex >= 0) {
            menuItems[currentIndex]?.click();
          }
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;

    item.onClick?.();
    onItemClick?.(item.key);
    setIsOpen(false);
  };

  const placementStyles = {
    'bottom-start': 'top-full left-0 mt-2',
    'bottom-end': 'top-full right-0 mt-2',
    'top-start': 'bottom-full left-0 mb-2',
    'top-end': 'bottom-full right-0 mb-2',
  };

  const getItemStyles = (item: DropdownItem) => {
    const baseStyles = `
      flex items-center w-full px-4 py-2 text-sm text-left
      transition-colors duration-150
      ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `;

    if (item.divider) {
      return 'border-t border-gray-200 my-1';
    }

    if (item.danger) {
      return `
        ${baseStyles}
        text-error-600 hover:bg-error-50 active:bg-error-100
        ${item.disabled ? '' : 'hover:text-error-700'}
      `;
    }

    return `
      ${baseStyles}
      text-gray-700 hover:bg-primary-50 active:bg-primary-100
      ${item.disabled ? '' : 'hover:text-primary-700'}
    `;
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div
        onClick={handleTriggerClick}
        className={`${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {trigger || (
          <button
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            disabled={disabled}
          >
            <span>Dropdown</span>
            <svg
              className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          className={`
            absolute z-50 min-w-[12rem] py-1
            bg-white border border-gray-200 rounded-lg shadow-lg
            ${placementStyles[placement]}
            animate-fadeIn origin-top
          `}
        >
          {items.map((item) => {
            if (item.divider) {
              return <div key={item.key} className={getItemStyles(item)} />;
            }

            return (
              <button
                key={item.key}
                role="menuitem"
                disabled={item.disabled}
                className={getItemStyles(item)}
                onClick={() => handleItemClick(item)}
                tabIndex={item.disabled ? -1 : 0}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
