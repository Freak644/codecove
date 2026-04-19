import { database } from "../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../Controllers/src/middleware/progressTracker.js";

export const findUsers = async (rkv, rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {username} = rkv.query;

    try {
        if (!username || username.length<4) return rspo.status(403).send({err:"Username is too short"});
        if (!/^[a-z0-9_]+$/.test(username)) return rspo.status(400).json({err:"Username can only contain lowercase letters, numbers, and underscore (_)"});
        //const [similerUser] = await database.query(`SELECT username, avatar, follower_count, following_count, bio FROM users WHERE username LIKE ? OR SOUNDEX(username) = SOUNDEX(?) LIMIT 20`,[`${username}%`, username]);
        const [tempDataRow] = await database.query("SELECT username, avatar, follower_count, following_count, bio FROM users");
        rspo.json({pass:"Ok",userData:tempDataRow})
    } catch (error) {
        console.log(error.message)
        rspo.status(500).send({err:"Server side error"});   
    } finally {
        completeRequest(crntIP,crntAPI);
    }
}