import {v4 as getuuid} from 'uuid'
import {database} from '../../Controllers/myConnectionFile.js';
export const handleOAuthLogin = async ({
    provider, providerAccound_id, email, avatar, accessToken = null,
    refresh_token = null, expires_at = null, username = null
}) => {
    
    let [account] = await database.query(`SELECT auth.user_id, auth.id,`)
}