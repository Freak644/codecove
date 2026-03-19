import { completeRequest } from '../../Controllers/progressTracker.js';
import {envGoogle} from '../../lib/arctic.js';
export const googleCallBackHandler = async (rkv, rspo) => {
  const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
  const crntAPI = rkv.originalUrl.split("?")[0];

  try {
    const {code, state} = rkv.query;

    // validate state
    if (!state || state !== rkv.session.state || !code) return rspo.status(400).json({err:"Invalid state"});

    //Arctic magic
    const tokens = await envGoogle.validateAuthorizationCode(code,rkv.session.codeVerifier);
    const idToken = tokens.data.id_token;
    const payload = JSON.parse(Buffer.from(idToken.split(".")[1], "base64").toString());
    console.log(payload)
    
    rspo.json({pass:"Done"})
  } catch (error) {
    console.log(error.message)
    rspo.json({err:"Server side error"})
  } finally {
    completeRequest(crntIP,crntAPI)
  }
}