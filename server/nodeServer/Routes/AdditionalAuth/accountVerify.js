import jwt from "jsonwebtoken";
// import { sendTheMail } from "../../Controllers/nodemailer";
import { Decrypt } from "../../utils/Encryption.js";
import {nanoid} from 'nanoid';
import { completeRequest } from "../../Controllers/progressTracker.js";

export const VerifyUser = async (rkv, rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {username, email} = rkv.body;

    try {
        let request_id = nanoid();
        let token = rkv.cookies.mergeRequest;
        if (!token) {
            return rspo.status(400).send({ err: "OTP Cookie is missing or expired" });
        }
        let decryptedToken = await Decrypt(token);
        let tokenData = jwt.decode(decryptedToken, process.env.jwt_sec);
        let decodedTime = Math.floor(Date.now()/1000);
        if (tokenData.exp<decodedTime) {
            return rspo.status(504).send({err:"Google Data is now Expire"});
        }
        console.log(tokenData)


        
        const otp = Math.floor(100000 + Math.random() * 900000);

        rspo.json({pass:"till now"})
        //let send = await sendTheMail()
    } catch (error) {
        console.log(error.message)
        rspo.json({err:"Server side error"})
    } finally {
        completeRequest(crntIP, crntAPI);
    }
}