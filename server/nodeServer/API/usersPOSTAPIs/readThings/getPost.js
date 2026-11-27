import { database } from "../../../Controllers/myConnectionFile.js";
import redis from "../../../Controllers/src/config/redis.js";
import { completeRequest } from "../../../Controllers/src/middleware/progressTracker.js";
export const GetPostForFeed = async (rkv,rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    const Limit = parseInt(rkv?.query?.Limit, 10);
    const { user_id } = rkv.authData;

    let limit = Number.isNaN(Limit) ? 10 : Limit;
    limit = limit > 15 ? 15 : limit;
    
    const cursorPost_sr = rkv.query.cursorPost_sr || null;

    const currentUserId = user_id;               // the user_id of the user that is making the request
    const cursor         = cursorPost_sr;   // pagination cursor (may be null)
    const pageSize       = limit + 1; 

    try {
        // ------------------------------------------------
        // 3️⃣  Execute the query with the parameters in the same order
        // ------------------------------------------------
        let [rows] = await database.query(`SELECT
                p.post_id,
                p.post_sr,
                p.user_id,
                p.images_url,
                p.caption,
                p.visibility,
                p.totalLike,
                p.totalComment,
                p.totalDislike,
                p.totalSave,
                p.post_moment,
                p.canComment,
                p.likeCount,
                p.canSave,

                u.username,
                u.avatar,
                u.name AS ownerName,

          
                (f.follower_id IS NOT NULL)      AS isFollowing,
                (li.user_id IS NOT NULL)              AS isLiked,
                (sp.user_id IS NOT NULL)              AS isSaved,
                (pr.user_id IS NOT NULL)              AS isReported,
                (di.user_id IS NOT NULL)         AS isDisliked

            FROM posts AS p
            INNER JOIN users AS u
                ON u.user_id = p.user_id

           
            LEFT JOIN follows AS f
                ON f.following_id = u.user_id
            AND f.follower_id = ?

           
            LEFT JOIN likes AS li
                ON li.post_id = p.post_id
            AND li.user_id = ?

            
            LEFT JOIN dislikes AS di
                ON di.post_id = p.post_id
            AND di.user_id = ?

            
            LEFT JOIN savePost AS sp
                ON sp.post_id = p.post_id
            AND sp.user_id = ?

            
            LEFT JOIN postReports AS pr
                ON pr.post_id = p.post_id
            AND pr.user_id = ?

            WHERE p.visibility = "public"
            AND ( ? IS NULL OR p.post_sr < ? )   /* cursor pagination */

            ORDER BY p.post_sr DESC
            LIMIT ?;
            `, [
            currentUserId,   // f.follower_id = ?
            currentUserId,   // li.user_id    = ?
            currentUserId,   // di.user_id    = ?
            currentUserId,   // sp.user_id    = ?
            currentUserId,   // pr.user_id    = ?
            cursor,          // ? IS NULL
            cursor,          // p.post_sr < ?
            pageSize         // LIMIT ?
        ]);
        
        if (rows.length < 1) return rspo.status(404).send({err:"No posts",count:0});
        
        //  console.log(rows[0])
        
        let hasMore = rows.length > limit;
        rows = rows.slice(0,limit);
        
        const pipeline = redis.multi();

        rows.forEach(row => {
            const setKey = `post:likes:set:${row.post_id}`;
            const countKey = `post:likes:count:${row.post_id}`;

            pipeline.get(countKey);
            pipeline.sIsMember(setKey, user_id);
        });

        const results = await pipeline.exec();

        let i = 0;

        const hydratePipeline = redis.multi();
        let needHydration = false;

        rows = rows.map(row => {

            let redisLikeCount = results[i++];
            let redisIsLiked = results[i++];

            const setKey = `post:likes:set:${row.post_id}`;
            const countKey = `post:likes:count:${row.post_id}`;

            // CACHE MISS
            if (redisLikeCount === null) {

                needHydration = true;

                hydratePipeline.set(countKey, row.totalLike);

                if (row.isLiked) {
                    hydratePipeline.sAdd(setKey, user_id);
                }

                redisLikeCount = row.totalLike;
                redisIsLiked = row.isLiked;
            }

            return {
                ...row,
                totalLike: Number(redisLikeCount),
                isLiked: Boolean(redisIsLiked),
            };
        });

        if (needHydration) {
            await hydratePipeline.exec();
        }


        // rows = rows.map((row)=>{
        //     delete row.blockCat;
        //     // row.user_id = user_id;
        //     return row
        // });
        let cursorObj = {};
        // cursorObj.cursorAt = rows[rows.length - 1].created_at;
        cursorObj.cursorPost_sr = rows[rows.length - 1].post_sr;
        // rspo.set("Cache-Control", "public, max-age=60");
        rspo.status(200).send({pass:"Found",post:rows,hasMore,cursorObj})
    } catch (error) {
        console.log("jj",error.message)
        rspo.status(500).send({err:"Server side error"});
    } finally {
        completeRequest(crntIP,crntAPI)
    }
}

export const getPost = async (rkv, rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {user_id:crntUser} = rkv.authData;
    let {post_id} = rkv.query;
    try {
        if (!post_id || post_id.length !== 21) return rspo.status(400).send({err:"Link is Broken"});
        let [row] = await database.query(`SELECT p.post_id, p.post_sr, p.user_id, p.images_url, p.caption, p.visibility, p.totalComment, p.totalSave, p.post_moment, p.canComment, p.likeCount, p.canSave,
                        u.username, u.avatar,
                        u.name as ownerName,
                        EXISTS (
                        SELECT 1 FROM follows 
                        WHERE follower_id = ?
                        AND following_id = u.user_id) AS isFollowing FROM posts p
                        INNER JOIN users u ON u.user_id = p.user_id
                        WHERE post_id = ?`,[crntUser,post_id]);
        if (row.length !== 1) return rspo.status(400).send({err:"Something went wrong"});
        let {visibility, user_id} = row[0];
        if (!visibility && user_id !== crntUser) return rspo.status(401).send({err:"You did't have the access"});
        
        // console.log("i ma here");
        if (row[0].likeCount) {
            const setkey = `post:likes:set:${post_id}`;
            const countKey = `post:likes:count:${post_id}`;
            
            row[0].totalLike = await redis.get(countKey);
            row[0].isLiked = await redis.sIsMember(setkey,user_id);
        } else {
            row[0].totalLike = 0;
            row[0].totalComment = 0;
        }
 
        
        rspo.status(200).send({pass:row[0]})
    } catch (error) {
        // console.log(error.message);
        rspo.status(500).send({err:"Server side error"})
    } finally {
        completeRequest(crntIP,crntAPI);
    }
}