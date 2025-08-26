import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  fullScreenOnDesktop?: boolean;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children, fullScreenOnDesktop = false }) => {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full bg-card text-card-foreground shadow-lg p-4 sm:p-6 transition-all animate-in fade-in zoom-in my-4 sm:my-0 max-h-[calc(100vh-2rem)] overflow-y-auto ${
          fullScreenOnDesktop 
            ? 'sm:max-w-none sm:w-[95vw] sm:h-[90vh] sm:max-h-[90vh] sm:my-[5vh] sm:rounded-lg' 
            : 'max-w-lg sm:mx-auto sm:rounded-lg'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-10"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
