import React, { useState } from 'react'

const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const suits = ['♠', '♥', '♦', '♣']

const buildDeck = () => {
  const deck = []
  for (let i = 0; i < 8; i++) {
    for (let suit of suits) {
      for (let rank of ranks) {
        deck.push({ rank, suit })
      }
    }
  }
  return deck
}

const getCardValue = (rank) => {
  if (rank === 'A') return 1
  if (['10', 'J', 'Q', 'K'].includes(rank)) return 0
  return parseInt(rank)
}

const calculatePoints = (cards) => {
  let total = cards.reduce((sum, card) => sum + getCardValue(card.rank), 0)
  return total % 10
}

const cloneDeck = (deck) => JSON.parse(JSON.stringify(deck))

const getRandomCard = (deck) => {
  const idx = Math.floor(Math.random() * deck.length)
  return deck.splice(idx, 1)[0]
}

const simulateGame = (deck) => {
  const d = cloneDeck(deck)
  const player = [getRandomCard(d), getRandomCard(d)]
  const banker = [getRandomCard(d), getRandomCard(d)]

  const playerPoint = calculatePoints(player)
  const bankerPoint = calculatePoints(banker)

  let playerThird = null
  let bankerThird = null

  if (playerPoint <= 5) {
    playerThird = getRandomCard(d)
    player.push(playerThird)
  }

  const bankerDrawRule = (p, b, ptCard) => {
    if (b >= 7) return false
    if (b <= 2) return true
    if (!ptCard) return b <= 5

    const pt = getCardValue(ptCard.rank)
    if (b === 3) return pt !== 8
    if (b === 4) return pt >= 2 && pt <= 7
    if (b === 5) return pt >= 4 && pt <= 7
    if (b === 6) return pt === 6 || pt === 7
    return false
  }

  if (bankerDrawRule(playerPoint, bankerPoint, playerThird)) {
    bankerThird = getRandomCard(d)
    banker.push(bankerThird)
  }

  const finalPlayer = calculatePoints(player)
  const finalBanker = calculatePoints(banker)

  if (finalPlayer > finalBanker) return '閒'
  if (finalBanker > finalPlayer) return '莊'
  return '和'
}

const App = () => {
  const [history, setHistory] = useState([])
  const [current, setCurrent] = useState({ banker: [], player: [] })
  const [result, setResult] = useState(null)

  const addCard = (side, rank) => {
    if (current[side].length >= 3) return
    const card = { rank, suit: suits[Math.floor(Math.random() * suits.length)] }
    setCurrent((prev) => ({ ...prev, [side]: [...prev[side], card] }))}
  }

  const confirmRound = () => {
    if (current.banker.length >= 2 && current.player.length >= 2) {
      setHistory([...history, current])
      setCurrent({ banker: [], player: [] })
      runSimulation([...history, current])
    }
  }

  const clearHistory = () => {
    setHistory([]) 
    setCurrent({ banker: [], player: [] })
    setResult(null)
  }

  const runSimulation = (hist) => {
    let deck = buildDeck()

    for (let round of hist) {
      for (let card of [...round.banker, ...round.player]) {
        const idx = deck.findIndex(c => c.rank === card.rank && c.suit === card.suit)
        if (idx !== -1) deck.splice(idx, 1)
      }
    }

    let counts = { 莊: 0, 閒: 0, 和: 0 }
    for (let i = 0; i < 10000; i++) {
      const winner = simulateGame(deck)
      counts[winner]++
    }

    setResult({
      banker: (counts['莊'] / 10000 * 100).toFixed(1),
      player: (counts['閒'] / 10000 * 100).toFixed(1),
      tie: (counts['和'] / 10000 * 100).toFixed(1),
    })
  }

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center p-6 text-center space-y-4">
      <h1 className="text-3xl font-bold text-red-600">AI 百家樂模擬預測</h1>

      <div className="flex flex-wrap justify-center gap-2">
        {/* 閒家按鈕排在上面 */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {ranks.map((r) => (
            <button key={r + 'p'} onClick={() => addCard('player', r)} className="bg-blue-400 text-white px-4 py-2 rounded-xl shadow">
              閒 {r}
            </button>
          ))}
        </div>
        
        {/* 莊家按鈕排在下面 */}
        <div className="flex flex-wrap justify-center gap-2">
          {ranks.map((r) => (
            <button key={r} onClick={() => addCard('banker', r)} className="bg-red-400 text-white px-4 py-2 rounded-xl shadow">
              莊 {r}
            </button>
          ))}
        </div>
        
        <button onClick={confirmRound} className="bg-green-600 text-white px-6 py-3 rounded-xl shadow">確認這局</button>
        <button onClick={clearHistory} className="bg-gray-400 text-white px-6 py-3 rounded-xl shadow">清除</button>
      </div>

      <div className="text-lg font-semibold text-gray-800">
        {result ? (
          <>
            <div>預測勝率：</div>
            <div>莊 {result.banker}%、閒 {result.player}%、和 {result.tie}%</div>
          </>
        ) : (
          <div>尚未預測</div>
        )}
      </div>

      <div className="w-full max-w-md">
        <h2 className="text-xl font-bold mt-6">歷史紀錄</h2>
        <ul className="text-left text-gray-700 space-y-1">
          {history.map((round, i) => (
            <li key={i}>
              第 {i + 1} 局 - 莊: {round.banker.map(c => c.rank + c.suit).join(', ')}，閒: {round.player.map(c => c.rank + c.suit).join(', ')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
