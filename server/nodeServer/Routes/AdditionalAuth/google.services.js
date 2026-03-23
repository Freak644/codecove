
import {envGoogle} from '../../lib/arctic.js';
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
    console.log(payload)
    
    rspo.json({pass:"Done",payload})
  } catch (error) {
    console.log(error.message)
    rspo.json({err:"Server side error"})
  } 
}