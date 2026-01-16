import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/progressTracker.js";

export const GetPosts = async (rkv,rspo) => {
    let {id} = rkv.authData;
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let limit = parseInt(rkv.query.limit) || 10;
    let offset = parseInt(rkv.query.offset) || 0
    if (limit>15) {
        limit=10;
    }
    console.log(limit,offset)
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
                ) AS isLiked
                FROM posts p
                INNER JOIN users u ON u.id = p.id
                WHERE p.visibility <> 0
                ORDER BY p.created_at DESC
                LIMIT ? OFFSET ?;
            `,
        [id,id,limit,offset]); // i like to write a query in a single row but this query  i have to write it like this because in a single row it too hard to find which thing came from where
        if (rows.length < 1) return rspo.status(404).send({err:"No posts",count:0});
        //  console.log(rows[0])
        rows = rows.map((row)=>{
            delete row.blockCat;
            // row.id = id;
            return row
        });

        rspo.status(201).send({pass:"Found",post:rows})
    } catch (error) {
        //console.log("jj",error.messge)
        rspo.status(500).send({err:"Server side error"})
    }finally{
        completeRequest(crntIP,crntAPI);
    }
}