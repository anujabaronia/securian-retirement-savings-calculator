import path from 'path';
import fs from 'fs';
import winston from 'winston';

/* Define the log file path */
const logFilePath = path.resolve('./temp/logs/test.log');

/* Clear log file before new test execution */
if (!fs.existsSync(logFilePath)) {
    fs.mkdirSync(logFilePath, { recursive: true });
}

/* Create a logger instance using Winston */
const logger = winston.createLogger({
    level: 'info', 
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(), /* Logs to console */
        new winston.transports.File({ filename: './temp/logs/test.log' }) /* Logs to a file */
    ]
});

export default logger;