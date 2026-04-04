import {v4 as getuuid} from 'uuid'
import {database} from '../../Controllers/myConnectionFile.js';
import { SaveThisSession } from '../Login/userSession.js';
export const handleOAuthLogin = async (userInfo) => {
    let {
        provider, providerAccount_id, email = null,
        refresh_token = null, expires_at = null,
    } = userInfo;
    try {
        // if userAlready Exists
        let [account] = await database.query(`SELECT user_id, id 
                FROM oauth_accounts WHERE provider_name = ? AND provider_account_id = ? LIMIT 1`
            ,[provider,providerAccount_id]);
        
        if (account.length !== 0) { // create session and return details for JWT
            let {user_id, id} = account[0];
            return {user_id, id,code:202}
        }
        // if Eamil is link with another account
        let [uAccount] = await database.query(`SELECT u.id as user_id, u.username, u.avatar, oa.provider_name FROM users as u 
            LEFT JOIN oauth_accounts oa ON u.id = oa.user_id
             WHERE u.email = ? LIMIT 1`, [email]);
        
        if (uAccount.length !== 0) {
           
            let { user_id, username,avatar,provider_name} = uAccount[0];
            return {user_id,username, avatar ,provider_name,code:302}
        }

        if (account.length === 0 && uAccount === 0) {
            return {code:404};
        }

        return {err:"Something went Wrong"}
        
    } catch (error) {
        console.log(error.message)
        return {err:"Server Side errro"}
    }
}