import { nanoid } from "nanoid";
import { database } from "../../../Controllers/myConnectionFile.js";
import chalk from "chalk";

export const acceptSolution = async (rkv,rspo) => {
    let {id} = rkv.authData;
    let {commentID} = rkv.body;
    let token_id = nanoid(32);
    try {
        if (!commentID || !commentID.trim()) return rspo.status(401).send({err:"Unauthorize Request"});
        let [rows] = await database.query("SELECT p.id AS owner_id, p.post_id, p.post_moment, c.id AS commentOwner_id, c.isAccepted FROM comments c INNER JOIN posts p ON c.post_id = p.post_id WHERE c.commentID = ?",
            [commentID]
        );
        if (rows.length === 0) return rspo.status(404).send({err:"The comment is Deleted or hidden"});
        let {owner_id,post_moment,commentOwner_id,isAccepted,post_id} = rows[0];
        if (isAccepted) return rspo.status(409).send({err:"Solution Already Accepted"});
        if (post_moment !== "Bugs") return rspo.status(401).send({err:"Not Allowed"});
        if (owner_id !== id) return rspo.status(401).send({err:"You didn't have Owner Access"})
        if (commentOwner_id === owner_id) return rspo.status(403).send({err:"You Can't accept your own Solution"})
        await database.query("UPDATE comments SET isAccepted = 1 WHERE commentID = ?",[commentID]);
        
        await database.query("INSERT INTO achievement_shoutouts (shoutout_id, post_id, id, commentID) VALUES (?,?,?,?)",
            [token_id, post_id, commentOwner_id, commentID])
        rspo.status(200).send({pass:"Done"})
    } catch (error) {
        console.log({message:error.message,error});
        rspo.status(500).send({err:"Server side error"});
    }
}