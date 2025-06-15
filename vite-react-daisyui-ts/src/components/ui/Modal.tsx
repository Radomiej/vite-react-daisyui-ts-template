import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdropClick?: boolean;
  closeButton?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  size = 'md',
  closeOnBackdropClick = true,
  closeButton = true,
}: ModalProps) => {
  if (!isOpen) return null;

  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-full',
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className={`relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto rounded-xl bg-base-100 shadow-2xl`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || closeButton) && (
          <div className="flex items-center justify-between border-b border-base-300 p-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            {closeButton && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={onClose}
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        )}
        
        {/* Body */}
        <div className="p-4">
          {children}
        </div>
        
        {/* Footer */}
        {actions && (
          <div className="border-t border-base-300 p-4">
            <div className="flex justify-end space-x-2">
              {actions}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
