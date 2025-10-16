import React, { useState, ReactNode } from 'react';

export interface Tab {
  key: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  content: ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultActiveKey?: string;
  activeKey?: string;
  onChange?: (key: string) => void;
  variant?: 'line' | 'card' | 'pill';
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultActiveKey,
  activeKey: controlledActiveKey,
  onChange,
  variant = 'line',
  size = 'medium',
  animated = true,
  className = '',
}) => {
  const [uncontrolledActiveKey, setUncontrolledActiveKey] = useState<string>(
    defaultActiveKey || tabs[0]?.key || ''
  );

  const activeKey = controlledActiveKey !== undefined ? controlledActiveKey : uncontrolledActiveKey;

  const handleTabClick = (key: string, disabled?: boolean) => {
    if (disabled) return;

    if (controlledActiveKey === undefined) {
      setUncontrolledActiveKey(key);
    }

    onChange?.(key);
  };

  // Size styles using design system
  const sizeStyles = {
    small: 'text-sm px-3 py-1.5 gap-1.5',
    medium: 'text-base px-4 py-2 gap-2',
    large: 'text-lg px-5 py-2.5 gap-2.5',
  };

  // Variant styles using design system tokens
  const getTabStyles = (tab: Tab, isActive: boolean) => {
    const baseStyles = `
      inline-flex items-center justify-center font-medium cursor-pointer
      transition-all duration-200 select-none
      ${sizeStyles[size]}
      ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `;

    if (variant === 'line') {
      return `
        ${baseStyles}
        ${isActive
          ? 'text-primary-600 border-b-2 border-primary-500'
          : 'text-gray-600 hover:text-primary-500 border-b-2 border-transparent'
        }
      `;
    }

    if (variant === 'card') {
      return `
        ${baseStyles}
        rounded-t-lg border border-b-0
        ${isActive
          ? 'bg-white text-primary-600 border-gray-300'
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200'
        }
      `;
    }

    if (variant === 'pill') {
      return `
        ${baseStyles}
        rounded-full
        ${isActive
          ? 'bg-primary-500 text-white shadow-md'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
      `;
    }

    return baseStyles;
  };

  const containerStyles = {
    line: 'border-b border-gray-200',
    card: 'border-b border-gray-300',
    pill: 'bg-gray-50 rounded-full p-1',
  };

  const contentStyles = variant === 'card' ? 'border border-t-0 border-gray-300 rounded-b-lg p-4' : 'pt-4';

  const activeTab = tabs.find((tab) => tab.key === activeKey);

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className={`flex ${containerStyles[variant]} gap-1`}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeKey;
          return (
            <button
              key={tab.key}
              className={getTabStyles(tab, isActive)}
              onClick={() => handleTabClick(tab.key, tab.disabled)}
              disabled={tab.disabled}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.key}`}
              tabIndex={isActive ? 0 : -1}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab && (
        <div
          role="tabpanel"
          id={`tabpanel-${activeTab.key}`}
          className={`${contentStyles} ${animated ? 'animate-fadeIn' : ''}`}
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
};

export default Tabs;
