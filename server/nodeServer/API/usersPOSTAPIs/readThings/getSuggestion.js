// import { database } from "../../../Controllers/myConnectionFile.js";
// import { completeRequest } from "../../../Controllers/src/middleware/progressTracker.js";

// export const fetchSuggestionv = async (rkv, rspo) => {
//     const crntIp = rkv.userIp;
//     const crntAPI = rkv.originalUrl.split("?")[0];
//     const Limit = 15;
//     const { id } = rkv.authData;

//     const moment = rkv.query.moment;

//     try {
//         if (moment)
//         let [rows] = await database.query(`SELECT 
//             p.post_id, p.post_sr, p.id, p.images_url, p.caption, p.visibility, p.totalLike, p.totalComment, p.totalSave, p.post_moment, p.canComment, p.likeCount, p.canSave
//             u.username, u.avatar,
//             (f.follower_id IS NOT NULL) AS isFollowing,
//             (li.id IS NOT NULL) AS isLiked,
//             (sp.id IS NOT NULL) AS isSaved,
//             (pr.id IS NOT NULL) AS isReported
            
//             FROM posts p
//             INNER JOIN users u ON u.id = p.id
            
//             LEFT JOIN follows f ON f.following_id = u.id AND f.follower_id = ?
//             LEFT JOIN likes li ON li.post_id = p.post_id AND li.id = ?
//             LEFT JOIN savePost sp
//             ON sp.post_id = p.post_id AND sp.id = ?
            
//             LEFT JOIN postReports pr
//             ON pr.post_id = p.post_id AND pr.id = ?
            
//             WHERE p.visibility = 1
//             AND p.post_moment = ?`,[id, id,id, id, moment]);
//     } catch (error) {
//         rspo.status(500).send({err:"Server side error"})
//     } finally {
//         completeRequest(crntIp, crntAPI);
//     }
// }