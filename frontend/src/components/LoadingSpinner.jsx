import React from "react";

const LoadingSpinner = ({ fullScreen = true }) => {
  const spinnerClasses =
    "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3b82f6]";

  if (fullScreen) {
    return (
      <div className="flex justify-center items-center min-h-[100vh]">
        <div className={spinnerClasses}></div>
      </div>
    );
  }

  return <div className={spinnerClasses}></div>;
};

export default LoadingSpinner;
