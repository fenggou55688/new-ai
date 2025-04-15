import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suits = ['♠', '♥', '♦', '♣'];

// 馬可夫鏈轉移矩陣
const markovChain = {
  '莊': { '莊': 0.5, '閒': 0.4, '和': 0.1 },
  '閒': { '莊': 0.4, '閒': 0.5, '和': 0.1 },
  '和': { '莊': 0.33, '閒': 0.33, '和': 0.34 }
};

const buildDeck = () => {
  const deck = [];
  for (let i = 0; i < 8; i++) {
    for (let suit of suits) {
      for (let rank of ranks) {
        deck.push({ rank, suit });
      }
    }
  }
  return deck;
};

const getCardValue = (rank) => {
  if (rank === 'A') return 1;
  if (['10', 'J', 'Q', 'K'].includes(rank)) return 0;
  return parseInt(rank);
};

const calculatePoints = (cards) => {
  let total = cards.reduce((sum, card) => sum + getCardValue(card.rank), 0);
  return total % 10;
};

const cloneDeck = (deck) => JSON.parse(JSON.stringify(deck));

const getRandomCard = (deck) => {
  const idx = Math.floor(Math.random() * deck.length);
  return deck.splice(idx, 1)[0];
};

// 馬可夫鏈預測
const predictNextRound = (currentState) => {
  const transitionProbabilities = markovChain[currentState];
  const rand = Math.random();
  let cumulativeProbability = 0;

  for (let [state, probability] of Object.entries(transitionProbabilities)) {
    cumulativeProbability += probability;
    if (rand < cumulativeProbability) {
      return state;
    }
  }
  return '莊'; // Default to "莊" if the random number doesn't fall within probabilities
};

const simulateGame = (deck) => {
  const d = cloneDeck(deck);
  const player = [getRandomCard(d), getRandomCard(d)];
  const banker = [getRandomCard(d), getRandomCard(d)];

  const playerPoint = calculatePoints(player);
  const bankerPoint = calculatePoints(banker);

  let playerThird = null;
  let bankerThird = null;

  if (playerPoint <= 5) {
    playerThird = getRandomCard(d);
    player.push(playerThird);
  }

  const bankerDrawRule = (p, b, ptCard) => {
    if (b >= 7) return false;
    if (b <= 2) return true;
    if (!ptCard) return b <= 5;

    const pt = getCardValue(ptCard.rank);
    if (b === 3) return pt !== 8;
    if (b === 4) return pt >= 2 && pt <= 7;
    if (b === 5) return pt >= 4 && pt <= 7;
    if (b === 6) return pt === 6 || pt === 7;
    return false;
  };

  if (bankerDrawRule(playerPoint, bankerPoint, playerThird)) {
    bankerThird = getRandomCard(d);
    banker.push(bankerThird);
  }

  const finalPlayer = calculatePoints(player);
  const finalBanker = calculatePoints(banker);

  if (finalPlayer > finalBanker) return '閒';
  if (finalBanker > finalPlayer) return '莊';
  return '和';
};

// 神經網絡模型訓練
const trainModel = async () => {
  const data = [
    { features: [3, 7, 1, 8], label: '莊' },
    { features: [4, 6, 2, 5], label: '閒' },
    // 更多數據...
  ];

  const xs = tf.tensor2d(data.map(d => d.features));
  const ys = tf.tensor1d(data.map(d => d.label === '莊' ? 1 : d.label === '閒' ? 2 : 3));

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 32, inputShape: [4], activation: 'relu' }));
  model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));

  model.compile({ optimizer: 'adam', loss: 'sparseCategoricalCrossentropy', metrics: ['accuracy'] });

  await model.fit(xs, ys, { epochs: 10 });

  return model;
};

