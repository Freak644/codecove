import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/progressTracker.js";


export const starPost = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    let {post_id} = rkv.body;

    try {
        if (!post_id || !post_id.trim()) return rspo.status(401).send({err:"Something went wrong"});
        let pass = false;
        let [row] = await database.query("SELECT visibility FROM posts WHERE post_id = ?",[post_id]);
        if (!row[0].visibility) return rspo.status(422).send({err:"The post is private"});
        let [rows] = await database.query("SELECT post_id FROM likes WHERE post_id = ? AND id = ?",[post_id,id]);
        if (rows.length === 0) {
            await database.query("INSERT INTO likes (post_id, id) VALUES ( ?, ?) ",[post_id,id]);
            await database.query("UPDATE posts SET totalLike = totalLike + 1 WHERE post_id = ?",[post_id]);

        } else {
            await database.query("DELETE FROM likes WHERE post_id = ? AND id = ?",[post_id,id]);
            await database.query("UPDATE posts SET totalLike = totalLike - 1 WHERE post_id = ?",[post_id]);
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
        if (!post_id || !commentID || !post_id.trim() || !commentID.trim() || post_id.length !== 21) return rspo.status(401).send({err:"Something went wrong"});
        let [rows] = await database.query("SELECT visibility FROM posts WHERE post_id = ?",[post_id]);
        if (!rows[0].visibility) return rspo.status(422).send({err:"The post is private"});
        let [row] = await database.query("SELECT commentID FROM commentLikes WHERE commentID = ? AND id = ?",[commentID,id]);
        if (row.length === 0) {
            await database.query("INSERT INTO commentLikes (commentID, post_id, id) VALUES (?,?,?)",[commentID,post_id,id]);
            await database.query("UPDATE comments SET totalLike = totalLike + 1 WHERE commentID = ?",[commentID]);

        } else {
            await database.query("DELETE FROM commentLikes WHERE commentID = ? AND post_id = ? AND id = ?",[commentID,post_id,id]);
            await database.query("UPDATE comments SET totalLike = totalLike - 1 WHERE commentID = ?",[commentID]);
          
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
        let [rows] = await database.query("SELECT P.*, EXISTS (SELECT 1 FROM follows WHERE follower_id = ? AND following_id = p.id) AS isFollowing, EXISTS (SELECT 1 FROM savePost WHERE id = ? AND post_id = P.post_id) AS isSaved FROM posts P WHERE post_id = ?",[id, id, post_id])
        if (rows.length !== 1) return rspo.status(401).send({err:"Wrong Post id"});
        let {isFollowing,visibility,canSave, id: user_id, isSaved} = rows[0];
        if (!visibility && user_id !== id) return rspo.status(403).send({err:"This post is now private"});
        if (!canSave) return rspo.status(401).send({err:"This can't be saved"});
        if (canSave === "Follower") {
            if (!isFollowing && user_id !== id) {
                return rspo.status(401).send({err:"Saving is available only for followers "})
            }
        }
        if (!isSaved) {
            await database.query("INSERT INTO savePost (id, post_id) VALUE(?,?);",[id,post_id]);
            await database.query("UPDATE posts SET totalSave = totalSave + 1 WHERE post_id = ?",[post_id]);
        } else {
            await database.query("DELETE FROM savePost WHERE id = ? AND post_id = ?",[id,post_id]);
            await database.query("UPDATE posts SET totalSave = totalSave - 1 WHERE post_id = ?",[post_id]);
        }
        
        rspo.json({pass:"Ok"})
    } catch (error) {
        console.log(error.message)
        rspo.status(500).send({err:"Server side error"});
    } finally {
        completeRequest(crntIP,crntAPI);
    }
}