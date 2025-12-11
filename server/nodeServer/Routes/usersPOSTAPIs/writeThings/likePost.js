import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/progressTracker.js";
import { getIO } from "../../../myServer.js";

export const starPost = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/,"") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    let {post_id} = rkv.body;

    try {
        let io = getIO();
        let [rows] = await database.query("SELECT post_id FROM likes WHERE post_id = ? AND id = ?",[post_id,id]);
        if (rows.length === 0) {
            await database.query("INSERT INTO likes (post_id, id) VALUES ( ?, ?) ",[post_id,id]);
            io.emit("newLike",{post_id,user_id:id,like:true})
        } else {
            await database.query("DELETE FROM likes WHERE post_id = ? AND id = ?",[post_id,id]);
            io.emit("newLike",{post_id,user_id:id,like:false})
        }

        rspo.status(200).send({test:"done"});
    } catch (error) {
        rspo.status(500).send({err:"Server Side error "});
    } finally {
        completeRequest(crntIP,crntAPI);
    }

}