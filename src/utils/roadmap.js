// 根據勝負紀錄（如：['莊', '閒', '莊']）產生大路
export const generateBigRoad = (history) => {
  const grid = [];
  let col = 0, row = 0;

  history.forEach((res, i) => {
    if (i === 0) {
      grid[0] = [{ value: res }];
    } else {
      const prev = history[i - 1];
      if (res === prev) {
        if (!grid[col]) grid[col] = [];
        while (grid[col][row + 1]) row++;
        grid[col][row + 1] = { value: res };
        row++;
      } else {
        col++;
        row = 0;
        if (!grid[col]) grid[col] = [];
        grid[col][0] = { value: res };
      }
    }
  });

  return grid;
};
