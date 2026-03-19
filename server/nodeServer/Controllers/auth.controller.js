import { generateCodeVerifier, generateState } from "arctic";
import { completeRequest } from "./progressTracker.js"
import { envGoogle } from "../lib/arctic.js";

export const startGoogleLogin = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    try {
        const state = generateState();
        const codeVerifier = generateCodeVerifier();

        rkv.session.state = state;
        rkv.session.codeVerifier = codeVerifier;

        const url = envGoogle.createAuthorizationURL(
        state,
        codeVerifier,
        ["openid", "profile", "email"]
        );

        url.searchParams.set("access_type", "offline");
        url.searchParams.set("prompt", "consent");
     
        rspo.redirect(url.toString());
        
    } catch (error) {
        console.log(error.message)
        rspo.json({err:"Server side error"})
    }finally {
        completeRequest(crntIP,crntAPI)
    }
}