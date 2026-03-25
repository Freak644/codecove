
import {envGoogle} from '../../lib/arctic.js';
import { handleOAuthLogin } from './authService.js';
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


    await handleOAuthLogin(rkv, {
      provider: "Google",
      providerAccount_id: payload.sub,
      email: payload.email,
      avatar: payload.picture,
      expires_at: payload.exp,
      accessToken: tokens.data.access_token
    });
    
    rspo.redirect(process.env.FRONTEND_URL)
  } catch (error) {
    console.log(error.message)
    rspo.json({err:"Server side error"})
  } 
}