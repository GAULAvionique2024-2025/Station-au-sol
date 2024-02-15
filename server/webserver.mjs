import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import chalk from 'chalk';
import logger from './logger.mjs';

export default class MyWebServer {
    constructor({
        'port': port = 80,
    } = {}) {
        // Express application
        this.app = express();
        // HTTP server of the Express application
        this.server = createServer(this.app);

        // To get the path of the folder containing this file
        const __dirname = dirname(fileURLToPath(import.meta.url));

        // Serve the static files of the client folder
        this.app.use(express.static(join(__dirname, '..', 'client')));

        // To make the HTTP server of the application listen to client connections
        // (80 = default port for HTTP)
        this.server.listen(port, () => {
            logger(chalk.blue("Web Server"), "listening on port", chalk.yellow(port), `(http://localhost:${port})`);
        });
    }

    // For socket.io to use the HTTP server of the Express application
    getHTTPServer() {
        return this.server;
    }
}