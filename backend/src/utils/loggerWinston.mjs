import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";

var logDir = "./logs/logger";

const { createLogger, format, transports } = import("winston");

const myFormat = winston.format.printf(({ level, message, label, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

winston.logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: "SasServer" },
    transports: [
        //
        // - Write to all logs with level `info` and below to `log.log`.
        // - Write all logs error (and below) to `log-error.log`.
        //
        new winston.transports.DailyRotateFile({
            filename: path.join(logDir, "/log-error-%DATE%.log"),
            json: false,
            colorize: true,
            maxSize: "20m",
            level: "error",
            format: winston.format.combine(
                winston.format((info) => {
                    info.level = info.level.toUpperCase();
                    return info;
                })(),
                winston.format.timestamp(),
                myFormat
            ),
        }),
        new winston.transports.DailyRotateFile({
            filename: path.join(logDir, "/log-%DATE%.log"),
            json: false,
            colorize: true,
            maxSize: "20m",
            format: winston.format.combine(
                winston.format((info) => {
                    info.level = info.level.toUpperCase();
                    return info;
                })(),
                winston.format.timestamp(),
                myFormat
            ),
        }),
        new winston.transports.Console({
            json: false,
            format: winston.format.combine(
                winston.format((info) => {
                    info.level = info.level.toUpperCase();
                    return info;
                })(),
                winston.format.colorize(),
                winston.format.timestamp(),
                myFormat
            ),
        }),
    ],
});

export default winston.logger;
