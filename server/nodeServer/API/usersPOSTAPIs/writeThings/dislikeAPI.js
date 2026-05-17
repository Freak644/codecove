import { Connection } from "mysql2";
import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/src/middleware/progressTracker.js";
import redis from "../../../Controllers/src/config/redis.js";
import { likeComment } from "./likePost.js";
import { likeQueue } from "../../../Controllers/src/queue/myQue.js";

export const disLike = async (rkv, rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    let {post_id} = rkv.body;

    try {
        if (!post_id || !post_id.trim()) return rspo.status(401).send({err:"Missing post id"});

        let [row] = await database.query(`SELECT p.visibility, 
                (dl.user_id IS NOT NULL) AS isDisliked
                FROM posts p
                LEFT JOIN dislikes dl
                ON dl.user_id = ? AND dl.post_id = ?
                WHERE p.post_id = ?`,[id,post_id,post_id]);
        let {visibility, isDisliked} = row;
        if (visibility) return rspo.status(401).send({err:"This Post is Private"});
        const setKey = `post:likes:set:${post_id}`;
        const countKey = `post:likes:count:${post_id}`
        const isLiked = await redis.sIsMember(setKey,id);
        
        if (isLiked) {
            await redis.sRem(setKey,id);
            await redis.decr(countKey);
            await likeQueue.add("like-job",{
                post_id,
                user_id: id,
                crntStatus:false
            }, {
                removeOnComplete: 100,
                removeOnFail:50
            })
            await database.query("INSERT INTO dislikes (user_id, post_id) VALUE(?, ?);",[id,post_id]);
            await database.query("UPDATE posts SET totalDislike = totalDislike + 1 WHERE post_id = ?",[post_id]);
        } else if (!isDisliked) {
            await database.query("INSERT INTO dislikes (user_id, post_id) VALUE(?, ?);",[id,post_id]);
            await database.query("UPDATE posts SET totalDislike = totalDislike + 1 WHERE post_id = ?",[post_id]);
        } else if (isDisliked) {
            await database.query("DELETE FROM dislikes WHERE user_id = ? AND post_id = ?",[id,post_id]);
            await database.query("UPDATE posts SET totalDislike = GREATEST(totalDislike - 1,0) WHERE post_id = ?",[post_id]);
        }
         else {
            return rspo.status(504).send({err:"Something went wrong"});
        }


        rspo.json({pass:""});
    } catch (error) {
        console.log(error.message);
       rspo.status(500).send({err:"Server side error"}); 
    }finally {
        completeRequest(crntIP, crntAPI);
    }
}