import { database } from "../../Controllers/myConnectionFile.js";
import { sendTheMail } from "../../Controllers/nodemailer.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();
export const forgotPass = async (rkv,rspo) => {
    let {Email} = rkv.body;
    if (!Email) {
        Email = rkv.body.email;
    }
    try {
        if(!Email.trim()) return rspo.status(401).send({err:"Field is requird"});
        let [row] = await database.query("SELECT id,username,email FROM users WHERE email = ? OR username = ?",
            [Email,Email]
        )
        if (row.length<1) {
            return rspo.status(404).send({err:"Account Not found"})
        }
        let {email,username,id} = row[0]
        const otp = Math.floor(100000 + Math.random() * 900000);
        let sendMail = await sendTheMail(
            email,
            "⚠️Reset Password ?",
            "forgot",
            {otp}
        )
        let payload = {email,otp,username,id}
        if (sendMail.rejected.length === 0) {
            const token = jwt.sign(payload,process.env.jwt_sec,{expiresIn:"5m"});
            rspo.cookie("otpToken",token,{
                httpOnly:true,
                secure:true,
                sameSite:"strict",
                maxAge:6 * 60 * 1000
            });
            rspo.status(200).send({pass:"Done Boss",email,username})
        }
    } catch (error) {
        console.log(error.message)
        rspo.status(500).send({err:"Sever side error",details:error.message});
    }
    rspo.end();
}