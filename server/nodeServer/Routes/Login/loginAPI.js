import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { database } from '../../Controllers/myConnectionFile.js';
import dotenv from 'dotenv';
import { SaveThisSession } from './userSession.js';
import { sendTheMail } from '../../Controllers/nodemailer.js';
import { completeRequest } from '../../Controllers/progressTracker.js';
import { nanoid } from 'nanoid';
dotenv.config();
export const LoginAPI = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/,"") || "0.0.0.0";
    const IP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const route = rkv.originalUrl.split("?")[0];
    let {Email,Password,clientInfo} = rkv.body;
    try {
        if (!Email?.trim() || !Password?.trim() || Object.keys(clientInfo).length !== 2) {
        return rspo.status(400).send({ err: "Please Provide proper information"})
        }
        let [isUser] = await database.execute(
            "SELECT username,password,id,email,acStatus,avatar FROM users WHERE username=? OR email=?",
            [Email,Email]
        )
        if (!isUser.length>0) {
            if (Email.endsWith("@gmail.com")) {
                return rspo.status(401).send({ err: "Please check your Email"})
            } else {
                return rspo.status(401).send({ err: "Please check your username"})
            }
        }
        let {password,username,email,id,acStatus,avatar} = isUser[0];
        if (acStatus !== 1) return rspo.status(401).send({err:"Your account Block"});
        let isPassMatch = await bcrypt.compare(Password,password);
        if (!isPassMatch) {
            return rspo.status(401).send({ err: "Check your Password"})
        }
        let token_id = nanoid(32);
        let [rows] = await database.query("SELECT ip FROM user_sessions WHERE id = ? ORDER BY created_at DESC LIMIT 1",[id])
        const loginTime = new Date();
        const formattedTime = loginTime.toLocaleString('en-US', {
        timeZone: clientInfo.timeZone,   
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
        });
        let {session_id,platform,city,country,region,device_type,ip} = await SaveThisSession(rkv,id)

        await database.query("INSERT INTO validationToken (token_id, id, session_id, username, email) VALUES (?,?,?,?,?);"
            ,[token_id,id,session_id,username,email]
        )

        let activity_url = `http://localhost:3221/checkInfo/${token_id}`
        let sendMail
        if (rows[0]?.ip !== crntIP) {
                sendMail = await sendTheMail(
                email,
                "New Login Detected 🧐",
                "Login",
                {platform,city,ip,country,region,device_type,username,login_time:formattedTime,activity_url,img_url:`http://localhost:3222${avatar}`}
            )
        }
        if (sendMail?.rejected?.length === 0 || rows[0].ip === crntIP) {
            let authToken = jwt.sign({id,session_id},process.env.jwt_sec,{expiresIn:"1d"});
            rspo.cookie("myAuthToken",authToken,{
                httpOnly:true,
                secure:true,
                sameSite:"strict",
                maxAge: 24 * 60 * 60 *1000 //  1day
            })
            rspo.status(200).send({ pass: "Login",authToken:isUser[0].username,session_id})
        }else{
            rspo.status(504).send({err:"Something went wrong while Login"})
        }
    } catch (error) {
        console.log(error.message)
        rspo.status(500).send({ err: "Sever Side Error",details:error.message});
    } finally{
        completeRequest(IP,route)
    }
}

