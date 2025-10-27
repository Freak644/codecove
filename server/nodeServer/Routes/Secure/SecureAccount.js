import { database } from "../../Controllers/myConnectionFile.js";
import bcrypt from 'bcrypt';
export const changePassSecure = async (rkv,rspo) => {
    let {basePass,session_id} = rkv.body;
    
    try {
        let [rows] = await database.query(`SELECT u.password,u.id,s.ip FROM user_sessions s
            INNER JOIN users u ON s.id = u.id WHERE session_id = ?`,[session_id]);
        if (rows.length<1) return rspo.status(401).send({err:"something went wrong",details:"Something went wrong"});
        let match = await bcrypt.compare(basePass,rows[0].password)
        if (match) return rspo.status(400).send({err:"Something went wrong",details:"New_password !== old_password"});
        let newHashPass = await bcrypt.hash(basePass,10);
        let [updateQuery] = await database.query("UPDATE users SET password = ? WHERE id = ?",[newHashPass,rows[0].id])
        if (updateQuery.affectedRows === 0) {
            return rspo.status(400).send({err:"User not found"})
        }
        let [final] = await database.query("DELETE FROM user_sessions WHERE id=?",[rows[0].id])
        rspo.status(200).send({pass:"Your password changed succesfully"})
    } catch (error) {
        rspo.status(500).send({err:"Sever side Error",details:error.message})
    }
}