import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import requestIp from "request-ip";

import sessionConfig from "./config/session.js";
import { timeOut } from "./middleware/timeOut.js";
import { readRoutes, userRoutes, writeRoutes } from "./Routes/user.route.js";
import { authRoute } from "./Routes/auth.Route.js";
import { readPost, writePost } from "./Routes/post.Route.js";
import emailRoute from "./Routes/email.Route.js";
import { imgRoutes } from "./Routes/image.route.js";

const myApp = express();

// This value is safe only for the current topology:
// Cloudflare Tunnel -> Nginx -> Vite proxy -> Express.
// Nginx overwrites X-Forwarded-For with exactly one trusted client IP,
// and Vite is the single HTTP proxy directly in front of Express.
myApp.set("trust proxy", 1);

// Set FRONTEND_URLS to a comma-separated list of exact browser origins.
// FRONTEND_URL remains supported as a backward-compatible fallback.
const configuredOrigins =
    process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "";

const allowedOrigins = new Set(
    configuredOrigins
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
);

if (allowedOrigins.size === 0) {
    console.warn(
        "[CORS] No FRONTEND_URLS or FRONTEND_URL configured; browser cross-origin requests will not receive CORS permission."
    );
}

myApp.use(
    cors({
        origin(origin, callback) {
            // Requests without an Origin header (for example, server-to-server
            // calls) do not need CORS response headers.
            if (!origin) return callback(null, false);
            return callback(null, allowedOrigins.has(origin));
        },
        credentials: true,
    })
);

myApp.use(express.json({ limit: "20mb" }));
myApp.use(cookieParser());
myApp.use(requestIp.mw());
myApp.use(sessionConfig);
myApp.use(timeOut);

// Routes
myApp.use(imgRoutes);
myApp.use("/email", emailRoute);
myApp.use("/user", userRoutes);
myApp.use("/auth", authRoute);
myApp.use("/readUser", readRoutes);
myApp.use("/writeUser", writeRoutes);
myApp.use("/readPost", readPost);
myApp.use("/writePost", writePost);

export default myApp;
