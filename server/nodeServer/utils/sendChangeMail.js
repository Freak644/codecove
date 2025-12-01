import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";
import { sendTheMail } from "../Controllers/nodemailer.js";

export const sendChangePassMail = async (rkv,email,newToken_id,username) => {
    
    const userAgent = rkv.headers["user-agent"] || "";
     const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const geo = geoip.lookup(crntIP);
    const parser = new UAParser(userAgent);
    const uAresult = parser.getResult();

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
            os:uAresult?.os.name || "",
            browser:uAresult?.browser.name || "",
            city:geo?.city,
            region:geo?.region,
            country:geo?.country,
            time:formattedTime,
            activity_url:`http://localhost:3221/resetPassword/${newToken_id}`
        }

        await sendTheMail(
            email,
            "Password Changed",
            "password",
            emailObj
        )
}