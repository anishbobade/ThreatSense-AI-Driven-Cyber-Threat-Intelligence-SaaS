// NLP Log Parser

function parseFirewallLog(logString) {
  const regex = /SRC=([\d.]+) DST=([\d.]+) .* PROTO=([\w]+) .* DPT=([\d]+)/;
  const match = logString.match(regex);
  if (match) {
    return {
      source_ip: match[1],
      destination_ip: match[2],
      protocol: match[3],
      port: parseInt(match[4], 10),
      event_type: 'firewall_log',
    };
  }
  return null;
}

function parseOsEventLog(logString) {
  const parts = logString.split(',');
  if (parts.length >= 5) {
    return {
      timestamp: parts[0],
      event_type: 'os_event_log',
      status_code: parts[2],
      device_id: parts[1],
    };
  }
  return null;
}

function parseServerAccessLog(logString) {
  const regex = /^([\d.]+) .*\[(.*)\] "(\w+) (.*) HTTP\/[\d.]+" (\d+)/;
  const match = logString.match(regex);
  if (match) {
    return {
      source_ip: match[1],
      timestamp: match[2],
      protocol: 'HTTP',
      status_code: parseInt(match[5], 10),
      event_type: 'server_access_log',
    };
  }
  return null;
}

function parseApiRequestLog(logString) {
  try {
    const log = JSON.parse(logString);
    return {
      timestamp: log.timestamp,
      source_ip: log.source_ip,
      destination_ip: log.destination_ip,
      port: log.port,
      protocol: log.protocol,
      event_type: log.event_type,
      status_code: log.status_code,
      device_id: log.device_id,
    };
  } catch (e) {
    return null;
  }
}

function parseAuthLog(logString) {
  const regex = /from ([\d.]+) port (\d+)/;
  const match = logString.match(regex);
  if (match) {
    return {
      source_ip: match[1],
      port: parseInt(match[2], 10),
      event_type: 'auth_log',
    };
  }
  return null;
}

function parseLog(logString) {
  let parsedLog = null;

  if (logString.includes('[UFW BLOCK]')) {
    parsedLog = parseFirewallLog(logString);
  } else if (logString.includes('Microsoft-Windows-Security-Auditing')) {
    parsedLog = parseOsEventLog(logString);
  } else if (logString.includes('HTTP/')) {
    parsedLog = parseServerAccessLog(logString);
  } else if (logString.startsWith('{')) {
    parsedLog = parseApiRequestLog(logString);
  } else if (logString.includes('sshd')) {
    parsedLog = parseAuthLog(logString);
  }

  if (parsedLog) {
    return {
      ...parsedLog,
      original_log: logString,
    };
  }

  return {
    original_log: logString,
    error: 'Unknown log format',
  };
}

module.exports = {
  parseLog,
};
