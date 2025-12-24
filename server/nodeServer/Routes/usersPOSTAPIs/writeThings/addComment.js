import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/progressTracker.js";
import {nanoid} from 'nanoid';
import { getIO } from "../../../myServer.js";
const validateComment = async (blockCat,comment) => {
    const enableCat = Object.keys(blockCat).filter(k=>blockCat[k]);
    if (enableCat.length === 0) return false;
    const [blockWords] = await database.query("SELECT word FROM blocked_words WHERE category IN (?)",[enableCat]);
    const blockSet = new Set(blockWords.map(w=>w.word.toLowerCase()));
    const commentWords = comment.toLowerCase().split(/\W+/);
    const hadBockedWord = commentWords.some(word=>blockSet.has(word));
    if (hadBockedWord) return false;
    return true;
}

export const CommentAPI = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/,"") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    let {post_id,text,pID} = rkv.body;
    let commentID = nanoid();
    try {
        if (text.length<1 || text.length > 300) return rspo.status(400).send({err:"Invalid Comment Length"});
        if (post_id !== pID) return rspo.status(401).send({err:"Something went wrong"});
        let [rows] = await database.query("SELECT visibility, id, blockCat FROM posts WHERE post_id = ? AND canComment = 1 LIMIT 1",[post_id]);
        if (rows.length === 0 ) return rspo.status(401).send({err:"HeHeHeHeHeHeeeeeeeee......"});
        let {visibility,blockCat} = rows[0];
        
        const isComment = await validateComment(blockCat,text);
        if (!isComment) return rspo.status(422).send({err:"Contains Restricted Content"});
        if (!visibility && rows[0].id !== id) return rspo.status(401).send({err:"HeHeHeHeHeHeeeeeeeee......"});

        await database.query("INSERT INTO comments (commentID, post_id, id, comment) VALUES (?,?,?,?);",
            [commentID,post_id,id,text]
        )
        const [commentRows] = await database.query(`SELECT 
                        u.username,
                        u.avatar,
                        c.*,
                        COALESCE(cl.totalLike, 0) AS totalLike,
                        EXISTS (
                            SELECT 1
                            FROM commentLikes li
                            WHERE li.id = ?
                            AND li.commentID = c.commentID
                        ) AS isLiked
                    FROM comments c
                    INNER JOIN users u 
                        ON u.id = c.id
                    LEFT JOIN (
                        SELECT commentID, COUNT(*) AS totalLike
                        FROM commentLikes
                        GROUP BY commentID
                    ) cl 
                        ON cl.commentID = c.commentID
                    WHERE c.commentID = ?;`,[id,commentID]);
        const io = getIO();
        io.emit("newComment",commentRows[0]);
        rspo.status(200).send({pass:""});
    } catch (error) {
        console.log(error.message)
        rspo.status(500).send({err:"Server Side Error"});
    } finally {
        completeRequest(crntIP,crntAPI); 
    }
}
