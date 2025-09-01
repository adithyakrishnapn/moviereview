import React from "react";

const Loading = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-600 border-opacity-80"></div>
      <span className="mt-6 text-white text-xl font-semibold">Loading...</span>
    </div>
  </div>
);

export default Loading;
