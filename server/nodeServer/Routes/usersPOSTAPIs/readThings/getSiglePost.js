import { database } from "../../../Controllers/myConnectionFile.js";

export const getPost = async (rkv, rspo) => {
    let {id} = rkv.authData;
    let {post_id} = rkv.query;
    try {
        if (!post_id || post_id.length !== 21) return rspo.status(400).send({err:"Link is Broken"});
        let [row] = await database.query("SELECT visibility, images_url, id AS user_id FROM posts WHERE post_id = ?",[post_id]);
        if (row.length !== 1) return rspo.status(400).send({err:"Something went wrong"});
        let {visibility, user_id, images_url} = row[0];
        console.log(user_id,visibility)
        if (!visibility && id !== user_id) return rspo.status(401).send({err:"You did't have the access"});

        rspo.status(200).send({pass:images_url})
    } catch (error) {
        rspo.status(500).send({err:"Server side error"})
    }
}