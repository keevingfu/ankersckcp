/**
 * Modal Component - 模态框组件
 * 支持多种尺寸和变体
 */

import React, { useEffect } from 'react';

export type ModalSize = 'small' | 'medium' | 'large' | 'full';
export type ModalVariant = 'default' | 'confirm' | 'alert';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  variant?: ModalVariant;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closable?: boolean;
  maskClosable?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  size = 'medium',
  variant = 'default',
  title,
  children,
  footer,
  closable = true,
  maskClosable = true,
  className = '',
}) => {
  // Size styles
  const sizeStyles: Record<ModalSize, string> = {
    small: 'max-w-md',       // 400px width
    medium: 'max-w-2xl',     // 600px width (默认)
    large: 'max-w-4xl',      // 800px width
    full: 'max-w-[90vw]',    // 90vw width
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  // ESC key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closable) {
        onClose();
      }
    };
    
    if (open) {
      window.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [open, closable, onClose]);

  if (!open) return null;

  const handleMaskClick = () => {
    if (maskClosable && closable) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleMaskClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

      {/* Modal */}
      <div
        className={`
          relative bg-white rounded-xl shadow-2xl
          w-full ${sizeStyles[size]}
          max-h-[90vh] flex flex-col
          animate-in fade-in zoom-in-95 duration-300
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            {closable && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-6 overflow-y-auto flex-1">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * ConfirmModal - 确认对话框
 */
export interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
}) => {
  const iconColors = {
    info: 'text-blue-500 bg-blue-100',
    warning: 'text-orange-500 bg-orange-100',
    danger: 'text-red-500 bg-red-100',
  };

  const buttonVariants = {
    info: 'primary',
    warning: 'warning',
    danger: 'danger',
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="small"
      footer={
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`
              px-4 py-2 rounded-md text-white transition
              ${type === 'danger' ? 'bg-red-500 hover:bg-red-600' : ''}
              ${type === 'warning' ? 'bg-orange-500 hover:bg-orange-600' : ''}
              ${type === 'info' ? 'bg-purple-500 hover:bg-purple-600' : ''}
            `.trim().replace(/\s+/g, ' ')}
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-full ${iconColors[type]} flex items-center justify-center`}>
          {type === 'danger' && (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {type === 'warning' && (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {type === 'info' && (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </Modal>
  );
};

export default Modal;
