import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { database } from '../../Controllers/myConnectionFile.js';
import dotenv from 'dotenv';
import { SaveThisSession } from './userSession.js';
import { sendTheMail } from '../../Controllers/nodemailer.js';
dotenv.config();
export const LoginAPI = async (rkv,rspo) => {
    let {Email,Password,clientInfo} = rkv.body;
    try {
        if (!Email?.trim() || !Password?.trim()) {
        return rspo.status(400).send({ err: "Please Provide proper information"})
        }
        let [isUser] = await database.execute(
            "SELECT username,password,id,email FROM users WHERE username=? OR email=?",
            [Email,Email]
        )
        if (!isUser.length>0) {
            if (Email.endsWith("@gmail.com")) {
                return rspo.status(401).send({ err: "Please check your Email"})
            } else {
                return rspo.status(401).send({ err: "Please check your username"})
            }
        }
        let {password,username,email,id} = isUser[0];
        let isPassMatch = await bcrypt.compare(Password,password);
        if (!isPassMatch) {
            return rspo.status(401).send({ err: "Check your Password"})
        }
        const loginTime = new Date(); // current time

        // format it nicely
        const formattedTime = loginTime.toLocaleString('en-US', {
        timeZone: clientInfo.timeZone,   // optional: use user timezone
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
        let activity_url = `http://localhost:3221/checkInfo/${session_id}`
        let sendMail = await sendTheMail(
            email,
            "New Login Detected 🧐",
            "Login",
            {platform,city,ip,country,region,device_type,username,login_time:formattedTime,activity_url}
        )
        if (sendMail.rejected.length === 0) {
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
        rspo.status(500).send({ err: "Sever Side Error",details:error.message});
    }
}

