import { database } from "../../../Controllers/myConnectionFile.js";

export const Chartdata = async (rkv,rspo) => {
    let {id} = rkv.authData;
    try {
        let [rows] = await database.query("SELECT caption as title, totalLike as likes FROM posts WHERE id = ? AND visibility = 1 ORDER BY created_at DESC LIMIT 10",[id]);
        rspo.json(rows[0])
        
    } catch (error) {
        console.log(error.message)
        rspo.status(500).send({err:"Server side error"})
    }
}