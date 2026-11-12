import jwt from 'jsonwebtoken';;
import { database } from '../../Controllers/myConnectionFile.js';
import { Decrypt } from '../../utils/Encryption.js';
import { completeRequest } from '../../Controllers/src/middleware/progressTracker.js';
import { CrntUser } from '../getUsers/userInfo/getCurrentUserdata.js';
const revokedToken = async (session_id) => {
     await database.execute(
            "UPDATE user_sessions SET revoked=? WHERE session_id=?",
            [true,session_id]
        )
}
export const Auth = async (rkv,rspo,next) => {
    const crntIp = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    try {
        let token = rkv.cookies.myAuthToken;
        if(!token) {
            return rspo.status(401).send({err: "Please Login"});
        }
        let decryptedToken = await Decrypt(token);
        let tokenData = jwt.decode(decryptedToken,process.env.jwt_sec, {algorithms: ["HS256"]});
        let decodedTime = Math.floor(Date.now()/1000);
        let {session_id,id} = tokenData;
        // console.log(session_id);
        // console.log(tokenData.exp<decodedTime);
        if (tokenData.exp<decodedTime) {
            await revokedToken(session_id);
            completeRequest(crntIp,crntAPI);
            return rspo.status(501).send({err: "Your Auth token is expired"});
        }
        let [rows] = await database.execute("SELECT revoked FROM user_sessions WHERE id=? AND session_id=?",
                [id,session_id]
        )
        
        if (rows.length === 0) {
            completeRequest(crntIp,crntAPI);
            return rspo.status(404).send({err:"Token is removed or Invalid"})
        }
        let revoked = Number(rows[0].revoked);
        if(revoked===1) {
            completeRequest(crntIp,crntAPI);
            return rspo.status(401).send({err:"Token rovoked"});
        }
        rkv.authData = tokenData;
        next();
    } catch (error) {
        completeRequest(crntIp,crntAPI);
        rspo.status(500).send({err:"server side error"});
    }
}

export const checkAuth = async (rkv,rspo) => {
    // const ip = rkv.userIp.replace(/^::ffff:/,"") || "0.0.0.0";
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    let token = rkv.cookies.myAuthToken;
    try {
        if(!token) throw new Error();
        let decryptedToken = await Decrypt(token);
        let tokenData = jwt.decode(decryptedToken,process.env.jwt_sec, {algorithms: ["HS256"]});
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
        // console.log(rows, ip, );
        let revoked = Number(rows[0].revoked);
        if (revoked === 1 ) {
            await revokedToken(session_id)
            throw new Error("token Revoked");
        }
        const userInfo = await CrntUser(id);
        
        if (userInfo.err) {
            throw new Error(userInfo.err);
        }
        rspo.status(201).send({loggedIn:false,userInfo})
    } catch (error) {
        console.log(error.message)
        rspo.status(401).send({loggedIn:true,details:error.message})
    } finally {
        completeRequest(crntIP,crntAPI);
    }
}