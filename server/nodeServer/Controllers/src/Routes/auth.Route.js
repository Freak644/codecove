import { Router } from "express";
import { commonStack } from "../middleware/common.js";
import {
    checkAuthIpLimiter,
    loginIpLimiter,
    mergeTokenIpLimiter,
    oauthCallbackIpLimiter,
    oauthStartIpLimiter,
    verifyPasswordIpLimiter,
} from "../../rateLimits.js";
import { startGithubLogin, startGoogleLogin } from "../../auth.controller.js";
import { googleCallBackHandler } from "../../../API/AdditionalAuth/google.services.js";
import { githubCallBackHandler } from "../../../API/AdditionalAuth/github.services.js";
import { VerifyMergeToken, verifyPassword } from "../../../API/AdditionalAuth/merge/handleMerge.js";
import { LoginAPI } from "../../../API/Login/loginAPI.js";
import { checkAuth } from "../../../API/Login/tokenChecker.js";

const authRoute = Router();

authRoute.get("/google", ...commonStack, oauthStartIpLimiter, startGoogleLogin);
authRoute.get("/google/callback", ...commonStack, oauthCallbackIpLimiter, googleCallBackHandler);
authRoute.get("/github", ...commonStack, oauthStartIpLimiter, startGithubLogin);
authRoute.get("/github/callback", ...commonStack, oauthCallbackIpLimiter, githubCallBackHandler);
authRoute.get("/verify/mergeToken", ...commonStack, mergeTokenIpLimiter, VerifyMergeToken);
authRoute.post("/login", ...commonStack, loginIpLimiter, LoginAPI);
authRoute.get("/checkAuth", ...commonStack, checkAuthIpLimiter, checkAuth);
authRoute.post("/verifyPassword", ...commonStack, verifyPasswordIpLimiter, verifyPassword);

export { authRoute };
