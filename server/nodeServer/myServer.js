import dotenv from 'dotenv';
import http from 'http';
import chalk from 'chalk';
dotenv.config();

import myApp from './Controllers/src/myApp.js';
import {Server} from 'socket.io';
import {connectRedis} from './Controllers/src/config/redis.js';
import initSockets from './socketIO/index.js';

await connectRedis();
const myServer = http.createServer(myApp);

const PORT = process.env.SERVER_PORT;

const io = new Server(myServer, {
    path: "/socket.io"
});

export function getIO() {
    if (!io) throw new Error("Socket.io not initialized!"); 
    return io;
}

initSockets(io);

myServer.listen(process.env.SERVER_PORT, ()=> {
    console.log(chalk.bgGreenBright.yellow.bold(`Server running on ${PORT}`));
})