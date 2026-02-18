import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { database } from '../../Controllers/myConnectionFile.js';
import { Decrypt } from '../../utils/Encryption.js';
import { completeRequest } from '../../Controllers/progressTracker.js';
dotenv.config();
const revokedToken = async (session_id) => {
     await database.execute(
            "UPDATE user_sessions SET revoked=? WHERE session_id=?",
            [true,session_id]
        )
}
export const Auth = async (rkv,rspo,next) => {

    try {
        let token = rkv.cookies.myAuthToken;
        if(!token) {
            return rspo.status(401).send({err: "Please Login"});
        }
        let decryptedToken = await Decrypt(token);
        let tokenData = jwt.decode(decryptedToken,process.env.jwt_sec);
        let decodedTime = Math.floor(Date.now()/1000);
        let {session_id,id} = tokenData;
        if (tokenData.exp<decodedTime) {
            await revokedToken(session_id)
            return rspo.status(501).send({err: "Your Auth token is expire please relode the page"});
        }
        let [rows] = await database.execute("SELECT revoked FROM user_sessions WHERE id=? AND session_id=?",
                [id,session_id]
        )
        if (rows.length === 0) {
            return rspo.status(404).send({err:"Token is removed or Invalid"})
        }
        let revoked = Number(rows[0].revoked)
        if(revoked===1) {
            return rspo.status(401).send({err:"Token rovoked"})
        }
        rkv.authData = tokenData;
        next();
    } catch (error) {
        rspo.status(500).send({err:"server side error"})
    }
}

export const checkAuth = async (rkv,rspo) => {
    const ip = rkv.clientIp?.replace(/^::ffff:/,"") || "0.0.0.0";
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let token = rkv.cookies.myAuthToken;
    try {
        if(!token) throw new Error();
        let decryptedToken = await Decrypt(token);
        let tokenData = jwt.decode(decryptedToken,process.env.jwt_sec);
        let decodedTime = Math.floor(Date.now()/1000);
        let {id,session_id} = tokenData;

        if (tokenData.exp<decodedTime){
            await revokedToken(session_id)
            throw new Error("Token Expired")
        } 
        let [rows] = await database.execute("SELECT revoked,ip FROM user_sessions WHERE id=? AND session_id=?",
            [id,session_id]
        )
        if (rows.length === 0) {
        return rspo.status(404).send({loggedIn:true})
        }
        let revoked = Number(rows[0].revoked);
        if (revoked === 1 || rows[0].ip !== ip) {
            await revokedToken(session_id)
            throw new Error("token Revoked");
        }

        rspo.status(201).send({loggedIn:false})
    } catch (error) {
        console.log(error.message)
        rspo.status(401).send({loggedIn:true,details:error.message})
    } finally {
        completeRequest(crntIP,crntAPI)
    }
}