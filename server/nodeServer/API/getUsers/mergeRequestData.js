import { completeRequest } from "../../Controllers/src/middleware/progressTracker.js";
import {Decrypt} from '../../utils/Encryption.js'
import jwt from 'jsonwebtoken'
export const MergeRequestData = async (rkv, rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    console.log(crntIP)
    try {
        let token = rkv.cookies.myMergeData;
        if (!token) {
            return rspo.status(400).send({err:"Cookie is missing or expired"})
        }
        let decryptedToken = await Decrypt(token);
        let tokenData = jwt.decode(decryptedToken, process.env.jwt_sec);
        let decodedTime = Math.floor(Date.now()/1000);
        if (tokenData.exp<decodedTime) {
            return rspo.status(504).send({err:"Google Data is now Expire"});
        }
        delete tokenData.accessToken;
        delete tokenData.providerAccount_id;
        rspo.json({pass:tokenData});
    } catch (error) {
        console.log(error.message)
        rspo.status(500).send({err:"Server Side Error"});
    } finally {
        
        completeRequest(crntIP,crntAPI);
    }
}