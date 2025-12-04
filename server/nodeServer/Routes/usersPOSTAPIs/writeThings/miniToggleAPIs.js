import { completeRequest } from "../../../Controllers/progressTracker.js";

export const miniToggleDy = async (rkv,rspo) => {
    let {id} = rkv.authData;
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {setting} = rkv.body;
    console.log(crntDysetting)
    try {
        rspo.end();
    } catch (error) {
        rspo.status(500).send({err:"server side error"});
    }finally{
        completeRequest(crntIP,crntAPI);
    }
}