import { checkRequest } from "./progressTracker.js";
import { attachIP } from "../../../lib/ipReader.js";

// Shared observability/IP context only. Rate limits are attached explicitly
// per route so public IP limits and authenticated user limits stay separate.
export const commonStack = [
    attachIP,
    checkRequest,
];
