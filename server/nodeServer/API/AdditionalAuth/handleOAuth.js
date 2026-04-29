import {nanoid} from 'nanoid';
import {v4 as uuid4} from 'uuid'
import { database } from '../../Controllers/myConnectionFile.js';
import { SaveThisSession } from '../Login/userSession.js';
import jwt from 'jsonwebtoken'
import { Encrypt } from '../../utils/Encryption.js';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp'
import { getAvatarPath } from '../../utils/getImagePath.js';


const NewOAuthAc = async (tokenData) => {
    let OAuth_id = nanoid(25);
    let uuid = uuid4();
    let {provider, providerAccount_id, email, avatar,
        accessToken, user_id, username, accountAv, iat, exp} = tokenData;
      
     
        try {
            if (user_id && user_id.trim() && user_id.length === 36) { // Insert user info in Oauth table 
                
                await database.query(`INSERT INTO oauth_accounts 
                    (id, user_id, provider_name, provider_account_id, provider_email, access_token) 
                    VALUE (?, ?, ?, ?, ?, ?);`,[OAuth_id, user_id, provider, providerAccount_id, email, accessToken]);
                    return {id:OAuth_id, user_id}
                }else if (!user_id) {
                    
                    if (!avatar) return {err:"File not Found"};
                    
                    
                    let imgRkv = await fetch(avatar); 
                    if (!imgRkv.ok) {
                        return {err:"Failed to fetch Image"}
                    }
                    let blogFile = await imgRkv.arrayBuffer(); //reading file as blog
                    const contantType = imgRkv.headers.get("content-type") || "image/jpeg";
                    if (!contantType.startsWith("image/")) {
                        return {err:"Invalid file type"};
                    }
                    avatar = null;

                    if (blogFile) {
                    const buffer = Buffer.from(blogFile);

                    const { dir, filePath } = getAvatarPath(uuid);

                    // ✅ ensure directory exists
                    if (!fs.existsSync(dir)) {
                        await fs.promises.mkdir(dir, { recursive: true });
                    }

                    // ✅ convert + optimize
                    await sharp(buffer)
                        .resize(256, 256, { fit: "cover" })
                        .webp({ quality: 80 })
                        .toFile(filePath);

                    // ✅ clean API path
                    avatar = `/myServer/avatar/${uuid}`;
                    }
                await database.query(`INSERT INTO users (id, username, email, avatar) VALUES (?, ?, ?, ?);`,[uuid, username, email, avatar || accountAv,]);
                await database.query("INSERT INTO roles (user_id) VALUES (?)",[uuid])
                await database.query(`INSERT INTO oauth_accounts 
                    (id, user_id, provider_name, provider_account_id, provider_email, access_token) 
                    VALUE (?, ?, ?, ?, ?, ?);`,[OAuth_id, uuid, provider, providerAccount_id, email, accessToken]);
                return {id:OAuth_id, user_id:uuid}
            }
            throw new Error("Something went Wrong");
            
            
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