// Placeholder for Risk Scoring Engine

function calculateRiskScore(logWithThreats) {
  let score = 0;

  if (logWithThreats.detections) {
    score += logWithThreats.detections.length * 20;
  }

  if (logWithThreats.threats) {
    score += logWithThreats.threats.length * 40;
  }

  // Cap the score at 100
  score = Math.min(score, 100);

  let level;
  if (score <= 30) {
    level = 'Safe';
  } else if (score <= 70) {
    level = 'Medium';
  } else {
    level = 'Critical';
  }

  return {
    score,
    level,
  };
}

module.exports = {
  calculateRiskScore,
};
