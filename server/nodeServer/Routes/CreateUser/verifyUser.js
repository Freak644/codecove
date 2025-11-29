import {database} from '../../Controllers/myConnectionFile.js';
import jwt from 'jsonwebtoken';
import {sendTheMail} from '../../Controllers/nodemailer.js'
import dotenv from 'dotenv';
import { completeRequest } from '../../Controllers/progressTracker.js';
import { Decrypt, Encrypt } from '../../utils/Encryption.js';
dotenv.config();
export const SendEmailVerify = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {username,email} = rkv.body;
    try {
        let [row] = await database.query("SELECT username, email FROM users WHERE username=? OR email=?",[username,email])

        if(row.some(crntRow=>crntRow.username === username)) return rspo.status(406).send({err:`${username} is Already taken`});
        if (row.some(crntRow=>crntRow.email === email)) return rspo.status(406).send({err:`Account Exists on ${email}`});
        if (
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
        let payload = {email,otp,username}
        if (send.rejected.length===0) {
            const token = jwt.sign(payload,process.env.jwt_sec,{expiresIn:"5m"});
            let encryptedToken = await Encrypt(token);
            rspo.cookie("otpToken", encryptedToken, {
              httpOnly: true,
              secure: true, 
              sameSite: "strict",
              maxAge: 6 * 60 * 1000
            });
            rspo.status(200).send({pass:"Email Send"});
        } else {
            rspo.status(504).send({err:"Something went wrong while sending the OTP"})
        }
    
    } catch (error) {
        console.log(error.message)
        rspo.status(500).send({err:"server side error"});
    }finally{
        completeRequest(crntIP,crntAPI)
    }
    
}

export const verifyEmail = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {username,email,inOTP} = rkv.body;
    
   try {
    if (
            !username?.trim() || !email?.trim() || !inOTP?.trim()
        ) {
            return rspo.status(401).send({err:"Unauthorized Request"})
        }
        let token = rkv.cookies.otpToken;
        let decryptedToken = await Decrypt(token);
        let tokenData = jwt.decode(decryptedToken,process.env.jwt_sec)
        let decodedTime = Math.floor(Date.now()/1000)
        if (!token) {
        return rspo.status(400).send({ err: "OTP Cookie is missing or expired" });
        }
        if (tokenData.exp<decodedTime) {
            return rspo.status(504).send({err:"The OTP is expire"})
        }
        
    if (tokenData.username !== username || tokenData.email !== email) {
        return rspo.status(401).send({ err: "Unauthorized request" });
        }

        // 4️⃣ Validate OTP
        if (tokenData.otp.toString() !== inOTP) {
        return rspo.status(400).send({ err: "Invalid OTP" });
        }

        // 5️⃣ OTP verified successfully
    
        if (tokenData.otp.toString() === inOTP) {
            rspo.clearCookie("otpToken");
            return rspo.status(200).send({ pass: "OTP verified successfully!" });
        }

   } catch (error) {
    rspo.status(500).send({err:"server side error",details:error.message})
   }finally{
    completeRequest(crntIP,crntAPI)
   }
}