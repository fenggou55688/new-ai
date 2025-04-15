import React from 'react';

const RoadmapGrid = ({ title, data }) => {
  return (
    <div className="mt-6 w-full max-w-full overflow-auto">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div className="grid grid-cols-[repeat(50,minmax(0,1fr))] gap-1">
        {Array(6).fill(null).map((_, row) =>
          data.map((col, colIndex) => {
            const cell = col[row];
            return (
              <div
                key={`${colIndex}-${row}`}
                className="w-6 h-6 flex items-center justify-center border bg-white rounded-full"
              >
                {cell === '莊' && <div className="w-4 h-4 bg-red-500 rounded-full" />}
                {cell === '閒' && <div className="w-4 h-4 bg-blue-500 rounded-full" />}
                {cell === '和' && <div className="w-4 h-4 bg-green-500 rounded-full" />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RoadmapGrid;