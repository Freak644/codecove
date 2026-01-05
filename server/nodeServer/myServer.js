import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import requestIp from 'request-ip';
import {diskUpload} from './Controllers/diskMulter.js'
// app.use(cors({
//   origin: "your-frontend-domain",
//   credentials: true
// }));

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
import { GetPosts } from './Routes/usersPOSTAPIs/getPost.js';
import postSocket, { commentLikeSocket, likeSocket } from './socketIO/postSocket.js';
import { EmailRateLimiter, RateLimiter, usernameCheckLimiter, verifyEmailLiter } from './Controllers/rateLimits.js';
import { checkRequest, startCleaner } from './Controllers/progressTracker.js';
import { resetPassword, verification } from './Routes/Secure/userVerification/verificationAPI.js';
import { likeComment, starPost } from './Routes/usersPOSTAPIs/writeThings/likePost.js';
import { miniToggleDy } from './Routes/usersPOSTAPIs/writeThings/miniToggleAPIs.js';
import { getNews } from './utils/getNews.js';
import { getComment } from './Routes/usersPOSTAPIs/readThings/getCrntPostComment.js';
import { CommentAPI } from './Routes/usersPOSTAPIs/writeThings/addComment.js';
import { getUserinfo } from './Routes/getUsers/prifileAPIs.js';
import { changeBio } from './Routes/editProfileAPIs/userInfoApis.js';
import { followAPI } from './Routes/editProfileAPIs/followUnfollow.js';
let myApp = express();
myApp.use(express.json({limit:"1gb"}));
myApp.use(requestIp.mw())
myApp.set("trust proxy",1)
myApp.use(cookieParser());
myApp.use("/Images",express.static('Images'));


// Multer storage config
const storage = multer.memoryStorage();
// File filter (only jpg, jpeg, png)
const fileFilter = (req, file, cb) => {
    const allowed = /avif|webp/;
    const ext = file.mimetype.split("/")[1];
    if (allowed.test(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Only avif, .webp are allowed"), false);
    }
};
// Multer middleware
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 3 * 1024 * 1024 } 
});

myApp.get("/getUsername",usernameCheckLimiter,checkRequest,getUsers);
myApp.post("/sendVerifyEmail",EmailRateLimiter,checkRequest,SendEmailVerify);
myApp.post("/verifyEmail",verifyEmailLiter,checkRequest,verifyEmail);
myApp.post("/CreateUser",RateLimiter,checkRequest,upload.single("avatar"),CreateUser);
myApp.post("/login",RateLimiter,checkRequest,LoginAPI);
myApp.get("/GetUserInfo",RateLimiter,checkRequest,Auth,CrntUser);
myApp.get("/auth",RateLimiter,checkRequest,checkAuth);
myApp.post("/Logout",RateLimiter,checkRequest,Auth,loggedMeOut);
myApp.get("/checkActive",RateLimiter,checkRequest,ActivityInfo);
myApp.put("/upDatePass",RateLimiter,checkRequest,changePassSecure);
myApp.post("/ForgotPassword",RateLimiter,checkRequest,forgotPass);
myApp.post("/ForgotPassword/verify",RateLimiter,checkRequest,verification);
myApp.put("/ForgotPassword/reset",RateLimiter,checkRequest,resetPassword);
myApp.post("/CreatePost",RateLimiter,checkRequest,diskUpload.array("postFiles",5),Auth,CreatePost);
myApp.put("/PostControll/toggle",RateLimiter,checkRequest,Auth,miniToggleDy)
myApp.get("/getPost",RateLimiter,checkRequest,Auth,GetPosts);
myApp.get("/getNews",RateLimiter,checkRequest,Auth,getNews);
myApp.post("/writePost/addStar",RateLimiter,checkRequest,Auth,starPost);
myApp.post("/writePost/addComment",RateLimiter,checkRequest,Auth,CommentAPI)
myApp.get("/readPost/getComment",RateLimiter,checkRequest,Auth,getComment);
myApp.post("/writePost/addLikeComment",RateLimiter,checkRequest,Auth,likeComment);
myApp.get("/readUser/getUserInfo",RateLimiter,checkRequest,Auth,getUserinfo);
myApp.put("/writeUser/changeBio",RateLimiter,checkRequest,Auth,changeBio);
myApp.post("/writeUser/follow",RateLimiter,checkRequest,Auth,followAPI)



const myServer = http.createServer(myApp);
const io = new Server(myServer, {
    path: "/socket.io"
});

io.on("connection", (socket) => {
    console.log("User came online", socket.id);

    postSocket(io,socket);
    likeSocket(io,socket);
    commentLikeSocket(io,socket);

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
    console.log(chalk.greenBright.yellow.italic.bold("Server + Socket.IO running on " + port));
})

/* 
    We are not now that strength which in old days
    Moved earth and heaven;
    that which we are, we are;
    One equal temper of heroic hearts,
    Made weak by time and fate, but strong in will;
    To strive, to seek, to find, and not to yield
*/