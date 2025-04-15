const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suits = ['♠', '♥', '♦', '♣'];

export const buildDeck = () => {
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

export const getCardValue = (rank) => {
  if (rank === 'A') return 1;
  if (['10', 'J', 'Q', 'K'].includes(rank)) return 0;
  return parseInt(rank);
};

export const calculatePoints = (cards) => {
  let total = cards.reduce((sum, card) => sum + getCardValue(card.rank), 0);
  return total % 10;
};

export const simulateGame = (deck) => {
  const d = [...deck];
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

  if (bankerPoint <= 5) {
    bankerThird = getRandomCard(d);
    banker.push(bankerThird);
  }

  const finalPlayer = calculatePoints(player);
  const finalBanker = calculatePoints(banker);

  if (finalPlayer > finalBanker) return '閒';
  if (finalBanker > finalPlayer) return '莊';
  return '和';
};

const getRandomCard = (deck) => {
  const idx = Math.floor(Math.random() * deck.length);
  return deck.splice(idx, 1)[0];
};
