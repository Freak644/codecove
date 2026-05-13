import { database } from "../../../Controllers/myConnectionFile.js";
import redis from "../../../Controllers/src/config/redis.js";
import { completeRequest } from "../../../Controllers/src/middleware/progressTracker.js";
import { commentLikeQue, likeQueue } from "../../../Controllers/src/queue/myQue.js";

export const starPost = async (rkv,rspo) => {
   const crntIP = rkv.userIp;
   const crntAPI = rkv.originalUrl.split("?")[0];
   let {id} = rkv.authData;
   let {post_id} = rkv.body;

   try {
    if (!post_id || !post_id.trim()) return rspo.status(401).send({err:"Missing post id"});
    
    //Check Visibility and post ex;
    let [row] = await database.query("SELECT visibility FROM posts WHERE post_id = ?",[post_id]);
    if (row.length === 0 || !row[0].visibility) {
        return rspo.status(422).send({err:" Private Post"});
    }

    //Redis Toggle
    const setKey = `post:likes:set:${post_id}`;
    const countKey = `post:likes:count:${post_id}`;
    // checking isLikeForm Redis History 
    const isLiked = await redis.sIsMember(setKey,id);
    let crntStatus;


    if (isLiked) {
        await redis.sRem(setKey,id);
        await redis.decr(countKey);
        crntStatus = false;
    } else {
        await redis.sAdd(setKey,id);
        await redis.incr(countKey);
        crntStatus = true;
    }


 
   
    await likeQueue.add("like-job",{
        post_id,
        user_id: id,
        crntStatus
    },{
        removeOnComplete: 100, // keep last 100
        removeOnFail: 50
    })    

    rspo.json({pass:"Ok"})
   } catch (error) {
    console.log(error.message)
    rspo.status(500).send({err:"Server Side error"})
   } finally {
    completeRequest(crntIP, crntAPI);
   }
}

export const likeComment = async (rkv,rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    let {commentID,post_id} = rkv.body;
    try {
        if (!post_id || !commentID || !post_id.trim() || !commentID.trim() || post_id.length !== 21) return rspo.status(401).send({err:"Something went wrong"});
        let [rows] = await database.query("SELECT visibility FROM posts WHERE post_id = ?",[post_id]);
        if (!rows[0].visibility) return rspo.status(422).send({err:"The post is private"});
        
        //creating redis Keys
        const commentSet = `post:commentLike:set:${commentID}`
        const cLikeCount = `post:commentLike:like:${commentID}`
        
        const isLiked = await redis.sIsMember(commentID,id);
        let crntStatus;

        if (isLiked) {
            await redis.sRem(commentID,id);
            await redis.decr(cLikeCount);
            crntStatus = false
        } else {
            await redis.sAdd(commentID, id);
            await redis.incr(cLikeCount);
            crntStatus = true;
        }
        
        await commentLikeQue.add("commentLike-job",{
            commentID,
            post_id,
            user_id: id,
            crntStatus
        },{
            removeOnComplete: 100,
            removeOnFail: 50
        })
        
        
        // let [row] = await database.query("SELECT commentID FROM commentLikes WHERE commentID = ? AND id = ?",[commentID,id]);
        // if (row.length === 0) {
        //     await database.query("INSERT INTO commentLikes (commentID, post_id, id) VALUES (?,?,?)",[commentID,post_id,id]);
        //     await database.query("UPDATE comments SET totalLike = totalLike + 1 WHERE commentID = ?",[commentID]);

        // } else {
        //     await database.query("DELETE FROM commentLikes WHERE commentID = ? AND post_id = ? AND id = ?",[commentID,post_id,id]);
        //     await database.query("UPDATE comments SET totalLike = totalLike - 1 WHERE commentID = ?",[commentID]);
          
        // }
        rspo.status(200).send({test:"done"});
    } catch (error) {
        console.log(error.message)
        rspo.status(500).send({err:"Server side error"});
    } finally {
        completeRequest(crntIP,crntAPI)
    }
}

export const savePost = async (rkv,rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    let {pst_id: post_id} = rkv.body;
    try {
        if (!post_id || post_id.length !== 21) return rspo.status(401).send("Validation Error");
        let [rows] = await database.query("SELECT p.id, p.canSave, p.visibility, EXISTS (SELECT 1 FROM follows WHERE follower_id = ? AND following_id = p.id) AS isFollowing, EXISTS (SELECT 1 FROM savePost WHERE id = ? AND post_id = p.post_id) AS isSaved FROM posts p WHERE p.post_id = ?",[id, id, post_id])
        if (rows.length !== 1) return rspo.status(401).send({err:"Wrong Post id"});
        let {isFollowing,visibility,canSave, id: user_id, isSaved} = rows[0];
        if (!visibility && user_id !== id) return rspo.status(403).send({err:"This post is now private"});
        if (!canSave) return rspo.status(401).send({err:"This can't be saved"});
        if (canSave === "Follower") {
            if (!isFollowing && user_id !== id) {
                return rspo.status(401).send({err:"Saving is available only for followers "})
            }
        }
        if (!isSaved) {
            await database.query("INSERT INTO savePost (id, post_id) VALUE(?,?);",[id,post_id]);
            await database.query("UPDATE posts SET totalSave = totalSave + 1 WHERE post_id = ?",[post_id]);
        } else {
            await database.query("DELETE FROM savePost WHERE id = ? AND post_id = ?",[id,post_id]);
            await database.query("UPDATE posts SET totalSave = totalSave - 1 WHERE post_id = ?",[post_id]);
        }
        
        rspo.json({pass:"Ok"})
    } catch (error) {
         console.log(error.message)
        rspo.status(500).send({err:"Server side error"});
    } finally {
        completeRequest(crntIP,crntAPI);
    }
}