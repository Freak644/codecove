import { database } from "../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../Controllers/progressTracker.js";

export const CrntUser = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    try {
        let [userinfo] = await database.execute(
           "SELECT avatar,username,email,id,bio FROM users WHERE id=?",
        [id]
    )
        if (userinfo.length === 0) return rspo.status(401).send({err:"Invalid userID"});
        rspo.status(302).send({userinfo})
    } catch (error) {
        rspo.status(500).send({err:"Server side error",details:error.message})
    } finally {
        completeRequest(crntIP,crntAPI)
    }
}