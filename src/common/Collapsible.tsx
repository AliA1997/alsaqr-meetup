import React, { useState, useRef } from 'react';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  children,
  defaultOpen = false,
  className = '',
  titleClassName = '',
  contentClassName = '',
  icon,
  iconPosition = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`border border-gray-200 rounded-lg h-full w-full ${className}`}>
      <button
        onClick={toggleCollapse}
        className={`
          w-full px-4 py-3 flex items-center justify-between
          bg-white hover:bg-gray-50 transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
          ${titleClassName}
        `}
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-3">
          {icon && iconPosition === 'left' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          <span className="text-left text-gray-900 text-base">{title}</span>
          {icon && iconPosition === 'right' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
        </div>

        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        ref={contentRef}
        className={`
          transition-all duration-300 ease-in-out overflow-hidden p-0
          ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}
        style={{
          maxHeight: isOpen ? contentRef.current?.scrollHeight + 'px' : '0px',
        }}
      >
        <div className={`px-0 py-3 bg-gray-50 border-t border-gray-100 ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Collapsible;