import {Router} from 'express';
import { EmailRateLimiter, verifyEmailLiter } from '../../rateLimits.js';
import {commonStack} from '../middleware/common.js';
import { SendEmailVerify, verifyEmail } from '../../../API/CreateUser/verifyUser.js';
import {VerifyUserMail} from '../../../API/AdditionalAuth/merge/accountVerify.js';
import { forgotPass } from '../../../API/Secure/forgotPassMail.js';

const emailRoute = Router();

emailRoute.post("/sendVerifyEmail",EmailRateLimiter,commonStack[1],commonStack[2],SendEmailVerify);
emailRoute.post("/verifyEmail",verifyEmailLiter,commonStack[1],commonStack[2],verifyEmail);
emailRoute.get("/sendMergeMail",...commonStack,VerifyUserMail);
emailRoute.post("/ForgotPassword",...commonStack,forgotPass);

export default emailRoute;