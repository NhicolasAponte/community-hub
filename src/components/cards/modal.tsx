import React from "react";
import { X } from "lucide-react";

// interface ModalProps {
//     open
// }

function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex items-center justify-center z-50 transition-colors 
        ${open ? "visible bg-black bg-opacity-40" : "invisible"} `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-lg shadow-lg p-6 transition-all 
      ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700
          bg-white hover:bg-gray-100 rounded-md"
          aria-label="Close Modal"
        >
          <X />
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
