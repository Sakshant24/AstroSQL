import React from 'react';

function StatCard({ title, value, label }) {
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg text-center">
      <h3 className="text-lg font-semibold text-cyan-400">{title}</h3>
      <p className="text-4xl font-bold mt-2">{value}</p>
      <p className="text-slate-400 mt-1">{label}</p>
    </div>
  );
}

export default StatCard;