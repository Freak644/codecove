import { database } from "../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../Controllers/progressTracker.js";

export const GetPosts = async (rkv,rspo) => {
    let {id} = rkv.authData;
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let limit = parseInt(rkv.query.limit) || 10;
    let offset = parseInt(rkv.query.offset) || 0
    if (limit>15) {
        limit=10;
    }
    try {
        const [rows] = await database.query("SELECT u.username, u.avatar, p.* FROM posts p INNER JOIN users u ON u.id = p.id WHERE p.visibility <> 0 ORDER BY created_at DESC LIMIT ? OFFSET ?",
        [limit,offset])
        if (rows.length === 0) {
            return rspo.status(404).send({err:"No posts"})
        }
        delete rows[0].blockCat;
        delete rows[0].likeCount;
        rspo.status(201).send({pass:"Found",post:rows})
    } catch (error) {
        rspo.status(500).send({err:error.message})
    }finally{
        completeRequest(crntIP,crntAPI);
    }
}