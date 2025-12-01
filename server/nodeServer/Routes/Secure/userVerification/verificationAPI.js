import bcrypt from "bcrypt";
import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/progressTracker.js";
import { sendChangePassMail } from "../../../utils/sendChangeMail.js";
import { nanoid } from "nanoid";
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
    let newToken_id = nanoid(32)
    try {
        if (token.length !== 32) return rspo.status(400).send({err:"Bad Request"});
        if (pass.length < 6 || pass !== conPass) return rspo.status(400).send({err:"Invalid password"});
        let [rows] = await database.query(`SELECT u.email, u.username, u.password,u.id, v.session_id FROM validationToken v
        INNER JOIN users u ON v.id = u.id WHERE token_id = ?`,[token]);
        if (rows.length === 0 ) return rspo.status(401).send({err:"Unauthorized"});
        let {email,username,password,id,session_id} = rows[0];
        if(session_id.length !== 0) return rspo.status(401).send({err:"Don't dare be oversmart"});
        let match = await bcrypt.compare(conPass,password);
        if (match) return rspo.status(400).send({err:"New_password must me diffrent from old_Password"});
        let newHashPass = await bcrypt.hash(pass,10);
        await database.query("INSERT INTO validationToken (token_id, id, session_id, username, email) VALUES (?,?,?,?,?);",
            [newToken_id, rows[0].id,"",username,email]
        );
        await sendChangePassMail(rkv,email,username,newToken_id);
        let [updateQuery] = await database.query("UPDATE users SET password = ? WHERE id = ?",[newHashPass,id])
        if (updateQuery.affectedRows === 0) {
            return rspo.status(400).send({err:"User not found"})
        }
        let [final] = await database.query("DELETE v, s FROM validationToken v JOIN user_sessions s ON v.id = s.id WHERE v.id = ?;",[id]);
        rspo.status(200).send({pass:"Your password changed succesfully"})
       } catch (error) {
        console.log(error.message)
        rspo.status(500).send({err:"Server side error"});
    }finally{
        completeRequest(crntIP,crntAPI);
    }
}

export {verification,resetPassword}