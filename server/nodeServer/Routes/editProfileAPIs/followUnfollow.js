import { database } from "../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../Controllers/progressTracker.js";
import {getIO} from '../../myServer.js'
export const followAPI = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/,"") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {user_id} = rkv.body;
    let {id} = rkv.authData;
    try {
        if (user_id === id) return rspo.status(401).send({err:"U can't follow your self"});
        let [userRows] = await database.query("SELECT EXISTS ( SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?) AS isFollow",[id,user_id]);
        let {isFollow} = userRows[0];
        const io = getIO();
        if (isFollow) {
            await database.query("DELETE FROM follows WHERE follower_id = ? AND following_id = ?",[id,user_id]);
            await database.query("UPDATE users SET follower_count = follower_count - 1 WHERE id = ?",[user_id]);
            await database.query("UPDATE users SET following_count = following_count - 1 WHERE id = ?",[id]);
            io.emit("fnf",{user_id,viewer_id:id,isFollow:false});
        } else {
            await database.query("INSERT INTO follows ( follower_id, following_id) VALUES (?,?)",[id,user_id]);
            await database.query("UPDATE users SET follower_count = follower_count + 1 WHERE id = ?",[user_id]);
            await database.query("UPDATE users SET following_count = following_count + 1 WHERE id = ?",[id]);
            io.emit("fnf",{user_id,viewer_id:id,isFollow:true});
        }
        rspo.status(200).send({pass:"Done!"})
    } catch (error) {
        console.log(error.message)
        rspo.status(500).send({err:"Server side error"});
    } finally {
        completeRequest(crntIP,crntAPI);
    }
}