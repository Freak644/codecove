import { database } from "../../Controllers/myConnectionFile.js";
import bcrypt from 'bcrypt';
import { completeRequest } from "../../Controllers/progressTracker.js";
export const changePassSecure = async (rkv,rspo) => {
    let {basePass,token} = rkv.body;
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let rows
    try {
        if (token.length !== 32) {
            return rspo.status(401).send({err:"Don't be too smart",details:"Invalid Token"})
        }
        [rows] = await database.query(`SELECT u.password,u.id, v.session_id FROM validationToken v
        INNER JOIN users u ON v.id = u.id WHERE token_id = ?`,[token]);
        if (rows.length<1) return rspo.status(401).send({err:"something went wrong",details:"Something went wrong"});
        let {password,id,session_id} = rows[0]
        if(session_id.length === 0) return rspo.status(401).send({err:"Something went wrong",details:"Don't dare be too smart"})
        let match = await bcrypt.compare(basePass,password)
        if (match) return rspo.status(400).send({err:"Something went wrong",details:"New_password !== old_password"});
        let newHashPass = await bcrypt.hash(basePass,10);
        let [updateQuery] = await database.query("UPDATE users SET password = ? WHERE id = ?",[newHashPass,id])
        if (updateQuery.affectedRows === 0) {
            return rspo.status(400).send({err:"User not found"})
        }
        await database.query("UPDATE validationToken SET isUsed = ? WHERE token_id = ?",[1,token])
        let [final] = await database.query("DELETE v, s FROM validationToken v JOIN user_sessions s ON v.id = s.id WHERE v.id = ?;",[id])
        rspo.status(200).send({pass:"Your password changed succesfully"})
    } catch (error) {
        rspo.status(500).send({err:"Sever side Error",details:error.message})
    }finally{
        completeRequest(crntIP,crntAPI);
    }
}

