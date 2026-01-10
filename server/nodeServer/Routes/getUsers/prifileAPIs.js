import { database } from "../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../Controllers/progressTracker.js";

export const getUserinfo = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    let {username} = rkv.query;
    try {
        let [rows] = await database.query(`SELECT id, username, avatar, bio, follower_count, following_count, private_ac, 
            EXISTS (SELECT 1 FROM follows WHERE follower_id = ? AND following_id = u.id) AS isFollowing,
            EXISTS (SELECT 1 FROM follows WHERE follower_id = u.id AND following_id = ?) AS isFollowMe
            FROM users u WHERE u.username = ?`,[id,id,username]);
        if(rows.length !== 1) return rspo.status(404).send({err:"User not found"});
        let {private_ac,isFollowing} = rows[0];
        if (private_ac && !isFollowing) {
            delete rows[0].quote;
            rows[0].bio = "This profile is private!"
        }
        rspo.status(200).send({pass:"Got it", userInfo:rows[0]});
    } catch (error) {
        console.log(error.message)
        rspo.status(500).send({err:"Server side error"});
    }finally{
        completeRequest(crntIP,crntAPI);
    }
}