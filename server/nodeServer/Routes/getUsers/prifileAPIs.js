import { database } from "../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../Controllers/progressTracker.js";

export const getUserinfo = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {username} = rkv.query;
    try {
        let [rows] = await database.query('SELECT id, username, avatar, bio, quote, follower_count, following_count, private_ac FROM users WHERE username=?',[username]);
        if(rows.length !== 1) return rspo.status(404).send({err:"User not found"});
        rspo.status(200).send({pass:"Got it", userInfo:rows[0]});
    } catch (error) {
        console.log(error.message)
        rspo.status(500).send({err:"Server side error"});
    }finally{
        completeRequest(crntIP,crntAPI);
    }
}