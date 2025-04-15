const history = [];

function addResult(result) {
  history.push(result);
  predict();
}

function clearHistory() {
  history.length = 0;
  document.getElementById('prediction').innerHTML = '尚未預測';
}

function simulatePrediction(history) {
  // 簡易模擬模型
  const bankerWinRate = 60 + Math.random() * 10;
  return {
    banker: bankerWinRate,
    player: 100 - bankerWinRate
  };
}

function aiPrediction(history) {
  // 假設 AI 是學習的走勢模式，這邊簡單模擬
  let countBanker = history.filter(r => r === '莊').length;
  let countPlayer = history.filter(r => r === '閒').length;
  let total = countBanker + countPlayer || 1;
  return {
    banker: (countBanker / total) * 100,
    player: (countPlayer / total) * 100
  };
}

function getWeight(length) {
  if (length <= 5) return { sim: 0.8, ai: 0.2 };
  if (length <= 10) return { sim: 0.6, ai: 0.4 };
  return { sim: 0.4, ai: 0.6 };
}

function predict() {
  const sim = simulatePrediction(history);
  const ai = aiPrediction(history);
  const weight = getWeight(history.length);

  const final = {
    banker: sim.banker * weight.sim + ai.banker * weight.ai,
    player: sim.player * weight.sim + ai.player * weight.ai
  };

  const winner = final.banker > final.player ? '莊' : '閒';
  document.getElementById('prediction').innerHTML = `
    預測勝方：<strong>${winner}</strong><br>
    機率：莊 ${final.banker.toFixed(1)}%、閒 ${final.player.toFixed(1)}%<br>
    <small>(模擬 ${sim.banker.toFixed(1)}%，AI ${ai.banker.toFixed(1)}%)</small>
  `;
}