import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/progressTracker.js";

export const getComment = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {postID} = rkv.body;
    try {
        let [rows] = await database.query("SELECT canComment FROM posts WHERE post_id = ?",[postID]);
        if (rows.length !== 1) return rspo.status(401).send({err:"Plase refresh and try again"});
        console.log(rows[0])
        rows.send({pass:""})
    } catch (error) {
        rspo.status(500).send({err:"Server Side Error"});
    }finally{
        completeRequest(crntIP,crntAPI);
    }
    rspo.end();
}