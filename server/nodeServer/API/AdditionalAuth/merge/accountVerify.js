import jwt from "jsonwebtoken";
// import { sendTheMail } from "../../Controllers/nodemailer";
import { Decrypt, Encrypt } from "../../../utils/Encryption.js";
import {nanoid} from 'nanoid';
import { completeRequest } from "../../../Controllers/src/middleware/progressTracker.js";
import { database } from "../../../Controllers/myConnectionFile.js";
import geoip from 'geoip-lite';
import { UAParser } from "ua-parser-js";
import { sendTheMail } from "../../../Controllers/EmailService/nodemailer.js";
import redis from "../../../Controllers/src/config/redis.js";
export const VerifyUserMail = async (rkv, rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    const geo = geoip.lookup(crntIP);
    const uAresult = new UAParser(rkv.headers["user-agent"] || "").getResult();


    try {
        let request_id = nanoid();
        
        let token = rkv.cookies.myMergeData;
        
        if (!token) {
            return rspo.status(400).send({ err: "Session Cookie is missing or expired" });
        }
        
        // decoding the token
        let decryptedToken = await Decrypt(token);
        let tokenData = jwt.decode(decryptedToken, process.env.jwt_sec);
        let decodedTime = Math.floor(Date.now()/1000);
        let isExist = await redis.exists(`isCoolDown:${tokenData.email}`)
        if (isExist) {
            return rspo.status(400).send({err:"An Verification Email is already Sent"});
        }
        if (tokenData.exp<decodedTime) {
            return rspo.status(504).send({err:"Google Data is now Expire"});
        }
        // console.log(uAresult)
        //save the token is Database;

        await database.query(`INSERT INTO merge_request (request_id, user_id, ip) VALUE (?, ?, ?);`,
            [request_id, tokenData.user_id, crntIP]
        )
       

        
        let send = await sendTheMail(
            tokenData.email,
            `Verify Merge request with ${tokenData.provider}`,
            "merge",
            {
                provider:tokenData.provider,
                username:tokenData.username,
                browser:`${uAresult.browser.name} ${uAresult.os.name}`,
                city:geo?.city,
                regione:geo?.region,
                country:geo?.country,
                verify_url:`${process.env.BACKEND_URL}auth/verify/mergeToken?token=${encodeURIComponent(request_id)}`
            }
            
        );

        if (send.rejected.length === 0) {
            let authToken = jwt.sign({...tokenData, request_id},process.env.jwt_sec);
            let encryptedToken = await Encrypt(authToken);

             rspo.cookie("myMergeData",encryptedToken,{
                httpOnly:true,
                secure:true,
                sameSite:"lax",
                maxAge:6 * 60 * 1000 // 6m
            });
            return rspo.redirect(process.env.FRONTEND_URL);
        } else {
            return rspo.json({err:"Error with email server"})
        }

        
    } catch (error) {
        console.log(error.message)
        return rspo.json({err:"Server side error"})
    } finally {
        completeRequest(crntIP, crntAPI);
    }
}