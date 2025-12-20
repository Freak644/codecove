import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/progressTracker.js";

export const getComment = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {post_id,offset,limit} = rkv.query;
    const intLimit = parseInt(limit) || 10;
    const intOffset = parseInt(offset) || 0;
    try {
        let [rows] = await database.query("SELECT canComment,visibility FROM posts WHERE post_id = ?",[post_id]);
        if (rows.length !== 1) return rspo.status(401).send({err:"Heheheheheeeeeeee...."});
        const {visibility,canComment} = rows[0]
        if (!visibility || !canComment) return rspo.status(401).send({err:"Heheheheheeeeee...."});
        const [commentrows] = await database.query("SELECT u.username,u.avatar, c.* FROM comments c INNER JOIN users u ON c.id = u.id WHERE c.post_id = ? ORDER BY c.created_at DESC LIMIT ? OFFSET ?",[post_id,intLimit,intOffset]);
        rspo.send({pass:"Done h boss",commentrows})
    } catch (error) {
        console.log(error.message);
        rspo.status(500).send({err:"Server Side Error"});
    }finally{
        completeRequest(crntIP,crntAPI);
    }
    rspo.end();
}
// {
// [0]     username: 'ms_3221',
// [0]     avatar: 'Images/Avtar/1765270948429-avatar.png',
// [0]     commentID: '5pQOf3J5rlNm5fNVTitOW',
// [0]     post_id: 'dLpuQkAVdp9lwckHWESCH',
// [0]     id: 'c9ba95e5-d4dd-11f0-beb0-74d4dd5e0da5',
// [0]     comment: 'Overloard',
// [0]     created_at: 2025-12-19T16:18:52.000Z
// [0]   },