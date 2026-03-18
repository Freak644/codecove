import { getGoogleUser } from "../Routes/AdditionalAuth/google.services.js";
import { completeRequest } from "./progressTracker.js"

export const googleCallBack = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    console.log(crntIP)
    const {code} = rkv.query;

    try {
        if (!code) {
            return res.status(400).json({ error: "No code provided" });
        }

        const googleUser = await getGoogleUser(code);


        rspo.json({test:"in backend",googleUser})
    } catch (error) {
        console.log(error.message)
        rspo.json({err:"Server side error"})
    }finally {
        completeRequest(crntIP,crntAPI)
    }
}