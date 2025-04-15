export function buildDeck() {
  const suits = ['♠', '♥', '♣', '♦'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck = [];
  for (let i = 0; i < 8; i++) {
    for (const suit of suits) {
      for (const value of values) {
        deck.push({ suit, value });
      }
    }
  }
  return deck;
}

export function simulateGame(deck) {
  const outcome = ['莊', '閒', '和'];
  return outcome[Math.floor(Math.random() * outcome.length)];
}