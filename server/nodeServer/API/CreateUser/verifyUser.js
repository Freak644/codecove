import {database} from '../../Controllers/myConnectionFile.js';
import jwt from 'jsonwebtoken';
import {sendTheMail} from '../../Controllers/EmailService/nodemailer.js'
import { completeRequest } from '../../Controllers/src/middleware/progressTracker.js';
import redis from '../../Controllers/src/config/redis.js';
import crypto from 'crypto';
export const SendEmailVerify = async (rkv,rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {username,email} = rkv.body;
    try {
        if (!username || !username.trim() || !email || !email.trim()) return rspo.status(401).json({err:"Invalid Info"});
        
        const key = `otp:${email}`;

        let isBlock = await redis.exists(`emailBlocked:${email}`);
        if (isBlock) {
            let ttl = await redis.ttl(`emailBlocked:${email}`);
            let timeInM = Math.ceil(ttl / 60);
            return rspo.status(429).send({err:`Because of Too many Attemps OTP verificaiton is block for next ${timeInM}M`})
        }

        // 🚫 cooldown (atomic)
        const cooldownSet = await redis.set(
            `isCoolDown:${email}`,
            "1",
            { NX: true, EX: 120 }
        );

        if (!cooldownSet) {
            rspo.set("Retry-After", "120");
            return rspo.status(429).send({
                err: "Under Cool Down",
                retryAfter: 120
            });
        }
        let [row] = await database.query("SELECT username, email FROM users WHERE username=? OR email=?",[username,email])

        if(row.some(crntRow=>crntRow.username === username)) return rspo.status(406).send({err:`${username} is Already taken`});
        if (row.some(crntRow=>crntRow.email === email)) return rspo.status(406).send({err:`Account Exists on ${email}`});
        if (!email ||
        !email.endsWith("@gmail.com") ||
       !/^[A-Za-z0-9][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
         ) {
        return rspo.status(400).send({err:"Please Enter a valid Email"})
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        
        let send = await sendTheMail(
            email,
            "Welcome To CodeCove🎉",
            "Wellcome",
            {username,otp}
        )
        let hashOtp = crypto.createHash("sha256").update(otp.toString()).digest('hex')
        if (send.rejected.length===0) {
            await redis.set(key,hashOtp,{
                EX:300
            });

        
            rspo.status(200).send({pass:"Email Send"});
        } else {
            rspo.status(504).send({err:"Something went wrong while sending the OTP"})
        }
    
    } catch (error) {
        console.log(error.message)
        rspo.status(500).send({err:"server side error"});
    } finally {
        completeRequest(crntIP,crntAPI)
    }
    
}

export const verifyEmail = async (rkv,rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];

    let {username,email,inOTP} = rkv.body;
    
   try {
    if (
            !username?.trim() || !email?.trim() || !inOTP?.trim()
        ) {
            return rspo.status(401).send({err:"Unauthorized Request"})
        }
        let storeOtp = await redis.get(`otp:${email}`);
        
        if (!storeOtp) {
            rspo.status(400).send({err:"OTP! expired"})
        }
        const attemps = await redis.incr(`otp_attemps:${email}`);
        if (attemps === 1) {
            await redis.expire(`otp_attemps:${email}`,300);
        }

        if (attemps >= 5) {
            await redis.set(`emailBlocked:${email}`,"1",{
                EX:600
            })
            return rspo.status(429).send({err:"Too many attemps"})
        }

        const hashInput = crypto.createHash("sha256").update(inOTP).digest("hex");
        if (hashInput !== storeOtp) {
            return rspo.status(401).send({err:"Invalid OTP"});
        }
        await redis.del(`otp:${email}`);
        await redis.del(`otp_attemps:${email}`);
        await redis.set(`emailVerified:${email}`, "1", {
            EX:300
        })

        rspo.status(201).send({pass:"Otp Verifed"})
      
        
   } catch (error) {
    console.log(error.message)
    rspo.status(500).send({err:"server side error",details:error.message})
   } finally {
        completeRequest(crntIP,crntAPI)
   }
}