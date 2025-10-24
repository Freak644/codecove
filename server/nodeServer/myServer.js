import express from 'express';
import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import requestIp from 'request-ip';
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
let myApp = express();
myApp.use(express.json({limit:"1gb"}));
myApp.use(requestIp.mw())
myApp.set("trust proxy",true)
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
    limits: { fileSize: 5 * 1024 * 1024 } 
});

myApp.get("/getUsername",getUsers);
myApp.post("/sendVerifyEmail",SendEmailVerify);
myApp.post("/verifyEmail",verifyEmail);
myApp.post("/CreateUser",upload.single("avatar"),CreateUser);
myApp.post("/login",LoginAPI);
myApp.get("/GetUserInfo",Auth,CrntUser);
myApp.get("/auth",checkAuth);
myApp.post("/Logout",Auth,loggedMeOut);
myApp.get("/Checkactive",ActivityInfo)
myApp.listen(port,()=>{
    console.log(chalk.greenBright.yellow.italic.bold("server is start on "+port))
});