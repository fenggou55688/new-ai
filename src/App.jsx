import React, { useState } from 'react';
import { simulateGame, buildDeck } from './utils/deck';
import { generateBigRoad } from './utils/roadmap';
import RoadmapGrid from './components/RoadmapGrid';

const App = () => {
  const [history, setHistory] = useState([]);
  const [deck, setDeck] = useState(buildDeck());
  const [prediction, setPrediction] = useState(null);

  const handleInput = (result) => {
    setHistory([...history, result]);
  };

  const handleSimulate = () => {
    const stats = { 莊: 0, 閒: 0, 和: 0 };
    for (let i = 0; i < 10000; i++) {
      const result = simulateGame(deck);
      stats[result]++;
    }

    const total = stats.莊 + stats.閒 + stats.和;
    const predict = Object.entries(stats).reduce((a, b) => (a[1] > b[1] ? a : b));
    setPrediction({
      result: predict[0],
      confidence: ((predict[1] / total) * 100).toFixed(2) + '%',
    });
  };

  const handleClear = () => {
    setHistory([]);
    setDeck(buildDeck());
    setPrediction(null);
  };

  const bigRoad = generateBigRoad(history);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-red-100 p-6 flex flex-col items-center space-y-6">
      <h1 className="text-3xl font-bold text-red-700">AI 百家樂預測系統</h1>

      {/* 按鈕區 */}
      <div className="flex space-x-3">
        {['莊', '閒', '和'].map((item) => (
          <button
            key={item}
            className={`px-6 py-3 rounded-xl text-white text-xl shadow-md ${
              item === '莊' ? 'bg-red-600' : item === '閒' ? 'bg-blue-600' : 'bg-green-600'
            }`}
            onClick={() => handleInput(item)}
          >
            {item}
          </button>
        ))}
        <button onClick={handleClear} className="bg-gray-500 text-white px-4 py-3 rounded-xl shadow">
          清除紀錄
        </button>
      </div>

      {/* 預測結果 */}
      {prediction && (
        <div className="bg-white p-4 rounded-xl shadow-lg text-lg">
          預測結果：<span className="font-bold text-red-600">{prediction.result}</span>（信心值：{prediction.confidence}）
        </div>
      )}

      {/* 模擬按鈕 */}
      <button
        onClick={handleSimulate}
        className="bg-purple-600 text-white px-6 py-3 rounded-xl shadow text-xl"
      >
        模擬預測下一局
      </button>

      {/* 大路圖顯示 */}
      <RoadmapGrid title="大路" data={bigRoad} />
    </div>
  );
};
import { buildBigRoad } from './utils/calcRoadMap'

export default App;
