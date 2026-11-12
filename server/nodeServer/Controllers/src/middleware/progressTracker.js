import { randomUUID } from "node:crypto";

/**
 * Request lifecycle tracking only.
 * Rate limiting belongs in the Redis-backed express-rate-limit middleware.
 * This middleware deliberately does not block by IP, add duplicate-request
 * locks, or impose a second overlapping rate limit.
 */
export const checkRequest = (req, res, next) => {
    const requestId = randomUUID();
    const startedAt = process.hrtime.bigint();
    let logged = false;

    req.requestId = requestId;
    res.setHeader("X-Request-ID", requestId);

    const logCompletion = (outcome) => {
        if (logged) return;
        logged = true;

        const durationMs =
            Number(process.hrtime.bigint() - startedAt) / 1_000_000;

        // Prefer the Express route template so path parameters and query
        // strings (which may contain sensitive values) are not logged.
        const route = req.route?.path
            ? `${req.baseUrl || ""}${req.route.path}`
            : "unmatched";

        const entry = {
            timestamp: new Date().toISOString(),
            level: "info",
            event: "http_request_completed",
            requestId,
            method: req.method,
            route,
            statusCode: res.statusCode,
            durationMs: Number(durationMs.toFixed(2)),
            outcome,
        };

        console.info(JSON.stringify(entry));
    };

    res.once("finish", () => logCompletion("finished"));
    res.once("close", () => {
        if (!res.writableFinished) {
            logCompletion("connection_closed_early");
        }
    });

    return next();
};

/**
 * Backward-compatible export for controllers that still import this helper.
 * Request completion is now tracked automatically from the response events
 * registered by checkRequest; no Redis counter cleanup is required.
 * Remove old imports after confirming there are no remaining references.
 */
export const completeRequest = async () => {};
