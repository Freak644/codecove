import { data } from "react-router-dom";
import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/progressTracker.js";
import { getIO } from "../../../myServer.js";

export const starPost = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    let {post_id} = rkv.body;

    try {
        if (!post_id || !post_id.trim()) return rspo.status(401).send({err:"Something went wrong"});
        let io = getIO();
        let pass = false;
        let [row] = await database.query("SELECT visibility FROM posts WHERE post_id = ?",[post_id]);
        if (!row[0].visibility) return rspo.status(422).send({err:"The post is private"});
        let [rows] = await database.query("SELECT post_id FROM likes WHERE post_id = ? AND id = ?",[post_id,id]);
        if (rows.length === 0) {
            await database.query("INSERT INTO likes (post_id, id) VALUES ( ?, ?) ",[post_id,id]);
            await database.query("UPDATE posts SET totalLike = totalLike + 1 WHERE post_id = ?",[post_id]);
            pass = true
            io.emit("newLike",{post_id,user_id:id,like:true})
        } else {
            await database.query("DELETE FROM likes WHERE post_id = ? AND id = ?",[post_id,id]);
            await database.query("UPDATE posts SET totalLike = totalLike - 1 WHERE post_id = ?",[post_id]);
            io.emit("newLike",{post_id,user_id:id,like:false})
        }

        rspo.status(200).send({pass});
    } catch (error) {
        rspo.status(500).send({err:"Server Side error "});
    } finally {
        completeRequest(crntIP,crntAPI)
    }

}

export const likeComment = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    let {commentID,post_id} = rkv.body;
    try {
        if (!post_id || !commentID || !post_id.trim() || !commentID.trim()) return rspo.status(401).send({err:"Something went wrong"});
        let io = getIO();
        let [rows] = await database.query("SELECT visibility FROM posts WHERE post_id = ?",[post_id]);
        if (!rows[0].visibility) return rspo.status(422).send({err:"The post is private"});
        let [row] = await database.query("SELECT commentID FROM commentLikes WHERE commentID = ? AND id = ?",[commentID,id]);
        if (row.length === 0) {
            await database.query("INSERT INTO commentLikes (commentID, post_id, id) VALUES (?,?,?)",[commentID,post_id,id]);
            await database.query("UPDATE comments SET totalLike = totalLike + 1 WHERE commentID = ?",[commentID]);
            io.emit("newCommentLike",{post_id,commentID,user_id:id,like:true});
        } else {
            await database.query("DELETE FROM commentLikes WHERE commentID = ? AND post_id = ? AND id = ?",[commentID,post_id,id]);
            await database.query("UPDATE comments SET totalLike = totalLike - 1 WHERE commentID = ?",[commentID]);
            io.emit("newCommentLike",{post_id,commentID,user_id:id,like:false});
        }
        rspo.status(200).send({test:"done"});
    } catch (error) {
        
        rspo.status(500).send({err:"Server side error"});
    } finally {
        completeRequest(crntIP,crntAPI)
    }
}

export const savePost = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    let {pst_id: post_id} = rkv.body;
    try {
        if (!post_id || post_id.length !== 21) return rspo.status(401).send("Validation Error");
        let [rows] = await database.query("SELECT P.*, EXISTS (SELECT 1 FROM follows WHERE follower_id = ? AND following_id = p.id) AS isFollowing FROM posts P WHERE post_id = ?",[id, post_id])
        if (rows.length !== 1) return rspo.status(401).send({err:"Wrong Post id"});
        let {isFollowing,visibility,} = rows[0]
        console.log(isFollowing)
        rspo.json({pass:"Ok"})
    } catch (error) {
        rspo.status(500).send({err:"Server side error"});
    } finally {
        completeRequest(crntIP,crntAPI);
    }
}