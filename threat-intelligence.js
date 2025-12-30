// Placeholder for Threat Intelligence Engine

function analyzeThreats(logWithDetections) {
  const threats = [];

  // Example rule for Brute force
  const maliciousBehavior = logWithDetections.detections.find(
    (d) => d.threat_type === 'malicious_behavior'
  );
  if (maliciousBehavior) {
    threats.push({
      threat: 'Brute force attack (potential)',
      description: maliciousBehavior.description,
    });
  }

  return threats;
}

module.exports = {
  analyzeThreats,
};
