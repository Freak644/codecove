import { database } from "../../Controllers/myConnectionFile.js";
import bcrypt from 'bcrypt';
import { completeRequest } from "../../Controllers/progressTracker.js";
export const changePassSecure = async (rkv,rspo) => {
    let {basePass,session_id} = rkv.body;
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let userID = rkv.cookies.tempID;
    let rows
    try {
        if (!userID) {
            [rows] = await database.query(`SELECT u.password,u.id,s.ip FROM user_sessions s
            INNER JOIN users u ON s.id = u.id WHERE session_id = ?`,[session_id]);
        } else{
            [rows] = await database.query(`SELECT password,id FROM users WHERE id = ?`,[userID]);
        }
        if (rows.length<1) return rspo.status(401).send({err:"something went wrong",details:"Something went wrong"});
        let {password,id} = rows[0]
        let match = await bcrypt.compare(basePass,password)
        if (match) return rspo.status(400).send({err:"Something went wrong",details:"New_password !== old_password"});
        let newHashPass = await bcrypt.hash(basePass,10);
        let [updateQuery] = await database.query("UPDATE users SET password = ? WHERE id = ?",[newHashPass,id])
        if (updateQuery.affectedRows === 0) {
            return rspo.status(400).send({err:"User not found"})
        }
        let [final] = await database.query("DELETE FROM user_sessions WHERE id=?",[id])
        rspo.status(200).send({pass:"Your password changed succesfully"})
    } catch (error) {
        rspo.status(500).send({err:"Sever side Error",details:error.message})
    }finally{
        completeRequest(crntIP,crntAPI);
    }
}

