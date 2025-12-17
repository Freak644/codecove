import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/progressTracker.js";
import {nanoid} from 'nanoid';
export const CommentAPI = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/,"") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    let {post_id,text,pID} = rkv.body;
    let commentID = nanoid();
    try {
        console.log(commentID)
        if (text.length<1) return rspo.status(400).send({err:"Invalid Comment Length"});
        if (post_id !== pID) return rspo.status(401).send({err:"Something went wrong"});
        let [rows] = await database.query("SELECT visibility, blockCat FROM posts WHERE post_id = ? AND canComment = 1 LIMIT 1",[post_id]);
        if (rows.length === 0 ) return rspo.status(401).send({err:"HeHeHeHeHeHe......"});
        let {visibility,blockCat} = rows[0];
        
        
        // await database.query("INSERT INTO comments (commentID, post_id, id, comment) VALUES (?,?,?,?);",
        //     [commentID,post_id,id,text]
        // )
        rspo.status(200).send({pass:""});
    } catch (error) {
        console.log(error.message)
        rspo.status(500).send({err:"Server Side Error"});
    } finally {
        completeRequest(crntIP,crntAPI); 
    }
}