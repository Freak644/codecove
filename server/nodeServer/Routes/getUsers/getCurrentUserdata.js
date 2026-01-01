import { database } from "../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../Controllers/progressTracker.js";

export const CrntUser = async (rkv,rspo) => {
    let {id} = rkv.authData;
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    try {
        let [userinfo] = await database.execute(
           "SELECT avatar,username,email,id,bio FROM users WHERE id=?",
        [id]
    )
        rspo.status(302).send({userinfo})
    } catch (error) {
        rspo.status(500).send({err:"Server side error",details:error.message})
    }finally{
        completeRequest(crntIP,crntAPI);
    }
}