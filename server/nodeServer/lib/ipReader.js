import { isIP } from "node:net";

const normalizeIP = (value) => {
    if (typeof value !== "string") return null;

    let ip = value.trim();
    if (ip.startsWith("::ffff:")) {
        ip = ip.slice(7);
    }
    if (ip === "::1") {
        ip = "127.0.0.1";
    }

    return isIP(ip) ? ip : null;
};

/**
 * Uses Express's req.ip, which is derived from the trusted proxy chain.
 * Nginx must overwrite X-Forwarded-For with the Cloudflare client IP
 * (or its direct remote address for local development) before forwarding
 * to Vite. Express trust proxy is configured to one hop in myApp.js.
 */
export const attachIP = (req, res, next) => {
  const clientIP =
  normalizeIP(req.ip) ||
  normalizeIP(req.socket?.remoteAddress) ||
  "0.0.0.0";
  
  req.userIp = clientIP;
  console.log({
    expressIP: req.ip,
    userIP: req.userIp,
    socketIP: req.socket.remoteAddress,
    forwardedFor: req.headers["x-forwarded-for"]
});
    next();
};
