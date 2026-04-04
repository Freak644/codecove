import {nanoid} from 'nanoid';
import {v4 as uuid4} from 'uuid'
import { database } from '../../Controllers/myConnectionFile';
const NewOAuthAc = async (tokenData) => {
    let OAuth_id = nanoid(25);
    let uuid = uuid4();
    let {provider, providerAccount_id, email, avatar, expire_at,
        accessToken, user_id, username, accountAv, iat, exp} = tokenData;
    
        try {
            if (user_id || user_id.trim() || user_id.length === 36) {
                await database.query(`INSERT INTO oauth_accounts 
                    (id, user_id, provider_name, provider_account_id, provider_email, access_token, expire_at) 
                    VALUE (?, ?, ?, ?, ?, ?, ?);`,[OAuth_id, user_id, provider, providerAccount_id, email, accessToken, expire_at]);
                    
            }else {
                await database.query(`INSERT INTO users (id, username, email, avatar) VALUES (?, ?, ?, ?);`,[uuid, username, email, avatar,]);
                await database.query("INSERT INTO roles (user_id) VALUES (?)",[uuid])
            }
            
        } catch (err) {
            throw err;
            
        }
        
}