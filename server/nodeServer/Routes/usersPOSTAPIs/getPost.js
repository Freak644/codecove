import { database } from "../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../Controllers/progressTracker.js";

export const GetPosts = async (rkv,rspo) => {
    let {id} = rkv.authData;
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let limit = parseInt(rkv.query.limit) || 10;
    let offset = parseInt(rkv.query.offset) || 0
    if (limit>15) {
        limit=10;
    }
    try {
        let [rows] = await database.query("SELECT  u.username, u.avatar, p.*, COUNT(l.like_id) AS totalLike, EXISTS(SELECT 1 FROM likes li WHERE li.id = ? AND li.post_id = p.post_id) AS isLiked FROM posts p INNER JOIN users u ON u.id = p.id LEFT JOIN likes l ON l.post_id = p.post_id WHERE p.visibility <> 0 GROUP BY p.post_id ORDER BY p.created_at DESC LIMIT ? OFFSET ?; ",
        [id,limit,offset])
        if (rows.length === 0) {
            return rspo.status(404).send({err:"No posts"})
        }
        // console.log(rows[0])
        rows = rows.map((row)=>{
            delete row.blockCat;
            // row.id = id;
            return row
        })

        rspo.status(201).send({pass:"Found",post:rows})
    } catch (error) {
        rspo.status(500).send({err:error.message})
    }finally{
        completeRequest(crntIP,crntAPI);
    }
}