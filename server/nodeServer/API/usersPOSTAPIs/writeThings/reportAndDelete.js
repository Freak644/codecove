import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/src/middleware/progressTracker.js";
import {getIO} from '../../../myServer.js';
export const ReportPost = async (rkv,rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {post_id} = rkv.body;
    let {id} = rkv.authData;
    try {
        if (!post_id || post_id.length !== 21) return rspo.status(401).send({err:"Auth Error"});
        let [rows] = await database.query("SELECT p.visibility, p.id AS user_id, EXISTS(SELECT 1 FROM postReports WHERE id = ? AND post_id = p.post_id) AS isReported FROM posts p WHERE post_id = ?",
            [id,post_id]
        );
        if (rows.length === 0) return rspo.status(401).send({err:"Something went wrong"});
        let {visibility,user_id, isReported} = rows[0];
        if (isReported) return rspo.status(403).send({err:"Already repoted"});

        if (!visibility && user_id !== id) return rspo.status(401).send({err:"Auth Error"});
        await database.query("INSERT INTO postReports (id, post_id) VALUES (?,?)",
            [id, post_id])
        rspo.json({pass:"Done"})
    } catch (error) {
        console.log(error.message)
        rspo.status(500).send({err:"Server Side Error"});
    } finally {
        completeRequest(crntIP,crntAPI);
    }
}


export const DeletePost = async (rkv,rspo) => {
    
}

export const reportCommentAPI = async (rkv,rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    let {commentID,post_id} = rkv.body;
    try {
        if (!commentID.trim() || !post_id.trim()) return rspo.status(401).send({err:"Something went wrong"}); 
        let [rows] = await database.query("SELECT commentID FROM commentReports WHERE commentID = ? AND id = ? AND post_id = ?",
            [commentID,id,post_id]);
        if (rows.length !== 0) return rspo.status(400).send({err:"A report is Already submited!"});
        let [row] = await database.query("SELECT report_count FROM comments WHERE commentID = ? AND isBlocked <> 1",[commentID]);
        if (row.length === 0) return rspo.status(401).send({err:"This comment is Blocked or removed!"});
        if (row[0].report_count >= 99) {
            await database.query("UPDATE comments SET isBlocked = 1 WHERE commentID = ?",[commentID]);
        }
        await database.query("INSERT INTO commentReports (id,post_id,commentID) VALUES (?,?,?);",[id,post_id,commentID]);
        await database.query("UPDATE comments SET report_count = report_count + 1 WHERE commentID = ?",[commentID]);
        rspo.status(200).send({pass:"Report Submited!"});
    } catch (error) {
        // console.log(error.message)
        rspo.status(500).send({err:"Server side Error"});
    } finally {
        completeRequest(crntIP,crntAPI)
    }
}

export const DeleteCommentAPI = async (rkv,rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    let {commentID,post_id} = rkv.body;
    try {
        console.log(post_id)
        if (!post_id || !commentID || !commentID.trim() || !post_id.trim()) return rspo.status(401).send({err:"Something went wrong"});
        let [rows] = await database.query("SELECT EXISTS (SELECT 1 FROM comments c JOIN posts p ON p.post_id = c.post_id WHERE c.commentID = ? AND ( p.id = ? OR c.id = ?)) AS isAuth;",[commentID,id,id]);
        let {isAuth} = rows[0]; // the query is check is crntUser is comment owner or the post owner
        if (!isAuth) return rspo.status(401).send({err:"You! didn't have auth"});
        await database.query("DELETE FROM comments WHERE commentID = ?",[commentID]);
        await database.query("UPDATE posts SET totalComment = totalComment - 1 WHERE post_id = ?",[post_id])
        let io = getIO();
        io.emit("deleteComment",{post_id,commentID,id,activity:false});
        rspo.status(200).send({pass:"Deleted!"})
    } catch (error) {
        // console.log(error.message);
        rspo.status(500).send({err:"Server side error"});
    } finally {
        completeRequest(crntIP,crntAPI)
    }
}