import { database } from "../../Controllers/myConnectionFile.js";
import bcrypt from 'bcrypt';
import { nanoid } from "nanoid";
import { sendChangePassMail } from "../../utils/sendChangeMail.js";
export const changePassSecure = async (rkv,rspo) => {
    let {basePass,token} = rkv.body;
    let rows
    let newToken_id = nanoid(32);
    try {
        if (basePass.length < 6) return rspo.status(400).send({err:"Password.length < 6 "})
        if (token.length !== 32) {
            return rspo.status(401).send({err:"Don't be too smart",details:"Invalid Token"})
        }
        [rows] = await database.query(`SELECT u.email, u.username, u.password,u.id, v.session_id FROM validationToken v
        INNER JOIN users u ON v.id = u.id WHERE token_id = ?`,[token]);
        if (rows.length<1) return rspo.status(401).send({err:"something went wrong",details:"Something went wrong"});
        let {password,id,session_id} = rows[0]
        if(session_id.length === 0) return rspo.status(401).send({err:"Something went wrong",details:"Don't dare be too smart"})
        let match = await bcrypt.compare(basePass,password)
        if (match) return rspo.status(400).send({err:"Something went wrong",details:"New_password !== old_password"});
        let newHashPass = await bcrypt.hash(basePass,10);
        await database.query("INSERT INTO validationToken (token_id, id, session_id, username, email) VALUES (?,?,?,?,?);",
            [newToken_id, rows[0].id,"",rows[0].username,rows[0].email]
        );
        await sendChangePassMail(rkv,rows[0].email,newToken_id);
        let [updateQuery] = await database.query("UPDATE users SET password = ? WHERE id = ?",[newHashPass,id])
        if (updateQuery.affectedRows === 0) {
            return rspo.status(400).send({err:"User not found"})
        }
        let [final] = await database.query("DELETE v, s FROM validationToken v JOIN user_sessions s ON v.id = s.id WHERE v.id = ?;",[id]);
        rspo.status(200).send({pass:"Your password changed succesfully"})
    } catch (error) {
        console.log(error)
        rspo.status(500).send({err:"Sever side Error",details:error.message})
    }
}

