import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { database } from '../../Controllers/myConnectionFile.js';
import { completeRequest } from '../../Controllers/progressTracker.js';
dotenv.config();
const revokedToken = async (session_id) => {
     await database.execute(
            "UPDATE user_sessions SET revoked=? WHERE session_id=?",
            [true,session_id]
        )
}
export const Auth = async (rkv,rspo,next) => {
    let token = rkv.cookies.myAuthToken;
    if(!token) return rspo.status(401).send({login: "Please Login"});
    let tokenData = jwt.decode(token,process.env.jwt_sec);
    let decodedTime = Math.floor(Date.now()/1000);
    let {session_id,id} = tokenData;
    if (tokenData.exp<decodedTime) {
        await revokedToken(session_id)
        return rspo.status(501).send({login: "Your Auth token is expire"});
    }
    let [rows] = await database.execute("SELECT revoked FROM user_sessions WHERE id=? AND session_id=?",
            [id,session_id]
    )
    if (rows.length === 0) {
        return rspo.status(404).send({login:"Token is removed on Invalid"})
    }
    let revoked = Number(rows[0].revoked)
    if(revoked===1) {
        return rspo.status(401).send({login:"Token rovoked"})
    }
    rkv.authData = tokenData;
    next();
}

export const checkAuth = async (rkv,rspo) => {
    const ip = rkv.clientIp?.replace(/^::ffff:/,"") || "0.0.0.0";
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let token = rkv.cookies.myAuthToken;
    try {
        if(!token) throw new Error();
        let tokenData = jwt.decode(token,process.env.jwt_sec);
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
    }finally{
        completeRequest(crntIP,crntAPI);
    }
}