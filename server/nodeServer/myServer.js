import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import requestIp from 'request-ip';
import {diskUpload} from './Controllers/diskMulter.js'
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
import postSocket from './socketIO/postSocket.js';
import { EmailRateLimiter, usernameCheckLimiter, verifyEmailLiter } from './Controllers/rateLimits.js';
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
    const allowed = /jpg|jpeg|png/;
    const ext = file.mimetype.split("/")[1];
    if (allowed.test(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Only .jpg, .jpeg, .png are allowed"), false);
    }
};
// Multer middleware
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 3 * 1024 * 1024 } 
});

myApp.get("/getUsername",usernameCheckLimiter,getUsers);
myApp.post("/sendVerifyEmail",EmailRateLimiter,SendEmailVerify);
myApp.post("/verifyEmail",verifyEmailLiter,verifyEmail);
myApp.post("/CreateUser",upload.single("avatar"),CreateUser);
myApp.post("/login",LoginAPI);
myApp.get("/GetUserInfo",Auth,CrntUser);
myApp.get("/auth",checkAuth);
myApp.post("/Logout",Auth,loggedMeOut);
myApp.get("/checkActive",ActivityInfo);
myApp.put("/upDatePass",changePassSecure);
myApp.post("/sendForgotMail",forgotPass);
myApp.post("/CreatePost",diskUpload.array("postFiles",5),Auth,CreatePost);
myApp.get("/getPost",Auth,GetPosts);


const myServer = http.createServer(myApp);
const io = new Server(myServer, {
    path: "/socket.io"
});

io.on("connection", (socket) => {
    console.log("User came online", socket.id);

    postSocket(io,socket);

    socket.on("disconnect", () => {
        console.log("User leave", socket.id);
    });
});

export function getIO() {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
}

myServer.listen(port,()=>{
    console.log(chalk.greenBright.yellow.italic.bold("Server + Socket.IO running on " + port));
})