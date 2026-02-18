import { database } from "../../Controllers/myConnectionFile.js";
import { sendTheMail } from "../../Controllers/nodemailer.js";
import geoip from 'geoip-lite';
import dotenv from 'dotenv';
import { UAParser } from "ua-parser-js";
import { nanoid } from "nanoid";
import { completeRequest } from "../../Controllers/progressTracker.js";
dotenv.config();
export const forgotPass = async (rkv,rspo) => {
    const miniIP = rkv.clientIp?.replace(/^::ffff:/,"") || rkv.ip ||"0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    const userAgent = rkv.headers["user-agent"] || "";
    const geo = geoip.lookup(miniIP);
    const parser = new UAParser(userAgent);
    const uAresult = parser.getResult();
    let {Email,e_mail} = rkv.body;
    if (!Email) {
        Email = rkv.body.email;
    }
    try {
        if(!Email?.trim()) return rspo.status(401).send({err:"Field is requird"});
        let [row] = await database.query("SELECT avatar,id,username,email FROM users WHERE email = ? OR username = ?",
            [Email,Email]
        )
        if (row.length<1) {
            return rspo.status(404).send({err:"Account Not found"})
        }
        let {email,username,id,avatar} = row[0];
        const [user,domain] = email.split("@");
        const visible = user.slice(-3);
        const mask = "*".repeat(user.length-3);
        const mail = mask +visible +"@"+domain;
        if (!Email?.trim() || !e_mail?.trim()) {
            function askFor() {
                if (Email.endsWith("@gmail.com")) {
                    return "Username"
                }else{
                    return "Email"
                }
            }
            return rspo.status(202).send({find:askFor(),mail});
        }
        let tempArray = [email,username];
        if (!tempArray.includes(email) || !tempArray.includes(e_mail)) {
            return rspo.status(401).send({err:"Sorry we can't verify that account belongs to you "})
        }
        let token_id = nanoid(32) 
        const loginTime = new Date();
        const formattedTime = loginTime.toLocaleString('en-US', {
            timeZone: geo?.timezone,   
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        let emailObj = {
            username,
            img_url:`Unava`,
            device_type: uAresult?.device.type || "desktop",
            platform: uAresult.os.name,
            ip:miniIP,
            city:geo?.city,
            region:geo?.region,
            country:geo?.country,
            attempt_time:formattedTime,
            security_url:`http://localhost:3221/resetPassword/${token_id}`
        }
        await database.query("INSERT INTO validationToken (token_id, id, session_id, username, email) VALUES (?,?,?,?,?);"
            ,[token_id,id,"",username,email]
        )
        await sendTheMail(
            email,
            "Reset Password ?",
            "forgot",
            emailObj
        )
        rspo.status(200).send({pass:"We send the reset like on your Email"})
    } catch (error) {
        console.log(error.message)
        rspo.status(500).send({err:"Sever side error"});
    } finally {
        completeRequest(miniIP,crntAPI);
    }
}