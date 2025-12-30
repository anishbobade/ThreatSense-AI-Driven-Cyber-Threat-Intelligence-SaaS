// Placeholder for Security Layer

const API_KEY = 'your-secret-api-key'; // TODO: Use environment variables for this

function authenticate(req) {
  const apiKey = req.headers['x-api-key'];
  return apiKey && apiKey === API_KEY;
}

module.exports = {
  authenticate,
};
