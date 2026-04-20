import { database } from "../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../Controllers/src/middleware/progressTracker.js";

export const findUsers = async (rkv, rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {username} = rkv.query;
    let {id} = rkv.authData;
    console.log(id)
    try {
        if (!username || username.length<4) return rspo.status(403).send({err:"Username is too short"});
        if (!/^[a-z0-9_]+$/.test(username)) return rspo.status(400).json({err:"Username can only contain lowercase letters, numbers, and underscore (_)"});
        await database.query(`SELECT username, avatar, follower_count, following_count, bio FROM users `,[`${username}%`, username]);
        const [similerUser] = await database.query(`SELECT u.username, u.avatar, u.follower_count, u.following_count, u.bio,
            EXISTS (
                SELECT 1 FROM follows
                WHERE follower_id = ?
                AND following_id = u.id
            ) AS isFollowing FROM users u WHERE u.username LIKE ? OR SOUNDEX(username) = SOUNDEX(?) LIMIT 20`,[id,`${username}%`, username]);
        rspo.json({pass:"Ok",userData:similerUser})
    } catch (error) {
        console.log(error.message)
        rspo.status(500).send({err:"Server side error"});   
    } finally {
        completeRequest(crntIP,crntAPI);
    }
}