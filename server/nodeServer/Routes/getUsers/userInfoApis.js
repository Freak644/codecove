import { database } from "../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../Controllers/progressTracker.js";

export const changeBio = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    let {user_id,bio} = rkv.body;
    try {
        if (user_id !== id) return rspo.status(401).send({err:"Auth Failed"});
        if (bio.length > 100) return rspo.status(406).send({err:"Bio.len > 50"});
        await database.query("UPDATE users SET bio = ? WHERE id = ?",[bio,id]);
        rspo.status(200).send({pass:"Done!"});
    } catch (error) {
        console.log(error.message)
        rspo.status(500).send({err:"Server side error"});
    } finally {
        completeRequest(crntIP,crntAPI);
    }
}