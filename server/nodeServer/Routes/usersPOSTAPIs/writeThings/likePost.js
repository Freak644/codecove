import { completeRequest } from "../../../Controllers/progressTracker.js";

export const starPost = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/,"") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;

    try {
        console.log(id)
        rspo.end();
    } catch (error) {
        
    } finally {
        completeRequest(crntIP,crntAPI);
    }

}