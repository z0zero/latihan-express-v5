import React from "react";

const ErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-[#fee2e2] border border-[#f87171] text-[#b91c1c] p-3 rounded mb-4">
      {message}
    </div>
  );
};

export default ErrorAlert;
