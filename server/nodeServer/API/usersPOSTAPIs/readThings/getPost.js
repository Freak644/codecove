import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/src/middleware/progressTracker.js";

export const GetPosts = async (rkv,rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    const limit = 10
    const cursorAt = rkv.query.cursorAt || null;
    const cursorPost_id = rkv.query.cursorPost_id || null;

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
                                AND post_id = p.post_id
                            ) AS isSaved,

                            EXISTS (
                                SELECT 1
                                FROM postReports
                                WHERE post_id = p.post_id 
                                AND id = ?
                            ) AS isReported

                        FROM posts p
                        INNER JOIN users u ON u.id = p.id

                        WHERE p.visibility = 1
                        AND (
                            (? IS NULL AND ? IS NULL)
                            OR (
                                p.created_at < ?
                                OR (p.created_at = ? AND p.post_id < ?)
                            )
                        )
                        ORDER BY p.created_at DESC, p.post_id DESC
                        LIMIT 11;
            `,
        [ id, id, id, id,
          cursorAt, cursorPost_id,
          cursorAt, cursorAt, cursorPost_id
            ]) // what the hake from today(19-02-26) i will wirte my all query in column format
        if (rows.length < 1) return rspo.status(404).send({err:"No posts",count:0});
        //  console.log(rows[0])
        let hasMore = rows.length > limit;
        rows = rows.slice(0,limit);
        rows = rows.map((row)=>{
            delete row.blockCat;
            // row.id = id;
            return row
        });
        let cursorObj = {};
        cursorObj.cursorAt = rows[rows.length - 1].created_at;
        cursorObj.cursorPost_id = rows[rows.length - 1].post_id;

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
        let [row] = await database.query(`SELECT p.*, u.username, u.avatar,
                        EXISTS (
                        SELECT 1 FROM follows 
                        WHERE follower_id = ?
                        AND following_id = u.id) AS isFollowing,
                        EXISTS (
                        SELECT 1 FROM likes li
                        WHERE li.id = ?
                        AND li.post_id = p.post_id) AS isLiked FROM posts p
                        INNER JOIN users u ON u.id = p.id
                        WHERE post_id = ?`,[id,id,post_id]);
        if (row.length !== 1) return rspo.status(400).send({err:"Something went wrong"});
        let {visibility, user_id} = row[0];
        if (!visibility && id !== user_id) return rspo.status(401).send({err:"You did't have the access"});

        rspo.status(200).send({pass:row[0]})
    } catch (error) {
        rspo.status(500).send({err:"Server side error"})
    } finally {
        completeRequest(crntIP,crntAPI)
    }
}