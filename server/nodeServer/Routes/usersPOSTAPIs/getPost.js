import { database } from "../../Controllers/myConnectionFile.js";

export const GetPosts = async (rkv,rspo) => {
    let {id} = rkv.authData;
    let limit = parseInt(rkv.query.limit) || 10;
    let offset = parseInt(rkv.query.offset) || 0
    if (limit>15) {
        limit=10;
    }
    try {
        const [rows] = await database.query("SELECT * FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?",
        [limit,offset])
        rspo.status(201).send({pass:"Found",post:rows})
    } catch (error) {
        rspo.status(500).send({err:error.message})
    }
}