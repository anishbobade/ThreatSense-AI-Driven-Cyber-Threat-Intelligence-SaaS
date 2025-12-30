# ThreatSense – AI-Driven Cyber Threat Intelligence SaaS

This is a prototype of the ThreatSense platform, an AI-driven cyber threat intelligence SaaS.

## Project Structure

- `client/`: Contains the frontend dashboard files (HTML, CSS, JS).
- `data/`: Stores the collected logs, feedback, and other data.
- `docs/`: Contains project documentation, including sample log formats.
- `ml/`: Contains the AI detection models (placeholders).
- `scripts/`: (empty) Intended for deployment and other scripts.
- `server/`: Contains the backend Node.js server files.
- `Dockerfile`: For containerizing the application.
- `.dockerignore`: Specifies files to be excluded from the Docker image.

## How to Run

1.  **Dependencies**: The server uses `express`. In a real environment, you would run `npm install` in the `threat-sense/server` directory. Due to the current environment's limitations, the `express` dependency is included in `package.json` but not installed.

2.  **Start the server**:
    ```bash
    node threat-sense/server/index.js
    ```
    The server will start on `http://localhost:3000`.

3.  **Access the dashboard**:
    Open your browser and go to `http://localhost:3000`. You will see the ThreatSense dashboard, which displays the latest logs.

4.  **Send logs**:
    To send a log to the server, make a POST request to `http://localhost:3000/logs` with the log string as the request body and the `X-API-KEY` header set to `your-secret-api-key`.

    Example using `curl`:
    ```bash
    curl -X POST -H "Content-Type: text/plain" -H "X-API-KEY: your-secret-api-key" -d 'Dec 31 12:36:00 sshd[12345]: Accepted password for user123 from 203.0.113.12 port 54321 ssh2' http://localhost:3000/logs
    ```

## Features

- **Log Processing Pipeline**: The server processes incoming logs through a pipeline:
    1.  **NLP Log Parser**: Parses unstructured logs into structured data.
    2.  **Feature Engineering**: Generates behavioral features from the logs.
    3.  **AI Detection**: Runs (placeholder) AI models to detect threats.
    4.  **Threat Intelligence**: Analyzes detections to identify complex threats.
    5.  **Risk Scoring**: Calculates a risk score for each log.
    6.  **Alerting**: Triggers alerts for critical threats.
- **Dashboard**: A simple web interface to view the processed logs.
- **Feedback Mechanism**: Users can mark logs as "Confirmed Incidents" or "False Positives" from the dashboard.
- **Security**: The `/logs` endpoint is protected by a simple API key authentication.
- **Dockerization**: A `Dockerfile` is provided for containerizing the server.

## Limitations

- **No real AI models**: The AI detection layer uses placeholder functions with simple rules.
- **File-based database**: The application uses JSON files for data storage, which is not suitable for production.
- **No real-time updates**: The dashboard polls for new logs every 5 seconds.
- **Manual dependency management**: `npm` is not used in this environment.

This prototype provides a solid foundation for building a full-fledged ThreatSense platform.
