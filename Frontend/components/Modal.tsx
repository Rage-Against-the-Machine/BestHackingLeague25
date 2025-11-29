
import React, { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-25"
      onClick={onClose}
    >
      <div 
        className="bg-paper w-full max-w-md border-2 border-ink shadow-paper relative flex flex-col animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Header */}
        <div className="p-4 border-b-2 border-ink flex justify-between items-center bg-highlight">
          <h2 className="text-xl font-serif font-bold text-ink">{title || 'Potwierdzenie'}</h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-ink hover:text-white transition-colors border-2 border-transparent hover:border-ink rounded"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
