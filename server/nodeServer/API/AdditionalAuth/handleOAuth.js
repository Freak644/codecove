import {nanoid} from 'nanoid';
import {v4 as uuid4} from 'uuid'
import { database } from '../../Controllers/myConnectionFile.js';
import { SaveThisSession } from '../Login/userSession.js';
import jwt from 'jsonwebtoken'
import { Encrypt } from '../../utils/Encryption.js';
const NewOAuthAc = async (tokenData) => {
    let OAuth_id = nanoid(25);
    let uuid = uuid4();
    let {provider, providerAccount_id, email, avatar,
        accessToken, user_id, username, accountAv, iat, exp} = tokenData;
       
        try {
            if (user_id && user_id.trim() && user_id.length === 36) {
                await database.query(`INSERT INTO oauth_accounts 
                    (id, user_id, provider_name, provider_account_id, provider_email, access_token) 
                    VALUE (?, ?, ?, ?, ?, ?);`,[OAuth_id, user_id, provider, providerAccount_id, email, accessToken]);
                    return {id:OAuth_id, user_id}
            }else {
                await database.query(`INSERT INTO users (id, username, email, avatar) VALUES (?, ?, ?, ?);`,[uuid, username, email, avatar || accountAv,]);
                await database.query("INSERT INTO roles (user_id) VALUES (?)",[uuid])
                return {id:OAuth_id, user_id:uuid}
            }

            
        } catch (err) {
            return {err:err.message}
        }
        
}

const OAuthLogin = async (rkv ,userInfo) => {
    let {id,user_id} = userInfo;
    try {
        let {session_id} = await SaveThisSession(rkv, user_id);
        let authData = jwt.sign({id:user_id,OAuth_id:id,session_id},process.env.jwt_sec,{expiresIn: "1d"});
        let encryptedToken = await Encrypt(authData);
        return encryptedToken
    } catch (err) {
        return {err:err.message}
    }
}


export {NewOAuthAc, OAuthLogin}