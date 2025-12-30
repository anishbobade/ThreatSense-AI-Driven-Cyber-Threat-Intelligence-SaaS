document.addEventListener('DOMContentLoaded', () => {
  const dashboard = document.getElementById('dashboard');

  function renderLog(log) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';

    let content = '';
    for (const [key, value] of Object.entries(log)) {
      content += `<div class="log-field"><strong>${key}:</strong> ${JSON.stringify(value)}</div>`;
    }

    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Confirm Incident';
    confirmButton.onclick = () => sendFeedback('confirm', log);

    const falsePositiveButton = document.createElement('button');
    falsePositiveButton.textContent = 'False Positive';
    falsePositiveButton.onclick = () => sendFeedback('false-positive', log);

    entry.innerHTML = content;
    entry.appendChild(confirmButton);
    entry.appendChild(falsePositiveButton);

    return entry;
  }

  function sendFeedback(type, log) {
    fetch(`/api/feedback/${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(log),
    })
      .then((response) => {
        if (response.ok) {
          alert('Feedback submitted successfully');
        } else {
          alert('Error submitting feedback');
        }
      })
      .catch((error) => {
        console.error('Error submitting feedback:', error);
        alert('Error submitting feedback');
      });
  }

  function fetchLogs() {
    fetch('/api/logs')
      .then((response) => response.json())
      .then((logs) => {
        dashboard.innerHTML = '';
        logs.forEach((log) => {
          dashboard.appendChild(renderLog(log));
        });
      })
      .catch((error) => {
        console.error('Error fetching logs:', error);
        dashboard.innerHTML = '<p>Error loading logs. Please try again later.</p>';
      });
  }

  // Fetch logs every 5 seconds
  fetchLogs();
  setInterval(fetchLogs, 5000);
});
