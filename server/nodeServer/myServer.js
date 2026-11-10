
import "dotenv/config";
import http from "node:http";
import chalk from "chalk";
import { Server } from "socket.io";

import { connectRedis } from "./Controllers/src/config/redis.js";

// Keep this accessible to your other modules.
let io;

export function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }

    return io;
}

async function startServer() {
    try {
        // 1. Connect Redis first
        await connectRedis();

        console.log(chalk.green("Redis connected successfully"));

        // 2. Load application dependencies AFTER Redis is ready
        const [
            { default: myApp },
            { default: initSockets }
        ] = await Promise.all([
            import("./Controllers/src/myApp.js"),
            import("./socketIO/index.js")
        ]);

        // 3. Start workers after Redis connects
        await import("./Controllers/src/workers/workerStarter.js");

        // 4. Create HTTP server
        const myServer = http.createServer(myApp);

        // 5. Initialize Socket.IO
        io = new Server(myServer, {
            path: "/socket.io"
        });

        initSockets(io);

        // 6. Start listening
        const PORT = Number(process.env.SERVER_PORT);

        myServer.listen(PORT, "127.0.0.1", () => {
            console.log(
                chalk.bgGreenBright.yellow.bold(
                    `Server running on ${PORT}`
                )
            );
        });

    } catch (error) {
        console.error(
            chalk.red("Server startup failed:"),
            error
        );

        process.exit(1);
    }
}

startServer();
