export const generateBigRoad = (history) => {
  let bigRoad = [];
  history.forEach((result) => {
    if (bigRoad.length === 0 || bigRoad[bigRoad.length - 1].length === 6) {
      bigRoad.push([]);
    }
    const lastRow = bigRoad[bigRoad.length - 1];
    lastRow.push(result);
  });
  return bigRoad;
};
