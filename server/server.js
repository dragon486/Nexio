import 'dotenv/config';
import app from './src/app.js';
import { createServer } from "http";
import { initSocket } from "./src/utils/socket.js";
import { initEmailSyncService } from "./src/services/emailSyncService.js";
import fs from 'fs';
import path from 'path';

// Log to file for debugging
const logFile = fs.createWriteStream(path.join(process.cwd(), 'debug.log'), { flags: 'a' });
const logStdout = process.stdout;

console.log = (...args) => {
    logFile.write(new Date().toISOString() + ' [INFO] ' + args.join(' ') + '\n');
    logStdout.write(args.join(' ') + '\n');
};
console.error = (...args) => {
    logFile.write(new Date().toISOString() + ' [ERROR] ' + args.join(' ') + '\n');
    logStdout.write(args.join(' ') + '\n');
};

const PORT = process.env.PORT || 8000;
const server = createServer(app);

// Initialize Socket.io and Background Services
initSocket(server);
initEmailSyncService();

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
