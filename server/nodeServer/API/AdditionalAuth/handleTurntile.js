import { completeRequest } from "../../Controllers/src/middleware/progressTracker.js";
import axios from "axios";
export const HandleTurntile = async (rkv, rspo) => {
    const crntIp = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];

    const {token} = rkv.body;

    try {
        if (!token || !token.trim()) {
            return rspo.status(400).json({err:"Missing Turnstile token"});
        }
        //* send to cloudflare for verification
        const params = new URLSearchParams();

        params.append("secret", process.env.SERVER_CLOUDFLARE_KEY);
        params.append("response", token);

        if (crntIp) {
            params.append("remoteip", crntIp);
        }

        const response = await axios.post(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            params,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                timeout: 5000,
            }
        );

        const {success, 'error-codes': errorCodes} = response.data;
        
        if (!success) {
            rspo.status(400).json({success,err:"Turnstile verification failed", codes: errorCodes});
        }
        // Remember successful verification in the session
        rkv.session.turnstileVerified = true;
        rkv.session.turnstileVerifiedAt = Date.now();

        // Make sure the session is saved before responding
        await new Promise((resolve, reject) => {
            rkv.session.save((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        rspo.json({success,pass: 'Verification successful, form processed'});
        
    } catch (error) {
        console.log(error.message);
        rspo.status(500).send({err:"Server side error"});
    } finally {
        completeRequest(crntIp, crntAPI);
    }
}