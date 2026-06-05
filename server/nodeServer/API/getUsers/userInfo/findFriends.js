import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/src/middleware/progressTracker.js";

export const FindFriends = async (rkv, rspo) => {
    const crntIp = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;

    try {
        let [rows] = await database.query(`SELECT u.id as user_id, u.username, u.avatar, u.follower_count, u.following_count, u.bio,
            EXISTS (
                SELECT 1 FROM follows
                WHERE follower_id = ?
                AND following_id = u.id
            ) AS isFollowing FROM users u WHERE u.id != ?
                ORDER BY RAND() LIMIT 20`,[id, id]);
            
            if (0 === rows.length) {
                return rspo.status(404).send({err:"No users found"});
            }

             rspo.status(200).send({usersRow:rows});
    } catch (error) {
        rspo.status(500).send({err:"Server side error"});
    } finally {
        completeRequest(crntIp, crntAPI);
    }
}