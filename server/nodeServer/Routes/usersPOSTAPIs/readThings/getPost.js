import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/progressTracker.js";

export const GetPosts = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    let limit = 10;
    let offset = parseInt(rkv.query.offset) || 0
    if (limit>15) {
        limit=10;
    }

    try {
        let [rows] = await database.query(`SELECT 
                p.*,
                u.username,
                u.avatar,
                 EXISTS (
                    SELECT 1
                    FROM follows
                    WHERE follower_id = ?
                    AND following_id = u.id
                 ) AS isFollowing,
                EXISTS (
                    SELECT 1
                    FROM likes li
                    WHERE li.id = ?
                    AND li.post_id = p.post_id
                ) AS isLiked,
                EXISTS (
                    SELECT 1 
                    FROM savePost
                    WHERE id = ? 
                    AND p.post_id = post_id
                ) AS isSaved
                FROM posts p
                INNER JOIN users u ON u.id = p.id
                WHERE p.visibility <> 0
                ORDER BY p.created_at DESC
                LIMIT 11 OFFSET ?;
            `,
        [id,id,id,offset]); // what the hake from today(19-02-26) i will wirte my all query in column format
        if (rows.length < 1) return rspo.status(404).send({err:"No posts",count:0});
        //  console.log(rows[0])
        let hasMore = rows.length > limit;
        rows = rows.slice(0,limit);
        rows = rows.map((row)=>{
            delete row.blockCat;
            // row.id = id;
            return row
        });

        rspo.status(200).send({pass:"Found",post:rows,hasMore})
    } catch (error) {
       // console.log("jj",error.messge)
        rspo.status(500).send({err:"Server side error"})
    } finally {
        completeRequest(crntIP,crntAPI)
    }
}