import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/progressTracker.js";
import {getIO} from '../../../myServer.js';
export const miniToggleDy = async (rkv,rspo) => {
    let {id} = rkv.authData;
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {setting,post_id} = rkv.body;
    let validationArray = ["likeCount","canComment","visibility"];
    try {
        if (!setting.trim() || !post_id.trim()) return rspo.status(400).send({err:"Something went wrong ()"})
        if (!validationArray.includes(setting)) return rspo.status(400).send({err:"Invalid Toggle key"});
        let [row] = await database.query(`SELECT ${setting} FROM posts WHERE post_id = ? AND id = ?`,[post_id,id]);
        if (row.length === 0) return rspo.status(401).send({err:"Something went wrong "});
        await database.query(`UPDATE posts SET ${setting} = NOT ${setting} WHERE post_id = ? AND id=?`,[post_id,id])
        rspo.status(200).send({pass:"Update! succesfully"})
    } catch (error) {
        rspo.status(500).send({err:"server side error"});
    }finally{
        completeRequest(crntIP,crntAPI);
    }
}

export const reportCommentAPI = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    let {commentID,post_id} = rkv.body;
    try {
        if (!commentID.trim() || !post_id.trim()) return rspo.status(401).send({err:"Something went wrong"}); 
        let [rows] = await database.query("SELECT commentID FROM commentReports WHERE commentID = ? AND id = ? AND post_id = ?",
            [commentID,id,post_id]);
        if (rows.length !== 0) return rspo.status(400).send({err:"A report is Already submited!"});
        await database.query("INSERT INTO commentReports (id,post_id,commentID) VALUES (?,?,?);",[id,post_id,commentID])
        rspo.status(200).send({pass:"Report Submited!"});
    } catch (error) {
        console.log(error.message)
        rspo.status(500).send({err:"Server side Error"});
    } finally {
        completeRequest(crntIP,crntAPI)
    }
}

export const DeleteCommentAPI = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/,"") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    let {commentID,post_id} = rkv.body;
    try {
        console.log(post_id)
        if (!commentID.trim() || !post_id.trim()) return rspo.status(401).send({err:"Something went wrong"});
        let [rows] = await database.query("SELECT EXISTS (SELECT 1 FROM comments c JOIN posts p ON p.post_id = c.post_id WHERE c.commentID = ? AND ( p.id = ? OR c.id = ?)) AS isAuth;",[commentID,id,id]);
        let {isAuth} = rows[0];
        if (!isAuth) return rspo.status(401).send({err:"You! didn't have auth"});
        await database.query("DELETE FROM comments WHERE commentID = ?",[commentID]);
        let io = getIO();
        io.emit("deleteComment",{post_id,commentID,id})
        rspo.status(200).send({pass:"Deleted!"})
    } catch (error) {
        console.log(error.message);
        rspo.status(500).send({err:"Server side error"});
    } finally {
        completeRequest(crntIP,crntAPI);
    }
}