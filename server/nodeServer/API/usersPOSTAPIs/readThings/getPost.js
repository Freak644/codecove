import { database } from "../../../Controllers/myConnectionFile.js";
import redis from "../../../Controllers/src/config/redis.js";
import { completeRequest } from "../../../Controllers/src/middleware/progressTracker.js";
export const GetPostForFeed = async (rkv,rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    const Limit = parseInt(rkv?.query?.Limit, 10);
    const { id } = rkv.authData;

    let limit = Number.isNaN(Limit) ? 10 : Limit;
    limit = limit > 15 ? 15 : limit;
    
    const cursorPost_sr = rkv.query.cursorPost_sr || null;

    try {
        let [rows] = await database.query(`SELECT 
                                    p.post_id, p.post_sr, p.id, p.images_url, p.caption, p.visibility, p.totalLike, p.totalComment, p.totalSave, p.post_moment, p.canComment, p.likeCount, p.canSave,
                                    u.username,
                                    u.avatar,

                                    (f.follower_id IS NOT NULL) AS isFollowing,
                                    (li.id IS NOT NULL) AS isLiked,
                                    (sp.id IS NOT NULL) AS isSaved,
                                    (pr.id IS NOT NULL) AS isReported

                                    FROM posts p

                                    INNER JOIN users u  
                                    ON u.id = p.id

                                    LEFT JOIN follows f
                                    ON f.following_id = u.id AND f.follower_id = ?

                                    LEFT JOIN likes li
                                    ON li.post_id = p.post_id AND li.id = ?

                                    LEFT JOIN savePost sp
                                    ON sp.post_id = p.post_id AND sp.id = ?

                                    LEFT JOIN postReports pr
                                    ON pr.post_id = p.post_id AND pr.id = ?

                                    WHERE p.visibility = 1
                                    AND (? IS NULL OR p.post_sr < ?)

                                    ORDER BY p.post_sr DESC
                                    LIMIT ?;
            `,
        [ id, id, id, id, cursorPost_sr, cursorPost_sr,limit + 1]) // what the hake from today(19-02-26) i will wirte my all query in column format
        
        if (rows.length < 1) return rspo.status(404).send({err:"No posts",count:0});
        
        //  console.log(rows[0])
        
        let hasMore = rows.length > limit;
        rows = rows.slice(0,limit);

        const pipeline = redis.multi();

        rows.forEach(row => {
            const key = `post:likes:${row.post_id}`;
            pipeline.sCard(key);
          
            pipeline.sIsMember(key, id);
        });

        const results = await pipeline.exec();
        let i = 0;

        rows = rows.map(row => {
            const totalLike = results[i++][1];
            const isLiked = results[i++][1];
            const hasRedisData = totalLike > 0 || isLiked === 1;
            return {
                ...row,
                totalLike: totalLike > 0 ? totalLike : row.totalLike,
                isLiked: hasRedisData ? Boolean(isLiked) : row.isLiked
            };
        });

        // rows = rows.map((row)=>{
        //     delete row.blockCat;
        //     // row.id = id;
        //     return row
        // });
        let cursorObj = {};
        // cursorObj.cursorAt = rows[rows.length - 1].created_at;
        cursorObj.cursorPost_sr = rows[rows.length - 1].post_sr;
        // rspo.set("Cache-Control", "public, max-age=60");
        rspo.status(200).send({pass:"Found",post:rows,hasMore,cursorObj})
    } catch (error) {
        console.log("jj",error.message)
        rspo.status(500).send({err:"Server side error"})
    } finally {
        completeRequest(crntIP,crntAPI)
    }
}

export const getPost = async (rkv, rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    let {post_id} = rkv.query;
    try {
        if (!post_id || post_id.length !== 21) return rspo.status(400).send({err:"Link is Broken"});
        let [row] = await database.query(`SELECT p.post_id, p.post_sr, p.id, p.images_url, p.caption, p.visibility, p.totalLike, p.totalComment, p.totalSave, p.post_moment, p.canComment, p.likeCount, p.canSave,
                        u.username, u.avatar,
                        EXISTS (
                        SELECT 1 FROM follows 
                        WHERE follower_id = ?
                        AND following_id = u.id) AS isFollowing FROM posts p
                        INNER JOIN users u ON u.id = p.id
                        WHERE post_id = ?`,[id,post_id]);
        if (row.length !== 1) return rspo.status(400).send({err:"Something went wrong"});
        let {visibility, user_id} = row[0];
        if (!visibility && id !== user_id) return rspo.status(401).send({err:"You did't have the access"});
        const redisKey = `post:likes:${post_id}`;

        let totalLikes = await redis.sCard(redisKey);
        if (totalLikes === 0) {
            totalLikes = row[0].totalLike;
        }

        const isLiked = await redis.sIsMember(redisKey, id);

        row[0].totalLike = totalLikes;
        row[0].isLiked = Boolean(isLiked);
        
        rspo.status(200).send({pass:row[0]})
    } catch (error) {
        rspo.status(500).send({err:"Server side error"})
    } finally {
        completeRequest(crntIP,crntAPI)
    }
}