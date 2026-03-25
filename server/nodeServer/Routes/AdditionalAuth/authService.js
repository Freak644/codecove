import {v4 as getuuid} from 'uuid'
import {database} from '../../Controllers/myConnectionFile.js';
import { SaveThisSession } from '../Login/userSession.js';
export const handleOAuthLogin = async (rkv, userInfo) => {
    let {
        provider, providerAccound_id, email, avatar, accessToken = null,
        refresh_token = null, expires_at = null, username = null
    } = userInfo;
    try {
        // if userAlready Exists
        let [account] = await database.query(`SELECT user_id, id 
                FROM oauth_accounts WHERE provider_name = ? AND provider_account_id = ? LIMIT 1`
            ,[provider,providerAccound_id]);
        
        if (account.length !== 0) { // create session and return details for JWT
            let {user_id, id} = account[0]
            let {session_id} = await SaveThisSession(rkv, user_id);
            return {user_id,session_id,id}
        }
        // if Eamil is link with another account
        let [uAccount] = await database.query(`SELECT u.id as user_id, u.username, u.avatar, oa.provider FROM users as u 
            INNER JOIN oauth_accounts oa ON u.id = oa.user_id
             WHERE u.email = ? LIMIT 1`, [email]);
        
        if (uAccount.length !== 0) {
            
        }
        
    } catch (error) {
        console.log(error.message)
        return {err:"Server Side errro"}
    }
}