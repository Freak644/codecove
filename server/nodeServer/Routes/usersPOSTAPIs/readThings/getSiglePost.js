import { database } from "../../../Controllers/myConnectionFile.js";

export const getPost = async (rkv, rspo) => {
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
    }
}