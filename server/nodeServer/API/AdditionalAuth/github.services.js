import redis from "../../Controllers/src/config/redis.js";
import { completeRequest } from "../../Controllers/src/middleware/progressTracker.js";
import { envGithub } from "../../lib/arctic.js";
import { Encrypt } from "../../utils/Encryption.js";
import { handleOAuthLogin } from "./authService.js";
import jwt from 'jsonwebtoken';
import { NewOAuthAc, OAuthLogin } from "./handleOAuth.js";

export const githubCallBackHandler = async (rkv, rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    try {
        const {state, code} = rkv.query;

        if (!state || state !== rkv.session.githubState) {
            delete rkv.session.githubState;
            return rspo.redirect(`${process.env.FRONTEND_URL}?err="Something went wrong"`);
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


        let authData = {
            provider:"Github",
            providerAccount_id: userInfo.id.toString(),
            email:primaryEmail,
            avatar: userInfo.avatar_url,
            accessToken,
            username:userInfo.login
        }


        const OAuthInfo = await handleOAuthLogin(authData);
        
        if (OAuthInfo.code === 202) {
            let LoginRkv = await OAuthInfo(rkv, OAuthInfo);
            if (LoginRkv.err) {
                return rspo.status(500).session(LoginRkv.err);
            }
            rspo.cookie("myAuthToken", LoginRkv, {
                httpOnly: true,
                secure:true,
                sameSite:"lax",
                maxAge: 24 * 60 * 60 * 1000
            });

            return rspo.redirect(process.env.FRONTEND_URL);
        }
        
        
        const key = `isCoolDown:${primaryEmail}`;
        await redis.del(key)
        let isCoolDown = await redis.exists(key);
        let ttl = await redis.ttl(key);
    
        if (OAuthInfo.code === 302 && !isCoolDown) {
        
            let {user_id, username, avatar, provider_name } = OAuthInfo;
            let authToken = jwt.sign({...authData, user_id, username, provider_name, accountAv:avatar}, process.env.jwt_sec, {expiresIn: "6m"})
            let encryptedToken = await Encrypt(authToken);

            rspo.cookie("myMergeData", encryptedToken, {
                httpOnly:true,
                secure: true,
                maxAge: 6 * 60 * 1000
            });

            await redis.set(key,"1",{
                EX:361
            });

            return rspo.redirect(
                `${process.env.FRONTEND_URL}userfound`
            )
        } else if (OAuthInfo.code === 302) {
            let timeLeft = Math.ceil(ttl / 60);
            return rspo.redirect(
                `${process.env.FRONTEND_URL}?err="This action is on  cooldown. Please try again in ${timeLeft}m"`
            )
        }

        if (OAuthInfo.code === 404) {
       

            const createAccount = await NewOAuthAc({authData});
            if (createAccount.err) {
                return rspo.status(500).send(request.err);
            }
            let LoginRkv = await OAuthLogin(rkv, createAccount);
            if (LoginRkv.err) {
                 return rspo.status(500).send(LoginRkv.err);
            }
            rspo.cookie("myAuthToken", LoginRkv, {
                httpOnly:true,
                secure:true,
                sameSite:"lax",
                maxAge: 24 * 60 * 60 * 1000
          })
          return rspo.redirect(process.env.FRONTEND_URL);
        }

         rspo.redirect(`${process.env.FRONTEND_URL}?err="Something Went wrong"`);

    } catch (error) {
        console.log(error.message);
        rspo.redirect(`${process.env.FRONTEND_URL}?err="Something Went wrong"`)
    } finally {
        completeRequest(crntIP, crntAPI);
    }
}