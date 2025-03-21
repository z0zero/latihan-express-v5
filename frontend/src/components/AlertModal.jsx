import React from "react";

const AlertModal = ({ show, onClose, title, message }) => {
  if (!show) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg p-8 max-w-2xl w-full shadow-xl border-2 border-[#f87171]">
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-[#fee2e2] rounded-full p-3 mr-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-[#ef4444]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-medium text-[#111827]">
            {title || "Peringatan"}
          </h3>
          <div className="mt-2 text-base text-[#6b7280]">{message}</div>
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-[#3b82f6] text-white text-base rounded hover:bg-[#2563eb]"
              onClick={onClose}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
