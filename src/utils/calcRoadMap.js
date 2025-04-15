// utils/calcRoadMap.js
export const buildBigRoad = (history) => {
  const grid = []
  const maxRows = 6

  let col = 0
  let row = 0

  for (let i = 0; i < history.length; i++) {
    const current = history[i]
    const prev = history[i - 1]

    const currentResult = getResult(current)
    const prevResult = i > 0 ? getResult(prev) : null

    if (!grid[col]) grid[col] = Array(maxRows).fill(null)

    if (i === 0) {
      grid[col][row] = currentResult
      continue
    }

    if (currentResult === prevResult) {
      if (row + 1 < maxRows && !grid[col][row + 1]) {
        row++
      } else {
        col++
        row = 0
      }
    } else {
      col++
      row = 0
    }

    if (!grid[col]) grid[col] = Array(maxRows).fill(null)
    grid[col][row] = currentResult
  }

  return grid
}

const getResult = (round) => {
  const bankerTotal = calculatePoints(round.banker)
  const playerTotal = calculatePoints(round.player)

  if (bankerTotal > playerTotal) return 'B'
  if (playerTotal > bankerTotal) return 'P'
  return 'T'
}

const calculatePoints = (cards) => {
  const getCardValue = (rank) => {
    if (rank === 'A') return 1
    if (['10', 'J', 'Q', 'K'].includes(rank)) return 0
    return parseInt(rank)
  }
  const total = cards.reduce((sum, card) => sum + getCardValue(card.rank), 0)
  return total % 10
}
