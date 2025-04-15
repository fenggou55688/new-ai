import React, { useState } from 'react'

const App = () => {
  const [history, setHistory] = useState([])
  const [result, setResult] = useState(null)

  const addResult = (res) => {
    const newHistory = [...history, res]
    setHistory(newHistory)
    predict(newHistory)
  }

  const clearHistory = () => {
    setHistory([])
    setResult(null)
  }

  const simulatePrediction = (history) => {
    const bankerWinRate = 60 + Math.random() * 10
    const tieRate = 5 + Math.random() * 5
    const total = 100 + tieRate
    return {
      banker: bankerWinRate,
      player: 100 - bankerWinRate - tieRate,
      tie: tieRate,
    }
  }

  const aiPrediction = (history) => {
    const countBanker = history.filter(r => r === '莊').length
    const countPlayer = history.filter(r => r === '閒').length
    const countTie = history.filter(r => r === '和').length
    const total = countBanker + countPlayer + countTie || 1
    return {
      banker: (countBanker / total) * 100,
      player: (countPlayer / total) * 100,
      tie: (countTie / total) * 100,
    }
  }

  const getWeight = (length) => {
    if (length <= 5) return { sim: 0.8, ai: 0.2 }
    if (length <= 10) return { sim: 0.6, ai: 0.4 }
    return { sim: 0.4, ai: 0.6 }
  }

  const predict = (history) => {
    const sim = simulatePrediction(history)
    const ai = aiPrediction(history)
    const weight = getWeight(history.length)
    const final = {
      banker: sim.banker * weight.sim + ai.banker * weight.ai,
      player: sim.player * weight.sim + ai.player * weight.ai,
      tie: sim.tie * weight.sim + ai.tie * weight.ai,
    }
    const max = Math.max(final.banker, final.player, final.tie)
    let winner = '和'
    if (max === final.banker) winner = '莊'
    else if (max === final.player) winner = '閒'

    setResult({
      winner,
      banker: final.banker.toFixed(1),
      player: final.player.toFixed(1),
      tie: final.tie.toFixed(1),
      sim: sim.banker.toFixed(1),
      ai: ai.banker.toFixed(1),
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-red-100 flex flex-col items-center justify-center p-6 text-center font-bold text-lg space-y-4">
      <h1 className="text-3xl text-red-700 drop-shadow">AI 百家樂預測</h1>
      <div className="space-x-4">
        <button onClick={() => addResult('莊')} className="px-6 py-3 bg-red-500 text-white rounded-2xl text-xl shadow-xl hover:bg-red-600">莊</button>
        <button onClick={() => addResult('閒')} className="px-6 py-3 bg-blue-500 text-white rounded-2xl text-xl shadow-xl hover:bg-blue-600">閒</button>
        <button onClick={() => addResult('和')} className="px-6 py-3 bg-green-500 text-white rounded-2xl text-xl shadow-xl hover:bg-green-600">和</button>
        <button onClick={clearHistory} className="px-6 py-3 bg-gray-400 text-white rounded-2xl text-xl shadow-xl hover:bg-gray-500">清除</button>
      </div>
      
      {/* 顯示歷史紀錄 */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">歷史紀錄：</h2>
        <div className="text-lg text-gray-800">
          {history.length > 0 ? (
            history.map((res, index) => (
              <span key={index} className="mr-2 text-sm">{res}</span>
            ))
          ) : (
            <div>尚未有歷史紀錄</div>
          )}
        </div>
      </div>

      <div className="text-xl text-gray-800 mt-4">
        {result ? (
          <>
            <div>預測勝方：<span className="text-red-600">{result.winner}</span></div>
            <div>機率：莊 {result.banker}%、閒 {result.player}%、和 {result.tie}%</div>
            <div className="text-sm text-gray-600">(模擬 {result.sim}%，AI {result.ai}%)</div>
          </>
        ) : (
          <div>尚未預測</div>
        )}
      </div>
    </div>
  )
}

export default App
