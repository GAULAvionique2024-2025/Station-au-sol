import { format, transports, createLogger } from "winston";
import "winston-daily-rotate-file";
import chalk from "chalk";

const logDir = "./logs";

function createCustomFormat(formatList) {
    return format.combine(
        // Convert log level to uppercase (info -> INFO)
        format((info) => ({
            ...info,
            level: info.level.toUpperCase(),
            label: info.label ? info.label : "Global",
        }))(),
        // Configure timestamp format
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        // Allows for logging error instances (logger.log(error))
        format.errors({ stack: true }),
        // Custom format from the function arguments
        ...formatList,
        // Configure the message format
        format.printf(({ timestamp, label, level, message }) => {
            if (label) {
                return `${timestamp} ${level} [${label}] ${message}`;
            } else {
                return `${timestamp} ${level} ${message}`;
            }
        })
    );
}

export default createLogger({
    transports: [
        //
        // Write all logs to console.
        //
        new transports.Console({
            format: createCustomFormat([
                // Add color to the log level and label
                format.colorize({ all: true }),
                format((info) => ({ ...info, label: chalk.grey(info.label) }))(),
            ]),
        }),
        //
        // Write all log error to log-error-%DATE%.log.
        // It will append logs for the same day in the same file.
        //
        new transports.DailyRotateFile({
            level: "error", // Only log level error
            dirname: logDir,
            filename: "log-error-%DATE%.log",
            format: createCustomFormat([
                // Strip color characters from the message
                format.uncolorize(),
            ]),
            maxSize: "20m", // 20mb
        }),
        //
        // Write to all logs to log-%DATE%.log.
        // It will append logs for the same day in the same file.
        //
        new transports.DailyRotateFile({
            dirname: logDir,
            filename: "log-%DATE%.log",
            format: createCustomFormat([
                // Strip color characters from the message
                format.uncolorize(),
            ]),
            maxSize: "20m", // 20mb
        }),
    ],
});
