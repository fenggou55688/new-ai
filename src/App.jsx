import React, { useState } from "react";
import { motion } from "framer-motion";

const outcomes = ["莊", "閒", "和"];

export default function App() {
  const [history, setHistory] = useState([]);
  const [prediction, setPrediction] = useState(null);

  const shuffleDeck = () => {
    const deck = [];
    const suits = ["♠", "♥", "♦", "♣"];
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

    for (let i = 0; i < 8; i++) {
      for (const suit of suits) {
        for (const value of values) {
          deck.push(value > 10 ? 0 : value);
        }
      }
    }
    return deck.sort(() => Math.random() - 0.5);
  };

  const drawCard = (deck) =>
    deck.splice(Math.floor(Math.random() * deck.length), 1)[0];

  const getPoint = (cards) => cards.reduce((sum, c) => sum + c, 0) % 10;

  const winner = (p, b) => {
    if (p > b) return "閒";
    if (b > p) return "莊";
    return "和";
  };

  const simulateGame = (deck) => {
    const player = [drawCard(deck), drawCard(deck)];
    const banker = [drawCard(deck), drawCard(deck)];

    const playerPoint = getPoint(player);
    const bankerPoint = getPoint(banker);

    if (playerPoint >= 8 || bankerPoint >= 8) {
      return winner(playerPoint, bankerPoint);
    }

    let playerThird = null;
    if (playerPoint <= 5) {
      playerThird = drawCard(deck);
      player.push(playerThird);
    }

    let bankerDraw = false;
    if (playerThird === null) {
      if (bankerPoint <= 5) bankerDraw = true;
    } else {
      if (
        bankerPoint <= 2 ||
        (bankerPoint === 3 && playerThird !== 8) ||
        (bankerPoint === 4 && playerThird >= 2 && playerThird <= 7) ||
        (bankerPoint === 5 && playerThird >= 4 && playerThird <= 7) ||
        (bankerPoint === 6 && playerThird >= 6 && playerThird <= 7)
      ) {
        bankerDraw = true;
      }
    }

    if (bankerDraw) banker.push(drawCard(deck));

    return winner(getPoint(player), getPoint(banker));
  };

  const predictNext = (history) => {
    setPrediction(null);

    setTimeout(() => {
      let bankerCount = 0;
      let playerCount = 0;

      const simulations = 1000;
      for (let i = 0; i < simulations; i++) {
        let deck = shuffleDeck();
        for (const _ of history) {
          simulateGame(deck);
        }
        const result = simulateGame(deck);
        if (result === "莊") bankerCount++;
        else if (result === "閒") playerCount++;
      }

      const total = bankerCount + playerCount;
      const probBanker = (bankerCount / total) * 100;
      const probPlayer = (playerCount / total) * 100;

      setPrediction({
        winner: probBanker > probPlayer ? "莊" : "閒",
        probBanker: probBanker.toFixed(1),
        probPlayer: probPlayer.toFixed(1),
      });
    }, 50);
  };

  const addResult = (result) => {
    const newHistory = [...history, result];
    setHistory(newHistory);
    predictNext(newHistory);
  };

  const clearHistory = () => {
    setHistory([]);
    setPrediction(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-red-200 p-6">
      <motion.h1
        className="text-4xl font-bold text-center text-red-800 mb-6 drop-shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        神算百家樂預測器
      </motion.h1>

      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex justify-center gap-4 flex-wrap">
          {outcomes.map((label) => (
            <button
              key={label}
              className="text-xl px-6 py-4 bg-red-600 text-white rounded-2xl shadow-md hover:bg-red-700"
              onClick={() => addResult(label)}
            >
              {label}
            </button>
          ))}
          <button
            className="text-xl px-6 py-4 bg-gray-500 text-white rounded-2xl shadow-md hover:bg-gray-600"
            onClick={clearHistory}
          >
            清除紀錄
          </button>
        </div>

        <div className="text-center text-lg mt-4">
          <p>歷史紀錄：{history.join(" → ") || "尚未輸入"}</p>
        </div>

        {prediction ? (
          <div className="text-center text-2xl mt-6 font-bold text-red-700">
            推測下一局勝方：{prediction.winner}
            <p className="text-base font-normal mt-2 text-black">
              莊機率：{prediction.probBanker}%　閒機率：{prediction.probPlayer}%
            </p>
          </div>
        ) : (
          <div className="text-center text-xl mt-6 text-gray-600">計算中...</div>
        )}
      </div>
    </div>
  );
}
