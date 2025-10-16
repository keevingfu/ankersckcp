/**
 * Select Component
 * 企业级选择器组件 - 符合KCP设计系统规范
 * 
 * Features:
 * - Single & Multiple selection
 * - Searchable options
 * - Custom option rendering
 * - Loading state
 * - Grouped options
 * - Keyboard navigation
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

export interface OptionGroup {
  label: string;
  options: Option[];
}

export type SelectValue = string | number | (string | number)[];

export interface SelectProps {
  value?: SelectValue;
  defaultValue?: SelectValue;
  onChange?: (value: SelectValue) => void;
  options?: Option[];
  groups?: OptionGroup[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  clearable?: boolean;
  size?: 'small' | 'medium' | 'large';
  status?: 'default' | 'error' | 'success';
  maxTagCount?: number;
  className?: string;
  dropdownClassName?: string;
  renderOption?: (option: Option) => React.ReactNode;
  filterOption?: (input: string, option: Option) => boolean;
}

// ============================================================================
// Helper Components
// ============================================================================

const ChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const LoadingIcon: React.FC = () => (
  <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckIcon: React.FC = () => (
  <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

// ============================================================================
// Main Select Component
// ============================================================================

export const Select: React.FC<SelectProps> = ({
  value: controlledValue,
  defaultValue,
  onChange,
  options = [],
  groups = [],
  placeholder = 'Select...',
  disabled = false,
  loading = false,
  searchable = false,
  multiple = false,
  clearable = false,
  size = 'medium',
  status = 'default',
  maxTagCount,
  className = '',
  dropdownClassName = '',
  renderOption,
  filterOption,
}) => {
  // State
  const [internalValue, setInternalValue] = useState<SelectValue>(defaultValue || (multiple ? [] : ''));
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Controlled vs uncontrolled
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const setValue = (newValue: SelectValue) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  // Get all options (from both options and groups)
  const allOptions = [...options, ...groups.flatMap(g => g.options)];

  // Filter options based on search
  const filteredOptions = searchable && searchQuery
    ? allOptions.filter(opt => {
        if (filterOption) {
          return filterOption(searchQuery, opt);
        }
        return opt.label.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : allOptions;

  // Get selected options
  const selectedOptions = allOptions.filter(opt => {
    if (multiple) {
      return (value as (string | number)[]).includes(opt.value);
    }
    return opt.value === value;
  });

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle option select
  const handleSelect = (option: Option) => {
    if (option.disabled) return;

    if (multiple) {
      const currentValues = value as (string | number)[];
      const newValues = currentValues.includes(option.value)
        ? currentValues.filter(v => v !== option.value)
        : [...currentValues, option.value];
      setValue(newValues);
    } else {
      setValue(option.value);
      setOpen(false);
      setSearchQuery('');
    }
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue(multiple ? [] : '');
  };

  // Handle remove tag
  const handleRemoveTag = (optionValue: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = (value as (string | number)[]).filter(v => v !== optionValue);
    setValue(newValues);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
        if (open && focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[focusedIndex]);
        } else {
          setOpen(!open);
        }
        break;
      case 'Escape':
        setOpen(false);
        setSearchQuery('');
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!open) {
          setOpen(true);
        } else {
          setFocusedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
    }
  };

  // Size classes
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-5 py-3 text-lg',
  };

  // Status classes
  const statusClasses = {
    default: 'border-gray-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20',
    error: 'border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20',
    success: 'border-green-500 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20',
  };

  // Render selected value display
  const renderValue = () => {
    if (multiple && Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-gray-400">{placeholder}</span>;
      }

      const displayTags = maxTagCount && value.length > maxTagCount
        ? selectedOptions.slice(0, maxTagCount)
        : selectedOptions;

      return (
        <div className="flex flex-wrap gap-1">
          {displayTags.map(opt => (
            <span
              key={opt.value}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-sm"
            >
              {opt.label}
              <button
                onClick={(e) => handleRemoveTag(opt.value, e)}
                className="hover:text-primary-900"
              >
                <CloseIcon />
              </button>
            </span>
          ))}
          {maxTagCount && value.length > maxTagCount && (
            <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-sm">
              +{value.length - maxTagCount}
            </span>
          )}
        </div>
      );
    }

    const selected = selectedOptions[0];
    if (selected) {
      return renderOption ? renderOption(selected) : selected.label;
    }

    return <span className="text-gray-400">{placeholder}</span>;
  };

  // Render option item
  const renderOptionItem = (option: Option, index: number) => {
    const isSelected = multiple
      ? (value as (string | number)[]).includes(option.value)
      : value === option.value;
    const isFocused = index === focusedIndex;

    return (
      <div
        key={option.value}
        onClick={() => handleSelect(option)}
        className={`
          px-4 py-2 cursor-pointer flex items-center justify-between
          ${isFocused ? 'bg-gray-100' : ''}
          ${isSelected ? 'bg-primary-50 text-primary-700' : 'text-gray-900'}
          ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
        `}
      >
        <div className="flex items-center gap-2">
          {option.icon}
          <div>
            <div className="font-medium">{option.label}</div>
            {option.description && (
              <div className="text-xs text-gray-500">{option.description}</div>
            )}
          </div>
        </div>
        {isSelected && <CheckIcon />}
      </div>
    );
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Select Input */}
      <div
        onClick={() => !disabled && setOpen(!open)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        className={`
          flex items-center justify-between w-full rounded-lg border bg-white cursor-pointer
          transition-all ${sizeClasses[size]} ${statusClasses[status]}
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
          ${open ? 'ring-2' : ''}
        `}
      >
        {/* Value Display or Search Input */}
        <div className="flex-1 min-w-0">
          {searchable && open ? (
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full outline-none bg-transparent"
              placeholder={placeholder}
              autoFocus
            />
          ) : (
            renderValue()
          )}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-1 ml-2">
          {loading && <LoadingIcon />}
          {clearable && !disabled && value && (value as any).length > 0 && !loading && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <CloseIcon />
            </button>
          )}
          <ChevronIcon open={open} />
        </div>
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div
          className={`
            absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg
            max-h-60 overflow-auto ${dropdownClassName}
          `}
        >
          {loading ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <LoadingIcon />
              <p className="mt-2">Loading...</p>
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              No options found
            </div>
          ) : groups.length > 0 ? (
            // Render grouped options
            groups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                  {group.label}
                </div>
                {group.options.map((opt, optIndex) => renderOptionItem(opt, optIndex))}
              </div>
            ))
          ) : (
            // Render flat options
            filteredOptions.map((opt, index) => renderOptionItem(opt, index))
          )}
        </div>
      )}
    </div>
  );
};

export default Select;
