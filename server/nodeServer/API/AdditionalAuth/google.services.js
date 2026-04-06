import jwt from 'jsonwebtoken'
import {envGoogle} from '../../lib/arctic.js';
import { handleOAuthLogin } from './authService.js';
import {Encrypt} from '../../utils/Encryption.js'
import { completeRequest } from '../../Controllers/src/middleware/progressTracker.js';
import redis from '../../Controllers/src/config/redis.js';
import { NewOAuthAc, OAuthLogin } from './handleOAuth.js';

export const googleCallBackHandler = async (rkv, rspo) => {
  const crntIP = rkv.userIp;
  const crntAPI = rkv.originalUrl.split("?")[0];
  try {
    const {code, state} = rkv.query;

    // validate state
    if (!state || state !== rkv.session.googleState || !code) {
      delete rkv.session.googleState;
      delete rkv.session.googleCodeVerifier;
      return rspo.redirect(`${process.env.FRONTEND_URL}?err="Something went wrong"`);
    };

    //Arctic magic
    const tokens = await envGoogle.validateAuthorizationCode(code,rkv.session.googleCodeVerifier);
    const idToken = tokens.data.id_token;
    const payload = JSON.parse(Buffer.from(idToken.split(".")[1], "base64").toString());

    let authData = {
      provider: "Google",
      providerAccount_id: payload.sub,
      email: payload.email,
      avatar: payload.picture,
      expires_at: payload.exp,
      accessToken: tokens.data.access_token
    }

    const OAuthInfo = await handleOAuthLogin(authData);
    
    if (OAuthInfo.code === 202) {
      let LoginRkv = await OAuthLogin(rkv, OAuthInfo);
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
    //check for cooldown
    const key = `isCoolDown:${authData.email}`
    let isCoolDown = await redis.exists(key);
    // console.log(isCoolDown)

    let ttl = await redis.ttl(key); // getting time left

    if (OAuthInfo.code === 302 && !isCoolDown) { // same userData in token don't pass it to frontEnd
          let {user_id, username, avatar, provider_name } = OAuthInfo;
          let authToken = jwt.sign({...authData, user_id, username, provider_name,accountAv:avatar},process.env.jwt_sec, {expiresIn:"6m"});
          let encryptedToken = await Encrypt(authToken);
          
          rspo.cookie("myMergeData",encryptedToken,{
            httpOnly:true,
            secure:true,
            maxAge:6 * 60 * 1000 // 6m
          });
          
                
          //setting is coolDown 
          await redis.set(key,"1",{
            EX:361
          })
          
          
          return rspo.redirect(
            `${process.env.FRONTEND_URL}userfound`
          )
        } else if (OAuthInfo.code === 302) {
          let timeLeft = Math.ceil(ttl / 60);
          return rspo.redirect(
          `${process.env.FRONTEND_URL}?err="This action is on cooldown. Please try again in ${timeLeft} minutes."`);
        } 

      if (OAuthInfo.code === 404) {
        
        let username = authData.email.split("@")[0];

          const request = await NewOAuthAc({...authData, username});
          if (request.err) {
            return rspo.status(500).send(request.err);
          }
          let LoginRkv = await OAuthLogin(rkv, request);
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
    console.log(error.message)
    rspo.json({err:"Server side error"})
  } finally {
    completeRequest(crntIP, crntAPI);
  } 
}