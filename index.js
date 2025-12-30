const http = require('http');
const fs = require('fs');
const path = require('path');
const { parseLog } = require('./nlp-parser');
const { generateFeatures } = require('./feature-engineering');
const { runDetection } = require('../ml/ai-detection');
const { analyzeThreats } = require('./threat-intelligence');
const { calculateRiskScore } = require('./risk-scoring');
const { triggerAlerts } = require('./alert-manager');
const { authenticate } = require('./security');

const port = 3000;
const logsFilePath = path.join(__dirname, '..', 'data', 'logs.json');
const confirmedIncidentsFilePath = path.join(__dirname, '..', 'data', 'confirmed-incidents.json');
const falsePositivesFilePath = path.join(__dirname, '..', 'data', 'false-positives.json');
const clientPath = path.join(__dirname, '..', 'client');

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/' && req.method === 'GET') {
    const filePath = path.join(clientPath, 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (url.pathname === '/api/logs' && req.method === 'GET') {
    fs.readFile(logsFilePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading logs');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
  } else if (url.pathname === '/logs' && req.method === 'POST') {
    if (!authenticate(req)) {
      res.writeHead(401);
      res.end('Unauthorized');
      return;
    }
    
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const logString = body;
      console.log('Received log:', logString);

      const parsedLog = parseLog(logString);
      const logWithFeatures = generateFeatures(parsedLog);
      const detections = runDetection(logWithFeatures);
      const logWithDetections = { ...logWithFeatures, detections };
      const threats = analyzeThreats(logWithDetections);
      const logWithThreats = { ...logWithDetections, threats };
      const riskScore = calculateRiskScore(logWithThreats);

      const finalLog = {
        ...logWithThreats,
        riskScore,
      };

      triggerAlerts(finalLog);

      fs.readFile(logsFilePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading logs file:', err);
          res.writeHead(500);
          res.end('Error processing logs');
          return;
        }

        let allLogs = [];
        try {
          allLogs = JSON.parse(data);
        } catch (parseErr) {
          console.error('Error parsing logs file:', parseErr);
          res.writeHead(500);
          res.end('Error processing logs');
          return;
        }

        allLogs.push(finalLog);

        fs.writeFile(logsFilePath, JSON.stringify(allLogs, null, 2), (writeErr) => {
          if (writeErr) {
            console.error('Error writing logs file:', writeErr);
            res.writeHead(500);
            res.end('Error processing logs');
            return;
          }
          res.writeHead(200);
          res.end('Log processed and analyzed');
        });
      });
    });
  } else if (url.pathname === '/api/feedback/confirm' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const log = JSON.parse(body);
      fs.readFile(confirmedIncidentsFilePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading confirmed incidents file:', err);
          res.writeHead(500);
          res.end('Error processing feedback');
          return;
        }
        const incidents = JSON.parse(data);
        incidents.push(log);
        fs.writeFile(confirmedIncidentsFilePath, JSON.stringify(incidents, null, 2), (writeErr) => {
          if (writeErr) {
            console.error('Error writing confirmed incidents file:', writeErr);
            res.writeHead(500);
            res.end('Error processing feedback');
            return;
          }
          res.writeHead(200);
          res.end('Feedback received');
        });
      });
    });
  } else if (url.pathname === '/api/feedback/false-positive' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const log = JSON.parse(body);
      fs.readFile(falsePositivesFilePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading false positives file:', err);
          res.writeHead(500);
          res.end('Error processing feedback');
          return;
        }
        const falsePositives = JSON.parse(data);
        falsePositives.push(log);
        fs.writeFile(falsePositivesFilePath, JSON.stringify(falsePositives, null, 2), (writeErr) => {
          if (writeErr) {
            console.error('Error writing false positives file:', writeErr);
            res.writeHead(500);
            res.end('Error processing feedback');
            return;
          }
          res.writeHead(200);
          res.end('Feedback received');
        });
      });
    });
  } else {
    // Static file serving
    const filePath = path.join(clientPath, url.pathname);
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.wav': 'audio/wav',
      '.mp4': 'video/mp4',
      '.woff': 'application/font-woff',
      '.ttf': 'application/font-ttf',
      '.eot': 'application/vnd.ms-fontobject',
      '.otf': 'application/font-otf',
      '.wasm': 'application/wasm',
    };
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  }
});

server.listen(port, () => {
  console.log(`ThreatSense server listening at http://localhost:${port}`);
});
