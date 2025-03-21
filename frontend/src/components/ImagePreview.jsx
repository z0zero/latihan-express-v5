import React from "react";

const ImagePreview = ({ imageUrl, onRemove }) => {
  if (!imageUrl) return null;

  return (
    <div className="mt-4">
      <p className="text-sm text-[#6b7280] mb-2">Preview:</p>
      <div className="relative inline-block">
        <img
          src={imageUrl}
          alt="Preview"
          className="h-40 object-cover rounded border border-[#e5e7eb]"
          onError={(e) => {
            console.error("Error loading image:", e);
            e.target.onerror = null;
            e.target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E";
          }}
        />
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-2 -right-2 bg-[#ef4444] text-white rounded-full p-1"
            title="Hapus gambar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;
