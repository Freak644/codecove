import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/progressTracker.js";

const verification = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {Username,Email,token} = rkv.body;
    try {
        if (token.length !== 32) return rspo.status(401).send({err:"Invalid Token"});
        let [rows] = await database.query("SELECT * FROM validationToken WHERE token_id = ?",[token]);
        if(rows.length === 0) return rspo.status(401).send({err:"Please check The token"});
        let {username,email,created_at,session_id} = rows[0];
        if(session_id.length !== 0) return rspo.status(401).send({err:"Don't Dare to be oversmart"});

        if (Date.now() - new Date(created_at).getTime() > 10 * 60 * 1000) {
            await database.query("DELETE FROM validationToken WHERE token_id = ?",[token]);
            return rspo.status(401).send({ err: "The token is expired" });
        }
        
        if (Username !== username || Email !== email) return rspo.status(401).send({err:"Invalid credentials"});
        await database.query("UPDATE validationToken SET isProccesing=1 WHERE token_id=?",[token]);
        rspo.send({pass:"User verified!"})
    } catch (error) {
        rspo.status(500).send({err:"Server side error"});
    }finally{
        completeRequest(crntIP,crntAPI);
    }
}

const resetPassword = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {pass,conPass,token} = rkv.body;

    try {
        if (token.length !== 32) return rspo.status(400).send({err:"Bad Request"});
        
    } catch (error) {
        rspo.status(500).send({err:"Server side error"});
    }finally{
        completeRequest(crntIP,crntAPI);
    }
}

export {verification,resetPassword}