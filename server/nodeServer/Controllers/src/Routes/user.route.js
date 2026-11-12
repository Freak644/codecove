import { Router } from "express";
import { commonStack } from "../middleware/common.js";
import {
    passwordChangeIpLimiter,
    passwordRecoveryIpLimiter,
    publicReadIpLimiter,
    registrationIpLimiter,
    userReadLimiter,
    userUploadLimiter,
    userWriteLimiter,
    usernameCheckLimiter,
} from "../../rateLimits.js";
import { getUsers } from "../../../API/getUsers/getUsers.js";
import { loggedMeOut } from "../../../API/Login/userSession.js";
import { ActivityInfo } from "../../../API/Login/getSessionInfo.js";
import { changePassSecure } from "../../../API/Secure/SecureAccount.js";
import { verification, resetPassword } from "../../../API/Secure/userVerification/verificationAPI.js";
import { Auth } from "../../../API/Login/tokenChecker.js";
import { getUserinfo } from "../../../API/getUsers/prifileAPIs.js";
import { followAPI } from "../../../API/editProfileAPIs/followUnfollow.js";
import { changeBio, changeDP } from "../../../API/editProfileAPIs/userInfoApis.js";
import { upload } from "../middleware/upload.js";
import { CreateUser } from "../../../API/CreateUser/createUser.js";
import { MergeRequestData } from "../../../API/getUsers/mergeRequestData.js";
import { findUsers } from "../../../API/getUsers/userInfo/getUserforSerarch.js";
import { FindFriends } from "../../../API/getUsers/userInfo/findFriends.js";

const userRoutes = Router();

// Public endpoints: IP-based limits.
userRoutes.get("/getUsername", ...commonStack, usernameCheckLimiter, getUsers);
userRoutes.post("/CreateUser", ...commonStack, registrationIpLimiter, upload.single("avatar"), CreateUser);
userRoutes.get("/checkActivety", ...commonStack, publicReadIpLimiter, ActivityInfo);
userRoutes.post("/ForgotPassword/verify", ...commonStack, passwordRecoveryIpLimiter, verification);
userRoutes.patch("/ForgotPassword/reset", ...commonStack, passwordRecoveryIpLimiter, resetPassword);
userRoutes.get("/userFound", ...commonStack, publicReadIpLimiter, MergeRequestData);

// Authenticated endpoints: Auth must run before the user-based limiter.
userRoutes.get("/Logout", ...commonStack, Auth, userWriteLimiter, loggedMeOut);
userRoutes.patch("/upDatePass", ...commonStack, passwordChangeIpLimiter, changePassSecure);
userRoutes.get("/searchUsers", ...commonStack, Auth, userReadLimiter, findUsers);

const readRoutes = Router();
readRoutes.get("/getUserInfo", ...commonStack, Auth, userReadLimiter, getUserinfo);
readRoutes.get("/findFriends", ...commonStack, Auth, userReadLimiter, FindFriends);

const writeRoutes = Router();
writeRoutes.post("/follow", ...commonStack, Auth, userWriteLimiter, followAPI);
writeRoutes.patch("/changeBio", ...commonStack, Auth, userWriteLimiter, changeBio);
writeRoutes.put(
    "/changeDP",
    ...commonStack,
    Auth,
    userUploadLimiter,
    upload.single("file"),
    changeDP
);

export { userRoutes, readRoutes, writeRoutes };
