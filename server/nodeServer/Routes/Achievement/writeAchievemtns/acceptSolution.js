import { completeRequest } from "../../../Controllers/progressTracker";

const acceptSolution = async (rkv,rspo) => {
    const crntIP = rkv.clientIP?.replace(/^::ffff:/,"") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    let {commentID} = rkv.body;

    try {
        if (!commentID || !commentID.trim()) return rspo.status(401).send({err:"Unauthorize Request"});
    } catch (error) {
        rspo.status(500).send({err:"Server side error"});
    } finally {
        completeRequest(crntIP,crntAPI);
    }
}