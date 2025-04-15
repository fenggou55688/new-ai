export function generateBigRoad(history) {
  const grid = Array.from({ length: 100 }, () => Array(6).fill(null));
  let col = 0;
  let row = 0;

  for (let i = 0; i < history.length; i++) {
    const current = history[i];
    const prev = history[i - 1];

    if (i === 0) {
      grid[col][row] = current;
      continue;
    }

    if (current === prev) {
      if (row + 1 < 6 && !grid[col][row + 1]) {
        row++;
      } else {
        col++;
        row = 0;
      }
    } else {
      col++;
      row = 0;
    }

    if (!grid[col]) grid[col] = Array(6).fill(null);
    grid[col][row] = current;
  }

  return grid;
}