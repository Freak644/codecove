import { Router } from "express";
import {
    EmailRateLimiter,
    passwordRecoveryIpLimiter,
    verifyEmailLiter,
} from "../../rateLimits.js";
import { commonStack } from "../middleware/common.js";
import { SendEmailVerify, verifyEmail } from "../../../API/CreateUser/verifyUser.js";
import { VerifyUserMail } from "../../../API/AdditionalAuth/merge/accountVerify.js";
import { forgotPass } from "../../../API/Secure/forgotPassMail.js";

const emailRoute = Router();

emailRoute.post(
    "/sendVerifyEmail",
    ...commonStack,
    EmailRateLimiter,
    SendEmailVerify
);

emailRoute.post(
    "/verifyEmail",
    ...commonStack,
    verifyEmailLiter,
    verifyEmail
);

emailRoute.get(
    "/sendMergeMail",
    ...commonStack,
    EmailRateLimiter,
    VerifyUserMail
);

emailRoute.post(
    "/ForgotPassword",
    ...commonStack,
    passwordRecoveryIpLimiter,
    forgotPass
);

export default emailRoute;
