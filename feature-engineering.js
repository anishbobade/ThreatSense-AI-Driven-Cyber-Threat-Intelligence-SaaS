const fs = require('fs');
const path = require('path');

const ipLoginAttemptsFilePath = path.join(__dirname, '..', 'data', 'ip-login-attempts.json');

function generateFeatures(parsedLog) {
  const features = {};

  if (parsedLog.event_type === 'auth_log') {
    const ip = parsedLog.source_ip;
    if (ip) {
      try {
        const data = fs.readFileSync(ipLoginAttemptsFilePath, 'utf8');
        const ipLoginAttempts = JSON.parse(data);
        ipLoginAttempts[ip] = (ipLoginAttempts[ip] || 0) + 1;
        fs.writeFileSync(ipLoginAttemptsFilePath, JSON.stringify(ipLoginAttempts, null, 2));
        features.login_attempts_per_ip = ipLoginAttempts[ip];
      } catch (err) {
        console.error('Error processing IP login attempts:', err);
      }
    }
  }

  return {
    ...parsedLog,
    features,
  };
}

module.exports = {
  generateFeatures,
};
