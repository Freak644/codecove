import { Router } from 'express';
import {commonStack} from '../middleware/common.js'
import { usernameCheckLimiter } from '../../rateLimits.js';
import {getUsers} from '../../../API/getUsers/getUsers.js'
import {LoginAPI} from '../../../API/Login/loginAPI.js';
import {loggedMeOut} from '../../../API/Login/userSession.js';
import {ActivityInfo} from '../../../API/Login/getSessionInfo.js'
import {changePassSecure} from '../../../API/Secure/SecureAccount.js';
import {verification,resetPassword} from '../../../API/Secure/userVerification/verificationAPI.js';
import {CrntUser} from '../../../API/getUsers/getCurrentUserdata.js';
import {Auth} from '../../../API/Login/tokenChecker.js';
import {getUserinfo} from '../../../API/getUsers/prifileAPIs.js';
import {followAPI} from '../../../API/editProfileAPIs/followUnfollow.js';
import {changeBio, changeDP} from '../../../API/editProfileAPIs/userInfoApis.js';



//absolute User Routes there path will look like /user/apiPath
const userRoutes = Router();

userRoutes.get("/getUsername",usernameCheckLimiter,commonStack[1],commonStack[2],getUsers);
userRoutes.post("/login",...commonStack,LoginAPI);
userRoutes.get("/Logout",...commonStack,Auth,loggedMeOut);
userRoutes.get("/checkActivety",...commonStack,ActivityInfo);
userRoutes.patch("/upDatePass",...commonStack,changePassSecure);
userRoutes.post("/ForgotPassword/verify",...commonStack,verification);
userRoutes.patch("/ForgotPassword/reset",...commonStack,resetPassword);
userRoutes.get("/GetUserInfo",...commonStack,Auth,CrntUser);

//profileUserRoutes there path will look like /readUser/apiPath

const readRoutes = Router();

readRoutes.get("/getUserInfo",...commonStack,Auth,getUserinfo);

//profileUserRoute for writeProfile Info full will be look like /writeUser/apiPath

const writeRoutes = Router();

writeRoutes.post("/follow",...commonStack,Auth,followAPI);
writeRoutes.patch("/changeBio",...commonStack,Auth,changeBio);
writeRoutes.patch("/changeDP",...commonStack,Auth,changeDP);


export {userRoutes, readRoutes,writeRoutes};