const App = () => {
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState({ banker: [], player: [] });
  const [result, setResult] = useState(null);
  const [model, setModel] = useState(null);

  useEffect(() => {
    // 訓練機器學習模型
    const initModel = async () => {
      const trainedModel = await trainModel();
      setModel(trainedModel);
    };
    initModel();
  }, []);

  const addCard = (side, rank) => {
    if (current[side].length >= 3) return;
    const card = { rank, suit: suits[Math.floor(Math.random() * suits.length)] };
    setCurrent((prev) => ({ ...prev, [side]: [...prev[side], card] }));
  };

  const confirmRound = () => {
    if (current.banker.length >= 2 && current.player.length >= 2) {
      setHistory([...history, current]);
      setCurrent({ banker: [], player: [] });
      runSimulation([...history, current]);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setCurrent({ banker: [], player: [] });
    setResult(null);
  };

  const runSimulation = async (hist) => {
    let deck = buildDeck();

    for (let round of hist) {
      for (let card of [...round.banker, ...round.player]) {
        const idx = deck.findIndex(c => c.rank === card.rank && c.suit === card.suit);
        if (idx !== -1) deck.splice(idx, 1);
      }
    }

    let counts = { 莊: 0, 閒: 0, 和: 0 };

    for (let i = 0; i < 50000; i++) {
      const winner = predictNextRound('莊'); // 馬可夫鏈預測下一局
      counts[winner]++;
    }

    if (model) {
      const prediction = model.predict(tf.tensor2d([[3, 7, 1, 8]])); // 輸入特徵進行預測
      const predictedLabel = prediction.argMax(-1).dataSync()[0];
      const label = predictedLabel === 0 ? '莊' : predictedLabel === 1 ? '閒' : '和';
      console.log(`AI預測結果: ${label}`);
    }

    setResult({
      banker: (counts['莊'] / 50000 * 100).toFixed(1),
      player: (counts['閒'] / 50000 * 100).toFixed(1),
      tie: (counts['和'] / 50000 * 100).toFixed(1),
    });
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center p-6 text-center space-y-4">
      <h1 className="text-3xl font-bold text-red-600">AI 百家樂模擬預測</h1>

      {/* 莊家點數按鈕列 */}
      <div className="flex flex-col items-center space-y-2">
        <div className="flex flex-wrap justify-center gap-2">
          {ranks.map((r) => (
            <button key={r} onClick={() => addCard('banker', r)} className="bg-red-400 text-white px-4 py-2 rounded-xl shadow">
              莊 {r}
            </button>
          ))}
        </div>
      </div>

      {/* 閒家點數按鈕列 */}
      <div className="flex flex-col items-center space-y-2">
        <div className="flex flex-wrap justify-center gap-2">
          {ranks.map((r) => (
            <button key={r + 'p'} onClick={() => addCard('player', r)} className="bg-blue-400 text-white px-4 py-2 rounded-xl shadow">
              閒 {r}
            </button>
          ))}
        </div>
      </div>

      {/* 確認與清除按鈕 */}
      <div className="flex space-x-4 mt-4">
        <button onClick={confirmRound} className="bg-green-600 text-white px-6 py-3 rounded-xl shadow">確認這局</button>
        <button onClick={clearHistory} className="bg-gray-400 text-white px-6 py-3 rounded-xl shadow">清除</button>
      </div>

      {/* 預測結果顯示 */}
      <div className="text-lg font-semibold text-gray-800 mt-4">
        {result ? (
          <>
            <div>預測勝率：</div>
            <div>莊 {result.banker}%、閒 {result.player}%、和 {result.tie}%</div>
          </>
        ) : (
          <div>尚未預測</div>
        )}
      </div>

      {/* 歷史紀錄顯示 */}
      <div className="w-full max-w-md mt-6">
        <h2 className="text-xl font-bold">歷史紀錄</h2>
        <ul className="text-left text-gray-700 space-y-1">
          {history.map((round, idx) => (
            <li key={idx}>
              {round.player.map(c => `${c.rank}${c.suit}`).join(', ')} &gt; {round.banker.map(c => `${c.rank}${c.suit}`).join(', ')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
