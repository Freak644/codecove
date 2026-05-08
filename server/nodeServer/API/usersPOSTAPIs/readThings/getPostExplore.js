import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/src/middleware/progressTracker.js";

export const GetPostForExport = async (rkv, rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    const Limit = parseInt(rkv?.query?.Limit, 30);
    const {id} = rkv.authData;

    let limit = Number.isNaN(Limit) ? 30 : Limit;
    limit = limit > 30 ? 30 : limit;
    const cursorPost_sr = rkv.query.cursorPost_sr || null;

    try {
        let [rows] = await database.query(`SELECT
            post_id, post_sr, id AS user_id, images_url,
            visibility, post_moment FROM posts
            WHERE visibility = 1
            AND (? IS NULL OR post_sr < ?)
            
            ORDER BY post_sr DESC LIMIT ?`, [cursorPost_sr, cursorPost_sr, limit + 1]);

        if (rows.length < 1) return rspo.status(404).send({err:"No Posts"});
        
        let hasMore = rows.length > limit;
        rows = rows.slice(0, limit);

        let cursorObj = {};
        // cursorObj.cursorAt = rows[rows.length - 1].created_at;
        cursorObj.cursorPost_sr = rows[rows.length - 1].post_sr;
        // rspo.set("Cache-Control", "public, max-age=60");
        rspo.status(200).send({pass:"Found",post:rows,hasMore,cursorObj})
    } catch (error) {
        console.log(error.message);
        rspo.status(500).send({err:"Server side error"});
    } finally {
        completeRequest(crntIP, crntAPI);
    }
}