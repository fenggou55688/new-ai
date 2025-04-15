import React from 'react';

const RoadmapGrid = ({ title, data }) => (
  <div className="bg-white p-3 rounded-xl shadow w-full max-w-md">
    <h2 className="font-bold text-lg mb-2">{title}</h2>
    <div className="grid grid-cols-12 gap-1 text-sm">
      {Array.from({ length: 6 * 12 }).map((_, i) => {
        const col = Math.floor(i / 6);
        const row = i % 6;
        const cell = data[col]?.[row];
        return (
          <div key={i} className="w-5 h-5 border rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: cell?.value === '莊' ? 'red' : cell?.value === '閒' ? 'blue' : 'green', color: '#fff' }}>
            {cell ? '' : ''}
          </div>
        );
      })}
    </div>
  </div>
);

export default RoadmapGrid;
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
