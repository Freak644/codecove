import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/src/middleware/progressTracker.js";

export const miniToggleDy = async (rkv,rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;

    let {setting,post_id} = rkv.body || {};
    let validationArray = ["likeCount","canComment","visibility"];
    try {
        if (!setting.trim() || !post_id.trim()) return rspo.status(400).send({err:"Something went wrong ()"})
        if (!validationArray.includes(setting)) return rspo.status(400).send({err:"Invalid Toggle key"});
        let [row] = await database.query(`SELECT ${setting} FROM posts WHERE post_id = ? AND id = ?`,[post_id,id]);
        if (row.length === 0) return rspo.status(401).send({err:"Something went wrong "});
        await database.query(`UPDATE posts SET ${setting} = NOT ${setting} WHERE post_id = ? AND id=?`,[post_id,id])
        rspo.status(200).send({pass:"Update! succesfully"})
    } catch (error) {
        rspo.status(500).send({err:"server side error"});
    } finally {
        completeRequest(crntIP,crntAPI)
    }
}

export const CommentPinned = async (rkv, rspo) => {
    const crntIp = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    const {commentID} = rkv.query;
    let {id} = rkv.authData;

    try {
        if (!commentID || !commentID.trim()) return rspo.status(401).send({err:"Something went wrong"});
        let [crntComment] = await database.query("SELECT id as user_id, isPinned, score FROM comments WHERE commentID = ?", [commentID]);
        if(crntComment.length === 0) return rspo.status(401).send({err:"Something went Wrong"});
        let {user_id, score, isPinned} = crntComment[0];
        console.log(user_id === id); 
        rspo.status(200).send({pass:"Till now"});
    } catch (error) {
        rspo.status(500).send({err:"Server side error"});
    } finally {
        completeRequest(crntIp, crntAPI);
    }
}