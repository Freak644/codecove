import { clearConfig } from "isomorphic-dompurify";
import { database } from "../../../Controllers/myConnectionFile.js";
import redis from "../../../Controllers/src/config/redis.js";
import { completeRequest } from "../../../Controllers/src/middleware/progressTracker.js";
import { sendTokenRequest } from "arctic/dist/request.js";

export const getComment = async (rkv, rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];

    const { id } = rkv.authData;
    const { post_id } = rkv.query;

    const QLimit = parseInt(rkv?.query?.Limit, 10);
    const limit = Number.isNaN(QLimit) ? 20 : QLimit;

    const cursorComment_sr = rkv.query.cursorComment_sr || null;
    console.log(cursorComment_sr, limit)
    try {

        /* =========================
           CHECK POST ACCESS
        ========================== */
        if (post_id.length !== 21) {
            return rspo.status(401).send({err:"Your Like is broken"})
        }

        const [rows] = await database.query(
            `SELECT 
                canComment,
                visibility,
                id AS user_id
            FROM posts
            WHERE post_id = ?
            LIMIT 1`,
            [post_id]
        );

        if (rows.length !== 1) {
            return rspo.status(404).send({
                err: "Post not found"
            });
        }

        const {
            visibility,
            canComment,
            user_id
        } = rows[0];

        if ((!visibility || !canComment) && user_id !== id) {
            return rspo.status(401).send({
                err: "You don't have access",
                isComment: false
            });
        }

        /* =========================
           FETCH COMMENTS
        ========================== */

        let [commentrows] = await database.query(
            `
          SELECT
            c.*,

            u.username,
            u.avatar,
            u.name as ownerName,

            EXISTS(
                SELECT 1
                FROM commentLikes cli
                WHERE cli.commentID = c.commentID
                AND cli.id = ?
            ) AS isLiked,

            EXISTS(
                SELECT 1
                FROM commentReports cr
                WHERE cr.commentID = c.commentID
                AND cr.id = ?
            ) AS isReported

        FROM comments c

        INNER JOIN users u
        ON u.id = c.id

        LEFT JOIN posts p
        ON p.post_id = c.post_id

        WHERE c.post_id = ?
        AND c.isBlocked = 0
        AND (? IS NULL OR c.comment_sr < ?)

        ORDER BY c.comment_sr DESC
        LIMIT ?
            `,
            [
                id,
                id,
                post_id,
                cursorComment_sr,
                cursorComment_sr,
                limit + 1
            ]
        );

        let postInfo;
        if (!cursorComment_sr) {
            
            const [userRow] = await database.query(`SELECT 
                p.post_moment, u.username AS Ouser, u.avatar AS Oavatar,
                u.name as ownerName,
                (p.id = ?) AS isPostOwner,
                
                EXISTS(
                    SELECT 1
                    FROM follows f
                    WHERE f.following_id = u.id AND f.follower_id = ?
                ) AS isFollowing,
    
                EXISTS(
                    SELECT 1
                    FROM savePost sp
                    WHERE sp.post_id = p.post_id AND sp.id = ?
                ) AS isSaved,

                EXISTS(
                    SELECT 1
                    FROM dislikes dl
                    WHERE dl.user_id = ? AND dl.post_id = p.post_id
                ) AS isDisliked
                 
                FROM posts p
                
                INNER JOIN users u
                ON u.id = p.id
                WHERE p.post_id = ?`,[id,id,id,id,post_id]);

            postInfo = userRow;
        }
         
        /* =========================
           PAGINATION
        ========================== */

        const hasMore = commentrows.length > limit;

        commentrows = commentrows.slice(0, limit);

        /* =========================
           REDIS PIPELINE
        ========================== */

        const pipeline = redis.multi();

        commentrows.forEach((row) => {
            const commentSet = `post:commentLike:set:${row.commentID}`
            const cLikeCount = `post:commentLike:like:${row.commentID}`
            
            pipeline.get(cLikeCount);
            pipeline.sIsMember(commentSet, id);
        });

        const results = await pipeline.exec();

        /* =========================
           Floating Data
        ========================== */

        let z = 0;
        const hydratePipeline = redis.multi();
        let needHydration = false;

        commentrows = commentrows.map((comment) => {

            let totalLikeRedis = results[z++];
            let isLikedRedis = results[z++];

            const commentSet = `post:commentLike:set:${comment.commentID}`
            const cLikeCount = `post:commentLike:like:${comment.commentID}`
            if (totalLikeRedis === null) {
               needHydration = true;
               hydratePipeline.set(cLikeCount,comment.totalLike);
               if (comment.isLiked) {
                    hydratePipeline.sAdd(commentSet,id) ;
               }
               isLikedRedis = comment.isLiked;
               totalLikeRedis = comment.totalLike;
            }

            return {
                ...comment,
                totalLike: Number(totalLikeRedis),
                isLiked: Boolean(isLikedRedis)
            };
        });
        if (needHydration) {
            await hydratePipeline.exec();
        }

        const cursorObj = commentrows.length ? {
                  cursorComment_sr:
                      commentrows[commentrows.length - 1].comment_sr
              }
            : null;

        rspo.status(200).send({
            pass: "Done",
            commentrows,
            hasMore,
            cursorObj,
            OwnerInfo: postInfo,
        });

    } catch (error) {

        console.log("COMMENT FETCH ERROR:", error.message);

        rspo.status(500).send({
            err: "Server Side Error"
        });

    } finally {

        completeRequest(crntIP, crntAPI);

    }
};