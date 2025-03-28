import path from 'path';
import fs from 'fs';
import winston from 'winston';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, 'temp/logs/test.log');
// Clear log file before new test execution
if (fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, ''); // Overwrite file with an empty string
}

const logger = winston.createLogger({
    level: 'info', // Set log level (info, debug, warn, error)
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Use readable timestamp format
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(), // Logs to console
        new winston.transports.File({ filename: 'temp/logs/test.log' }) // Logs to a file
    ]
});

export default logger;