import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import requestIp from 'request-ip';
import {diskUpload} from './Controllers/diskMulter.js'
import dotenv from 'dotenv';
import cors from 'cors'
dotenv.config();
import session from 'express-session';
let port = 3222;
import fs from 'fs';
//import path from 'path';
import multer from 'multer';
import { CreateUser } from './Routes/CreateUser/createUser.js';
import {getUsers} from './Routes/getUsers/getUsers.js';
import {SendEmailVerify, verifyEmail } from './Routes/CreateUser/verifyUser.js';
import {LoginAPI} from './Routes/Login/loginAPI.js'
import { Auth, checkAuth } from './Routes/Login/tokenChecker.js';
import { CrntUser } from './Routes/getUsers/getCurrentUserdata.js';
import { loggedMeOut } from './Routes/Login/userSession.js';
import { ActivityInfo } from './Routes/Login/getSessionInfo.js';
import { changePassSecure } from './Routes/Secure/SecureAccount.js';
import { forgotPass } from './Routes/Secure/forgotPassMail.js';
import { CreatePost } from './Routes/Promulgation/createPost.js';
import { GetPosts } from './Routes/usersPOSTAPIs/readThings/getPost.js';
import { commentSocket } from './socketIO/postSocket.js';
import { EmailRateLimiter, RateLimiter, usernameCheckLimiter, verifyEmailLiter } from './Controllers/rateLimits.js';
import { checkRequest, startCleaner } from './Controllers/progressTracker.js';
import { resetPassword, verification } from './Routes/Secure/userVerification/verificationAPI.js';
import { likeComment, savePost, starPost } from './Routes/usersPOSTAPIs/writeThings/likePost.js';
import { DeleteCommentAPI, miniToggleDy, reportCommentAPI } from './Routes/usersPOSTAPIs/writeThings/miniToggleAPIs.js';
import { getNews } from './utils/getNews.js';
import { getComment } from './Routes/usersPOSTAPIs/readThings/getCrntPostComment.js';
import { CommentAPI } from './Routes/usersPOSTAPIs/writeThings/addComment.js';
import { getUserinfo } from './Routes/getUsers/prifileAPIs.js';
import { changeBio, changeDP } from './Routes/editProfileAPIs/userInfoApis.js';
import { followAPI } from './Routes/editProfileAPIs/followUnfollow.js';
import { changeBioSocket } from './socketIO/userProfileSocket.js';
import { acceptSolution } from './Routes/Achievement/writeAchievemtns/acceptSolution.js';
import { getPost } from './Routes/usersPOSTAPIs/readThings/getSiglePost.js';
import router from './utils/tempFile.js';
import { Chartdata } from './Routes/usersPOSTAPIs/readThings/getChartData.js';
import { DeletePost, ReportPost } from './Routes/usersPOSTAPIs/writeThings/reportAndDelete.js';
import { startGithubLogin, startGoogleLogin } from './Controllers/auth.controller.js';
import {googleCallBackHandler} from './Routes/AdditionalAuth/google.services.js'
import { githubCallBackHandler } from './Routes/AdditionalAuth/github.services.js';
import { attachIP } from './lib/ipReader.js';

import { VerifyUserMail } from './Routes/AdditionalAuth/accountVerify.js';
import { VerifyMergeToken } from './Routes/AdditionalAuth/handleMerge.js';
// import { addNewAchievement } from './Routes/Achievement/createAchievement.js';
let myApp = express();
myApp.use(cors({
  origin: "http://localhost:3221",
  credentials: true
}));
myApp.use(express.json({limit:"20mb"}));
myApp.use(requestIp.mw())
myApp.set("trust proxy",1)
myApp.use(cookieParser());
myApp.use("/Images",express.static('Images'));

myApp.use(session({
  secret:process.env.jwt_sec,
  resave:false,
  saveUninitialized:true
}))


myApp.use((req, res, next) => {
  const controller = new AbortController();
  req.abortController = controller;

  const TIMEOUT = 60_000; // 60 seconds (better than 5 min)

  const timer = setTimeout(() => {
    controller.abort();

    if (!res.headersSent) {
      res.status(408).json({ error: "Request Timeout" });
    }
  }, TIMEOUT);

  // Clear timer when response finishes normally
  res.on("finish", () => {
    clearTimeout(timer);
  });

  // Clear timer if client aborts early
  req.on("aborted", () => {
    controller.abort();
    clearTimeout(timer);
  });

  next();
});





// Multer storage config
const storage = multer.memoryStorage();
// File filter (only jpg, jpeg, png)
const fileFilter = (req, file, cb) => {
    const allowed = /avif|webp|gif/;
    const ext = file.mimetype.split("/")[1];
    if (allowed.test(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Only avif, .webp, .gif are allowed"), false);
    }
};
// Multer middleware
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 3 * 1024 * 1024 } 
});

