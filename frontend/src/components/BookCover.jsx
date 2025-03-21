import React from "react";

const BookCover = ({ coverUrl, title, size = "medium" }) => {
  // Ukuran berdasarkan prop size
  const sizes = {
    small: "h-16 w-12",
    medium: "h-20 w-16",
    large: "h-32 w-24",
  };

  const sizeClass = sizes[size] || sizes.medium;

  if (coverUrl) {
    return (
      <img
        src={`http://localhost:3000${coverUrl}`}
        alt={`Cover ${title}`}
        className={`${sizeClass} object-cover rounded shadow`}
        onError={(e) => {
          console.error("Error loading image:", e);
          e.target.onerror = null;
          e.target.src =
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E";
        }}
      />
    );
  }

  // Placeholder jika tidak ada cover
  return (
    <div
      className={`${sizeClass} bg-[#e5e7eb] rounded flex items-center justify-center text-[#9ca3af]`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  );
};

export default BookCover;
