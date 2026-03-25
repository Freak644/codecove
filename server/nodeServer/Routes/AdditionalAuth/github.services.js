
import { envGithub } from "../../lib/arctic.js";
import { handleOAuthLogin } from "./authService.js";

export const githubCallBackHandler = async (rkv, rspo) => {
    
    try {
        const {code, state} = rkv.query;

        if (!state || state !== rkv.session.githubState || !code) {
            delete rkv.session.githubState;
            rspo.redirect(process.env.FRONTEND_URL);
            return rspo.status(400).json({err:"Invalid state"});
        };

        const token = await envGithub.validateAuthorizationCode(code);
        let accessToken = token.data.access_token;

        const userRspo = await fetch("https://api.github.com/user",{
            headers:{
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const userInfo = await userRspo.json();
        
        const emailRspo = await fetch("https://api.github.com/user/emails", {
            headers:{
                Authorization: `Bearer ${accessToken}`
            }
        });

        const emailInfo = await emailRspo.json();
        const primaryEmail = emailInfo.find(el=>el.primary)?.email;
        if (!primaryEmail) {
            return rspo.redirect(
                `${process.env.FRONTEND_URL}/?err=No_Email`
            )
        }

        await handleOAuthLogin(rkv, {
            provider:"Github",
            providerAccount_id: userInfo.id.toString(),
            email:primaryEmail,
            avatar: userInfo.avatar_url,
            accessToken,
            username:userInfo.login
        })

        rspo.redirect(process.env.FRONTEND_URL)

    } catch (error) {
        console.log(error.message);
        rspo.json({err:"Server Side error"})
    }
}