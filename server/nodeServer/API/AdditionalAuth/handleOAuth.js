import {nanoid} from 'nanoid';
import {v4 as uuid4} from 'uuid'
import { database } from '../../Controllers/myConnectionFile.js';
import { SaveThisSession } from '../Login/userSession.js';
import jwt from 'jsonwebtoken'
import { Encrypt } from '../../utils/Encryption.js';
import fs from 'fs';
import path from 'path';



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
                    const buffer = Buffer.from(blogFile); // conver the array into buff
                    const imageDir = `./Images/${username}/Avatar`;
                    if (!fs.existsSync(imageDir)) await fs.promises.mkdir(imageDir, {recursive: true});
                    let ext = contantType.split("/")[1]; //read ext name 
                    let safeUsername = username.replace(/[^a-zA-Z0-9]/g, "")
                    let avatarFileName = `${safeUsername}-${Date.now()}.${ext}`
                    const avatarPath = path.join(imageDir, avatarFileName);
                    await fs.promises.writeFile(avatarPath, buffer); // write the file
                    avatar = `/myServer/Images/${username}/Avatar/${avatarFileName}`
                await database.query(`INSERT INTO users (id, username, email, avatar) VALUES (?, ?, ?, ?);`,[uuid, username, email, avatar || accountAv,]);
                await database.query("INSERT INTO roles (user_id) VALUES (?)",[uuid])
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