myApp.get("/getUsername",usernameCheckLimiter,attachIP,checkRequest,getUsers);
myApp.post("/sendVerifyEmail",EmailRateLimiter,attachIP,checkRequest,SendEmailVerify);
myApp.post("/verifyEmail",verifyEmailLiter,attachIP,checkRequest,verifyEmail);
myApp.post("/CreateUser",RateLimiter,attachIP,checkRequest,upload.single("avatar"),CreateUser);
myApp.post("/login",RateLimiter,attachIP,checkRequest,LoginAPI);
myApp.get("/auth/google",RateLimiter,attachIP,checkRequest,startGoogleLogin);
myApp.get("/auth/google/callback",RateLimiter, attachIP, checkRequest,googleCallBackHandler);
myApp.get("/auth/github",RateLimiter,attachIP,checkRequest,startGithubLogin);
myApp.get("/auth/github/callback",RateLimiter, attachIP, checkRequest,githubCallBackHandler);
myApp.get("/sendMergeMail",RateLimiter,attachIP,checkRequest,VerifyUserMail);
myApp.get("/verify/mergeToken",RateLimiter,attachIP,checkRequest,VerifyMergeToken) 
myApp.get("/GetUserInfo",RateLimiter,attachIP,checkRequest,Auth,CrntUser);
myApp.get("/auth",RateLimiter,attachIP,checkRequest,checkAuth);
myApp.get("/Logout",RateLimiter,attachIP,checkRequest,Auth,loggedMeOut);
myApp.get("/checkActive",RateLimiter,attachIP,checkRequest,ActivityInfo);
myApp.put("/upDatePass",RateLimiter,attachIP,checkRequest,changePassSecure);
myApp.post("/ForgotPassword",RateLimiter,attachIP,checkRequest,forgotPass);
myApp.post("/ForgotPassword/verify",RateLimiter,attachIP,checkRequest,verification);
myApp.put("/ForgotPassword/reset",RateLimiter,attachIP,checkRequest,resetPassword);
myApp.post("/CreatePost",RateLimiter,attachIP,checkRequest,diskUpload.array("postFiles",5),Auth,CreatePost);
myApp.put("/PostControll/toggle",RateLimiter,attachIP,checkRequest,Auth,miniToggleDy)
myApp.get("/getPost",RateLimiter,attachIP,checkRequest,Auth,GetPosts);
myApp.get("/getNews",RateLimiter,attachIP,checkRequest,Auth,getNews);
myApp.post("/writePost/addStar",RateLimiter,attachIP,checkRequest,Auth,starPost);
myApp.post("/writePost/addComment",RateLimiter,attachIP,checkRequest,Auth,CommentAPI)
myApp.get("/readPost/getComment",RateLimiter,attachIP,checkRequest,Auth,getComment);
myApp.post("/writePost/addLikeComment",RateLimiter,attachIP,checkRequest,Auth,likeComment);
myApp.get("/readUser/getUserInfo",RateLimiter,attachIP,checkRequest,Auth,getUserinfo);
myApp.put("/writeUser/changeBio",RateLimiter,attachIP,checkRequest,Auth,changeBio);
myApp.post("/writeUser/follow",RateLimiter,attachIP,checkRequest,Auth,followAPI);
myApp.put("/writeUser/changeDP",RateLimiter,attachIP,checkRequest,upload.single("avatar"),Auth,changeDP);
myApp.post("/writePost/reportComment",RateLimiter,attachIP,checkRequest,Auth,reportCommentAPI);
myApp.delete("/writePost/deleteComment",RateLimiter,attachIP,checkRequest,Auth,DeleteCommentAPI);
myApp.post("/writeAchievement/acceptComment",RateLimiter,attachIP,checkRequest,Auth,acceptSolution)
myApp.get("/readPost/getImage",RateLimiter,attachIP,checkRequest,Auth,getPost);
myApp.get("/readPost/getChartData",RateLimiter,attachIP,checkRequest,Auth,Chartdata);
myApp.post("/writePost/savePost",RateLimiter,attachIP,checkRequest,Auth,savePost);
myApp.post("/writePost/reportPost",RateLimiter,attachIP,checkRequest,Auth,ReportPost);
myApp.delete("/writePost/deletePost",RateLimiter,attachIP,checkRequest,Auth,DeletePost);
// myApp.post("/createAchievement",addNewAchievement);



const myServer = http.createServer(myApp);
const io = new Server(myServer, {
    path: "/socket.io"
});

io.on("connection", (socket) => {
  let {user_id} = socket.handshake.auth
  console.log("User came online", user_id);
  socket.join(`user_${user_id}`)
  commentSocket(io,socket);
  changeBioSocket(io, socket);

  socket.on("disconnect", () => {
    console.log("User leave", socket.id);
  });
});

export function getIO() {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
}


myServer.listen(port,()=>{
    startCleaner();
    console.log(chalk.yellow.italic.bold("Server + Socket.IO running on " + port));
})

/* 
    * We are not now that strength which in old days
    * Moved earth and heaven;
    * that which we are, we are;
    * One equal temper of heroic hearts,
    * Made weak by time and fate, but strong in will;
    * To strive, to seek, to find, and not to yield
*/