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
