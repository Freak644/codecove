import jwt from 'jsonwebtoken'
import {envGoogle} from '../../lib/arctic.js';
import { handleOAuthLogin } from './authService.js';
import { Encrypt } from '../../utils/Encryption.js';
export const googleCallBackHandler = async (rkv, rspo) => {


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
          let authToken = jwt.sign({...authData, user_id, username, provider_name},process.env.jwt_sec, {expiresIn:"5m"});
          let encryptedToken = await Encrypt(authToken);

          rspo.cookie("mergeRequest", encryptedToken, {
            httpOnly:true,
            secure:true,
            sameSite:"strict",
            maxAge: 10 * 60 * 1000 // 10 minute
          });
          rspo.redirect(
              `${process.env.FRONTEND_URL}userfound?data=${encodeURIComponent(JSON.stringify({username,avatar,provider_name, crntProvider:"Google"}))}`
          )
      }

    
    //rspo.redirect(process.env.FRONTEND_URL)
  } catch (error) {
    console.log(error.message)
    rspo.json({err:"Server side error"})
  } 
}