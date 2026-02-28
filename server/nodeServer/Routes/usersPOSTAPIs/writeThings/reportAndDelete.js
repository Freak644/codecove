import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/progressTracker.js";

export const ReportPost = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {post_id} = rkv.body;
    let {id} = rkv.authData;
    try {
        if (!post_id || post_id.length !== 21) return rspo.status(401).send({err:"Auth Error"});
        let [rows] = await database.query("SELECT p.visibility, p.id AS user_id, EXISTS(SELECT 1 FROM postReports WHERE id = ? AND post_id = p.post_id) AS isReported FROM posts p WHERE post_id = ?",
            [id,post_id]
        );
        if (rows.length === 0) return rspo.status(401).send({err:"Something went wrong"});
        let {visibility,user_id, isReported} = rows[0];
        if (isReported) return rspo.status(403).send({err:"Already repoted"});

        if (!visibility && user_id !== id) return rspo.status(401).send({err:"Auth Error"});
        rspo.json({pass:"Done"})
    } catch (error) {
        console.log(error.message)
        rspo.status(500).send({err:"Server Side Error"});
    } finally {
        completeRequest(crntIP,crntAPI);
    }
}


export const DeletePost = async (rkv,rspo) => {
    
}