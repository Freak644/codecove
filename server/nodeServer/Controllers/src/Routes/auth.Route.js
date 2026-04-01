import {Router} from 'express';
import {commonStack} from '../middleware/common.js';
import { startGithubLogin, startGoogleLogin } from '../../auth.controller.js';
import { googleCallBackHandler } from '../../../API/AdditionalAuth/google.services.js';
import { githubCallBackHandler } from '../../../API/AdditionalAuth/github.services.js';
import { VerifyMergeToken } from '../../../API/AdditionalAuth/merge/handleMerge.js';
import { upload } from '../middleware/upload.js';
import {LoginAPI} from '../../../API/Login/loginAPI.js'
import {checkAuth} from '../../../API/Login/tokenChecker.js';

//Oauth API the full api path will be look like /auth/:service
const authRoute = Router();

authRoute.get("/google",...commonStack, startGoogleLogin);
authRoute.get("/google/callback", ...commonStack, googleCallBackHandler);
authRoute.get("/github", ...commonStack, startGithubLogin);
authRoute.get("/github/callback", ...commonStack, githubCallBackHandler);
authRoute.get("/verify/mergeToken",...commonStack,VerifyMergeToken);
authRoute.post("/login", ...commonStack, LoginAPI);
authRoute.get("/checkAuth", ...commonStack, checkAuth)
export {authRoute};