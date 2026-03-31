import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import requestIp from 'request-ip';

import sessionConfig from './config/session.js';
import {timeOut} from './middleware/timeOut.js';


const myApp = express();

myApp.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}));

myApp.use(express.json({limit:"20mb"}));
myApp.use(cookieParser());
myApp.use(requestIp.mw());
myApp.use("trust proxy",1);
myApp.use(sessionConfig);
myApp.use(timeOut);


export default myApp;