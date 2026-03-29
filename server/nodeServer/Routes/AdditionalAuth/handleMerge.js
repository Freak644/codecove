import { database } from "../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../Controllers/progressTracker.js";

export const VerifyMergeToken = async (rkv, rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {token} = rkv.query;
    try {
        if (!token || token.length !== 21) {
            throw new Error("Token not valid");
            
        }
        const [requestInfo] = await database.query("SELECT * FROM merge_request WHERE request_id = ? LIMIT 1",[token]);
        if (requestInfo.length === 0 ) {
            throw new Error("Token not valid");   
        }
        console.log(requestInfo[0])
        let [created_at] = requestInfo[0];
        // CONVERT THE TIME INTO TIME STR
        let timeFromDb = new Date(created_at);
        let now = new Date.now();
        let diffms = now - timeFromDb;
        let diffInM = diffms / (1000 * 60)
        if (diffInM > 5) {
            throw new Error("This token is exp");
            
        }

        rspo.json({pas:"till now"});
    } catch (error) {
        console.log(error.message)
        return rkv.redirect(
            `${process.env.FRONTEND_URL}?err=${encodeURIComponent(error.message)}`
        );
    } finally {
        completeRequest(crntIP, crntAPI)
    }
}