import {RateLimiter} from '../../rateLimits.js';
import {checkRequest} from './progressTracker.js'
import {attachIP} from '../../../lib/ipReader.js';

export const commonStack = [
    RateLimiter,
    attachIP,
    checkRequest
]