export const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export const suits = ['♠', '♥', '♦', '♣'];

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

export const simulateGame = (deck) => {
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

  const pt = playerThird ? getCardValue(playerThird.rank) : null;
  const bankerDrawRule = (b) => {
    if (b >= 7) return false;
    if (b <= 2) return true;
    if (!playerThird) return b <= 5;
    if (b === 3) return pt !== 8;
    if (b === 4) return pt >= 2 && pt <= 7;
    if (b === 5) return pt >= 4 && pt <= 7;
    if (b === 6) return pt === 6 || pt === 7;
    return false;
  };

  if (bankerDrawRule(bankerPoint)) {
    bankerThird = getRandomCard(d);
    banker.push(bankerThird);
  }

  const finalPlayer = calculatePoints(player);
  const finalBanker = calculatePoints(banker);

  if (finalPlayer > finalBanker) return '閒';
  if (finalBanker > finalPlayer) return '莊';
  return '和';
};
