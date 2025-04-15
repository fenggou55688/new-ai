import React from 'react';

const RoadmapGrid = ({ title, data }) => {
  return (
    <div className="w-full max-w-lg mt-8">
      <h2 className="text-2xl font-bold text-center text-gray-700">{title}</h2>
      <div className="grid grid-cols-6 gap-1 mt-4">
        {data.map((row, rowIndex) => (
          <div key={rowIndex} className="flex space-x-1">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  cell === '莊' ? 'bg-red-600 text-white' : cell === '閒' ? 'bg-blue-600 text-white' : 'bg-gray-400 text-white'
                }`}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapGrid;
