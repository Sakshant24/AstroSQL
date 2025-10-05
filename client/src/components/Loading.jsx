import React from 'react';

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="loading-spinner"></div>
      <p className="text-cyan-400 font-orbitron">Loading Space Data...</p>
    </div>
  );
}

export default Loading;