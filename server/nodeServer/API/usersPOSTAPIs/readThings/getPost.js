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
                                    p.post_id, p.post_sr, p.id, p.images_url, p.caption, p.visibility, p.totalLike, p.totalComment, p.totalDislike, p.totalSave, p.post_moment, p.canComment, p.likeCount, p.canSave,
                                    u.username,
                                    u.avatar,

                                    (f.follower_id IS NOT NULL) AS isFollowing,
                                    (li.id IS NOT NULL) AS isLiked,
                                    (sp.id IS NOT NULL) AS isSaved,
                                    (pr.id IS NOT NULL) AS isReported,
                                    (di.user_id IS NOT NULL) AS isDisliked
                                    FROM posts p

                                    INNER JOIN users u  
                                    ON u.id = p.id

                                    LEFT JOIN follows f
                                    ON f.following_id = u.id AND f.follower_id = ?

                                    LEFT JOIN likes li
                                    ON li.post_id = p.post_id AND li.id = ?

                                    LEFT JOIN dislikes di
                                    ON di.post_id = p.post_id AND di.user_id = ?

                                    LEFT JOIN savePost sp
                                    ON sp.post_id = p.post_id AND sp.id = ?

                                    LEFT JOIN postReports pr
                                    ON pr.post_id = p.post_id AND pr.id = ?

                                    WHERE p.visibility = 1
                                    AND (? IS NULL OR p.post_sr < ?)

                                    ORDER BY p.post_sr DESC
                                    LIMIT ?;
            `,
        [ id, id, id, id, id, cursorPost_sr, cursorPost_sr,limit + 1]) // what the hake from today(19-02-26) i will wirte my all query in column format
        
        if (rows.length < 1) return rspo.status(404).send({err:"No posts",count:0});
        
        //  console.log(rows[0])
        
        let hasMore = rows.length > limit;
        rows = rows.slice(0,limit);
        
        const pipeline = redis.multi();
        
        rows.forEach(row => {
            const setKey = `post:likes:set:${row.post_id}`;
            const countKey = `post:likes:count:${row.post_id}`;
            pipeline.get(countKey)
            
            pipeline.sIsMember(setKey, id);
        });
        
        const results = await pipeline.exec();
        let i = 0;

        const hydratePipeline = redis.multi();
        let needHydration = false;
        rows = rows.map(row => {
           
            let redisLikeCount = results[i++];
            // console.log("here")
            let RedisIsLiked = results[i++];

            const setKey = `post:likes:set:${row.post_id}`;
            const countKey = `post:likes:count:${row.post_id}`;
            // console.log(redisLikeCount, RedisIsLiked)
            if (redisLikeCount === null) {
                needHydration = true;
                hydratePipeline.set(countKey,row.totalLike);
                hydratePipeline.sAdd(setKey, id);
                RedisIsLiked = row.isLiked;
            }
            if (row.likeCount) {
                return {
                    ...row,
                    totalLike: Number(redisLikeCount ?? row.totalLike),
                    isLiked: Boolean(RedisIsLiked)
                };
            } else {
                return {
                    ...row,
                    totalLike: 0,
                    totalComment: 0,
                    isLiked: Boolean(RedisIsLiked)
                };
            }
        });
        if (needHydration) {
            await hydratePipeline.exec();
        }


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
        let [row] = await database.query(`SELECT p.post_id, p.post_sr, p.id, p.images_url, p.caption, p.visibility, p.totalComment, p.totalSave, p.post_moment, p.canComment, p.likeCount, p.canSave,
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
        
        const setkey = `post:likes:set:${post_id}`;
        const countKey = `post:likes:count:${post_id}`;
        
        row[0].totalLike = await redis.get(countKey);
        row[0].isLiked = await redis.sIsMember(setkey);

        
        
        
        rspo.status(200).send({pass:row[0]})
    } catch (error) {
        rspo.status(500).send({err:"Server side error"})
    } finally {
        completeRequest(crntIP,crntAPI);
    }
}

