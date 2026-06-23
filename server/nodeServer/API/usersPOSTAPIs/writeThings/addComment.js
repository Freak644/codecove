import { database } from "../../../Controllers/myConnectionFile.js";
import {nanoid} from 'nanoid';
import { getIO } from "../../../myServer.js";
import { completeRequest } from "../../../Controllers/src/middleware/progressTracker.js";
import { moderateContent } from "../../../Controllers/src/services/moderateContent.js";
import { warn } from "console";


export const CommentAPI = async (rkv,rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    let {text,pID:post_id} = rkv.body || {};
    let commentID = nanoid();
    try {
        if (!text || !post_id || !text.trim() || !post_id.trim()) return rspo.status(400).send({err:"Something went Wrong"});
        if (text.length<1 || text.length > 400) return rspo.status(400).send({err:"Invalid Comment Length"});
        let [rows] = await database.query("SELECT visibility, id, blockCat FROM posts WHERE post_id = ? AND canComment = 1 LIMIT 1",[post_id]);
        if (rows.length === 0 ) return rspo.status(401).send({err:"The Link is broken"});
        let {visibility,blockCat} = rows[0];
        
        if (!visibility && rows[0].id !== id) return rspo.status(401).send({err:"This post is now private"});
        
        const isComment = moderateContent(text);

        let {warn, reject, safeString, matches} = isComment;
        
        if (reject) {
            return rspo.status(422).send({err:`Contains Restricted ${matches[0].category} Content`});
        }

        // console.log(safeString, matches);

        await database.query("INSERT INTO comments (commentID, post_id, id, comment, warnCategory) VALUES (?,?,?,?,?);",
            [commentID,post_id,id,safeString, matches[0]?.category || null]
        )
        await database.query("UPDATE posts SET totalComment = totalComment + 1 WHERE post_id = ?",[post_id])
        const io = getIO();
        const [commentRows] = await database.query(`SELECT 
                        u.username,
                        u.avatar,
                        c.*,
                        EXISTS (
                            SELECT 1
                            FROM commentLikes li
                            WHERE li.id = ?
                            AND li.commentID = c.commentID
                        ) AS isLiked
                    FROM comments c
                    INNER JOIN users u 
                        ON u.id = c.id
                    WHERE c.commentID = ?;`,[id,commentID]);
        io.emit("newComment",commentRows[0]);
        rspo.status(200).send({pass:""});
    } catch (error) {
        console.log(error.message)
        rspo.status(500).send({err:"Server Side Error"});
    } finally {
        completeRequest(crntIP,crntAPI)
    }
}
