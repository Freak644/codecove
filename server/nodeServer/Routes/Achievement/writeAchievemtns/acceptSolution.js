import { database } from "../../../Controllers/myConnectionFile.js";

export const acceptSolution = async (rkv,rspo) => {
    let {id} = rkv.authData;
    let {commentID} = rkv.body;
    try {
        if (!commentID || !commentID.trim()) return rspo.status(401).send({err:"Unauthorize Request"});
        let [rows] = await database.query("SELECT p.id AS owner_id, p.post_moment,c.id AS commentOwner_id FROM comments c INNER JOIN posts p ON c.post_id = p.post_id WHERE c.commentID = ?",
            [commentID]
        );
        if (rows.length === 0) return rspo.status(404).send({err:"The comment is Deleted or hidden"});
        let {owner_id,post_moment,commentOwner_id} = rows[0];
        if (post_moment !== "Bugs") return rspo.status(401).send({err:"Not Allowed"});
        if (owner_id !== id) return rspo.status(401).send({err:"You didn't have Owner Access"})
        if (commentOwner_id === owner_id) return rspo.status(403).send({err:"You Can't accept your own Solution"})
        console.log(rows,owner_id,post_moment,commentOwner_id)
        rspo.status(200).send({pass:"Done"})
    } catch (error) {
        console.log({message:error.message,error});
        rspo.status(500).send({err:"Server side error"});
    }
}