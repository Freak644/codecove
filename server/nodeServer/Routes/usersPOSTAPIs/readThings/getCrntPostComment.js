import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/progressTracker.js";

export const getComment = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    let {post_id,offset,limit} = rkv.query;
    const intLimit = parseInt(limit) || 10;
    const intOffset = parseInt(offset) || 0;
    if (limit>20) {
        limit = 10;
    }
    try {
        let [rows] = await database.query("SELECT canComment, visibility, id AS user_id FROM posts WHERE post_id = ?",[post_id]);
        if (rows.length !== 1) return rspo.status(401).send({err:"Heheheheheeeeeeee...."});
        const {visibility,canComment,user_id} = rows[0];
        if ((!visibility || !canComment) && user_id !== id) return rspo.status(401).send({err:"Heheheheheeeeee....",isComment:false});
        const [commentrows] = await database.query(`SELECT 
                    u.id,
                    u.username,
                    u.avatar,
                    c.*,
                    p.post_moment,
                     EXISTS (
                        SELECT 1
                        FROM posts pst
                        WHERE pst.post_id = c.post_id AND pst.id = ?
                     ) AS isPostOwner,
                    EXISTS (
                        SELECT 1
                        FROM commentLikes cmLike
                        WHERE cmLike.commentID = c.commentID AND cmLike.id = ?
                      ) AS isLiked
                FROM comments c
                INNER JOIN users u 
                    ON u.id = c.id
                INNER JOIN posts p
                    ON p.post_id = c.post_id
                WHERE c.post_id = ? AND c.isBlocked=0 AND c.report_count < 100
                ORDER BY c.created_at DESC
                LIMIT ? OFFSET ?`,[id,id,post_id,intLimit,intOffset]);
        rspo.send({pass:"Done h boss",commentrows})
    } catch (error) {
        console.log(error.message);
        rspo.status(500).send({err:"Server Side Error"});
    } finally {
        completeRequest(crntIP,crntAPI)
    }
}
