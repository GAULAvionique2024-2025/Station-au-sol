import EventEmitter from "node:events";
import winston from "winston";
import Transport from "winston-transport";
import "winston-daily-rotate-file";
import chalk from "chalk";

const logDir = "./logs"; // MOVE TO CONFIG FILE

/**
 * Singleton logger module to create custom logger instances.
 * @class MyLogger
 * @extends EventEmitter
 */
class MyLogger extends EventEmitter {
    /**
     * Private property to store all logger instances.
     * Logger's label as key and logger instance as value.
     * @type {Object}
     */
    #loggers = {};

    constructor() {
        super();
    }

    /**
     * Public method to retrieve or create a logger instance with an optional label.
     *
     * The logger instance will have the following transports:
     * - EventTransport: Send all logs to frontend via event emitter.
     * - Console: Write all logs to console.
     * - DailyRotateFile: Write all log error to log-error-%DATE%.log.
     * - DailyRotateFile: Write to all logs to log-%DATE%.log.
     *
     * @param {string} label - A label to identify the logger instance (will be displayed in the logs)
     * @returns {winston.Logger} A logger instance
     */
    getCustomLogger(label = "Global") {
        if (!this.#loggers[label]) {
            this.#loggers[label] = this.#createCustomLogger(label);
        }
        return this.#loggers[label];
    }

    /**
     * Private method to create a logger instance with the specified label.
     * @param {string} label - A label to identify the logger instance (will be displayed in the logs)
     * @returns {winston.Logger} A logger instance
     */
    #createCustomLogger(label) {
        /**
         * Creates a default format used by all transports which can be customized using the parameters.
         * @param {winston.Logform.Format[]} formatList list of logform formats to add to the default format.
         * @returns {winston.Logform.Format} A customised format to use on a transport.
         */
        function createCustomFormat(formatList) {
            return winston.format.combine(
                // Convert log level to uppercase (info -> INFO)
                // Set label from logger.log() parameters or use instance label
                winston.format((info) => ({
                    ...info,
                    level: info.level.toUpperCase(),
                    label: info.label || label,
                }))(),
                // Configure timestamp format
                winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                // Allows for logging error instances (logger.log(error))
                winston.format.errors({ stack: true }),
                // Custom format from the function parameters
                ...formatList,
                // Configure the message format
                winston.format.printf(({ timestamp, label, level, message }) => {
                    if (label) {
                        return `${timestamp} ${level} [${label}] ${message}`;
                    } else {
                        // If info.label is forced to be undefined, don't display it
                        return `${timestamp} ${level} ${message}`;
                    }
                })
            );
        }

        // Logger configuration
        const config = {
            transports: [
                //
                // Send all logs to clients via event emitter.
                //
                new EventTransport({
                    // Send events to this object instance of MyLogger
                    eventEmitter: this,
                    format: createCustomFormat([
                        // Strip color characters from the message
                        winston.format.uncolorize(),
                    ]),
                }),
                //
                // Write all logs to console.
                //
                new winston.transports.Console({
                    format: createCustomFormat([
                        // Add color to the log level and label in console
                        winston.format.colorize({ all: true }),
                        winston.format((info) => ({ ...info, label: chalk.grey(info.label) }))(),
                    ]),
                }),
                //
                // Write log error to log-error-%DATE%.log for easier debugging.
                // It will append logs for the same day in the same file.
                //
                new winston.transports.DailyRotateFile({
                    level: "error", // Only log level error
                    dirname: logDir,
                    filename: "log-error-%DATE%.log",
                    format: createCustomFormat([
                        // Strip color characters from the message
                        winston.format.uncolorize(),
                    ]),
                    maxSize: "20m", // 20mb
                }),
                //
                // Write to all logs to log-%DATE%.log.
                // It will append logs for the same day in the same file.
                //
                new winston.transports.DailyRotateFile({
                    dirname: logDir,
                    filename: "log-%DATE%.log",
                    format: createCustomFormat([
                        // Strip color characters from the message
                        winston.format.uncolorize(),
                    ]),
                    maxSize: "20m", // 20mb
                }),
            ],
        };

        return winston.createLogger(config);
    }
}

/**
 * Custom transport class to log events using an EventEmitter.
 * @class EventTransport
 * @extends Transport
 */
class EventTransport extends Transport {
    /**
     * Event emitter instance to emit logs to.
     * @type {EventEmitter}
     */
    eventEmitter = null;

    /**
     * Handle options and custom options for the transport.
     * @param {Object} opts - Options for the transport (see winston.Transport)
     * @throws {Error} - If event emitter option is not provided
     */
    constructor(opts) {
        super(opts);

        if (!opts.eventEmitter) {
            throw new Error("Event emitter is required");
        }

        this.eventEmitter = opts.eventEmitter;
    }

    /**
     * Log the information to the event emitter. This method is called when something is logged
     *
     * @param {Object} info - Log information { level, message, ... } (see winston)
     * @param {Function} callback - Callback function to execute after logging (see winston)
     * @returns {undefined}
     */
    log(info, callback) {
        setImmediate(() => {
            this.emit("logged", info);
        });

        this.eventEmitter.emit("log", info);

        callback();
    }
}

// Singleton instance of MyLogger
// Cannot use static methods because of the EventEmitter inheritance
const myLogger = new MyLogger();

export default myLogger;
