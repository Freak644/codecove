import { database } from "../../../Controllers/myConnectionFile.js";
import redis from "../../../Controllers/src/config/redis.js";
import { completeRequest } from "../../../Controllers/src/middleware/progressTracker.js";

export const getComment = async (rkv, rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];

    const { id } = rkv.authData;
    const { post_id } = rkv.query;

    const QLimit = parseInt(rkv?.query?.Limit, 10);
    const limit = Number.isNaN(QLimit) ? 20 : QLimit;

    const cursorComment_sr = rkv.query.cursorComment_sr || null;

    try {

        /* =========================
           CHECK POST ACCESS
        ========================== */

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
                c.commentID,
                c.comment_sr,
                c.post_id,
                c.id,
                c.comment,
                c.totalLike,
                c.isAccepted,
                c.created_at,
                u.username,
                u.avatar,

                p.post_moment,

                (p.id = ?) AS isPostOwner,
                (cli.id IS NOT NULL) AS isLiked,
                (cr.id IS NOT NULL) AS isReported

            FROM comments c

            INNER JOIN users u
                ON u.id = c.id

            INNER JOIN posts p
                ON p.post_id = c.post_id

            LEFT JOIN commentLikes cli
                ON cli.commentID = c.commentID
                AND cli.id = ?

            LEFT JOIN commentReports cr
                ON cr.commentID = c.commentID
                AND cr.id = ?

            WHERE c.post_id = ?
            AND c.isBlocked = 0
            AND (? IS NULL OR c.comment_sr < ?)

            ORDER BY c.comment_sr DESC
            LIMIT ?
            `,
            [
                id,
                id,
                id,
                post_id,
                cursorComment_sr,
                cursorComment_sr,
                limit + 1
            ]
        );

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
            const key = `comment:likes:${row.commentID}`;

            pipeline.sCard(key);
            pipeline.sIsMember(key, id);
        });

        const results = await pipeline.exec();

        /* =========================
           MERGE REDIS DATA
        ========================== */

        let z = 0;

        commentrows = commentrows.map((comment) => {

            const totalLikeRedis = results[z++]?.[1];
            const isLikedRedis = results[z++]?.[1];

            return {
                ...comment,

                totalLike:
                    totalLikeRedis !== null &&
                    totalLikeRedis !== undefined
                        ? Number(totalLikeRedis)
                        : comment.totalLike,

                isLiked:
                    isLikedRedis !== null &&
                    isLikedRedis !== undefined
                        ? Boolean(isLikedRedis)
                        : Boolean(comment.isLiked)
            };
        });

        

        const cursorObj = commentrows.length ? {
                  cursorComment_sr:
                      commentrows[commentrows.length - 1].comment_sr
              }
            : null;

        rspo.status(200).send({
            pass: "Done",
            commentrows,
            hasMore,
            cursorObj
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