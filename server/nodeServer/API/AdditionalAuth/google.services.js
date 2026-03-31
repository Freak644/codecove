import jwt from 'jsonwebtoken'
import {envGoogle} from '../../lib/arctic.js';
import { handleOAuthLogin } from './authService.js';
import { Encrypt } from '../../utils/Encryption.js';
import { completeRequest } from '../../Controllers/src/middleware/progressTracker.js';
export const googleCallBackHandler = async (rkv, rspo) => {
  const crntIP = rkv.userIp;
  const crntAPI = rkv.originalUrl.split("?")[0];
  try {
    const {code, state} = rkv.query;

    // validate state
    if (!state || state !== rkv.session.googleState || !code) {
      delete rkv.session.googleState;
      delete rkv.session.googleCodeVerifier;
      rspo.redirect(process.env.FRONTEND_URL);
      return rspo.status(400).json({err:"Invalid state"});
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

    const OAuthInfo = await handleOAuthLogin(rkv, authData);

    if (OAuthInfo.code === 302) { // same userData in token don't pass it to frontEnd
          let {user_id, username, avatar, provider_name } = OAuthInfo;
          let authToken = jwt.sign({...authData, user_id, username, provider_name},process.env.jwt_sec, {expiresIn:"60m"});
          let encryptedToken = await Encrypt(authToken);

          rkv.session.Token = encryptedToken;
          rspo.redirect(
              `${process.env.FRONTEND_URL}userfound?data=${encodeURIComponent(JSON.stringify({username,avatar,provider_name, crntProvider:"Google", email:authData.email, crntMergeAvatar:authData.avatar}))}`
          )
      }

    
    //rspo.redirect(process.env.FRONTEND_URL)
  } catch (error) {
    console.log(error.message)
    rspo.json({err:"Server side error"})
  } finally {
    completeRequest(crntIP, crntAPI);
  } 
}