import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import requestIp from 'request-ip';

import sessionConfig from './config/session.js';
import {timeOut} from './middleware/timeOut.js';
import { readRoutes, userRoutes, writeRoutes } from './Routes/user.route.js';
import { authRoute } from './Routes/auth.Route.js';
import { readPost, writePost } from './Routes/post.Route.js';
import emailRoute from './Routes/email.Route.js';


const myApp = express();

myApp.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}));

myApp.use(express.json({limit:"20mb"}));
myApp.use("/Images",express.static("Images"))
myApp.use(cookieParser());
myApp.use(requestIp.mw());
myApp.set("trust proxy",1);
myApp.use(sessionConfig);
myApp.use(timeOut);

//Routes 
myApp.use("/email", emailRoute)
myApp.use("/user",userRoutes);
myApp.use("/auth", authRoute);
myApp.use("/readUser", readRoutes);
myApp.use("/writeUser", writeRoutes);
myApp.use("/readPost", readPost);
myApp.use("/writePost", writePost);


export default myApp;