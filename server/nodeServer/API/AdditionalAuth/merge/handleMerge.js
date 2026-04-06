import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/src/middleware/progressTracker.js";
import { Decrypt } from "../../../utils/Encryption.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { NewOAuthAc, OAuthLogin } from "../handleOAuth.js";

export const VerifyMergeToken = async (rkv, rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {token} = rkv.query;
    try {
        if (!token || token.length !== 21) {
            throw new Error("Token not valid");
            
        }
        const [requestInfo] = await database.query("SELECT * FROM merge_request WHERE request_id = ? LIMIT 1",[token]);
        if (requestInfo.length === 0 ) {
            throw new Error("Token not valid");   
        }
   
        let {created_at, user_id} = requestInfo[0];
       
        //  CONVERT THE TIME INTO TIME STR
        let timeFromDb = new Date(created_at);
        let now = Date.now();
        let diffms = now - timeFromDb;
        let diffInM = diffms / (1000 * 60)
        if (diffInM > 5) {
            throw new Error("This token is exp");
            
        }

        //check if the user have CodeCove account
        const [userInfo] = await database.query("SELECT password FROM users WHERE id = ? LIMIT 1",[user_id]);
        let {password} = userInfo[0];

        await database.query("DELETE FROM merge_request WHERE user_id = ?",[user_id]);


        if (password !== null) {
            return rspo.redirect(`${process.env.FRONTEND_URL}userfound?page=${encodeURIComponent("password")}`)
        }

        let oToken = rkv.cookies.myMergeData;
        if (!oToken) {
            return rspo.status(400).send({err:"Cookie is missing or expired"})
        }
        let decryptedToken = await Decrypt(oToken);
        let tokenData = jwt.decode(decryptedToken, process.env.jwt_sec);
        let decodedTime = Math.floor(Date.now()/1000);
        if (tokenData.exp<decodedTime) {
            return rspo.status(504).send({err:"Google Data is now Expire"});
        }

        const request = await NewOAuthAc(tokenData);
  
          if (request.err) {
            return rspo.status(500).send(request.err);
          }
          let LoginRkv = await OAuthLogin(rkv, request);
  
          if (LoginRkv.err) {
            return rspo.status(500).send(LoginRkv.err);
          }
          rspo.cookie("myAuthToken", LoginRkv, {
            httpOnly:true,
            secure:true,
            sameSite:"lax",
            maxAge: 24 * 60 * 60 * 1000
          })
          rspo.redirect(process.env.FRONTEND_URL);


        
    } catch (error) {
        console.log(error.message)
        rspo.redirect(
            `${process.env.FRONTEND_URL}?err=${encodeURIComponent(error.message)}`
        );
    } finally {
        completeRequest(crntIP, crntAPI)
    }
}

export const verifyPassword = async (rkv, rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {password} = rkv.body;
    try {
        if (!password || !password.trim()) return rspo.status(400).send({err:"Something Went Wrong"});
        let token = rkv.cookies.myMergeData;
        if (!token) {
            return rspo.status(400).send({ err: "Session missing or expired" });
        }
        // decoding the token
        let decryptedToken = await Decrypt(token);
        let tokenData = jwt.decode(decryptedToken, process.env.jwt_sec);
        let decodedTime = Math.floor(Date.now()/1000);
        if (tokenData.exp<decodedTime) {
            return rspo.status(504).send({err:"Google Data is now Expire"});
        }
        let {user_id} = tokenData;
        let [userInfo] = await database.query("SELECT email,password as userPass FROM users WHERE id = ?",[user_id]);
        if (userInfo.length === 0) return rspo.status(401).send({err:"Token is currepted"});
        let {userPass} = userInfo[0];
        
        let isPassMatch = await bcrypt.compare(password,userPass);
        if (!isPassMatch) {
            return rspo.status(401).send({err:"Check your Password"});
        }
        
        const request = await NewOAuthAc(tokenData);

          if (request.err) {
            return rspo.status(500).send({err:request.err});
          }
          let LoginRkv = await OAuthLogin(rkv, request);
         
          if (LoginRkv.err) {
            return rspo.status(500).send(LoginRkv.err);
          }
          rspo.cookie("myAuthToken", LoginRkv, {
            httpOnly:true,
            secure:true,
            sameSite:"lax",
            maxAge: 24 * 60 * 60 * 1000
          })

          rspo.cookie("myMergeData", "", { expires: new Date(0) });

          rspo.json({pass:"Merged"});

        
    } catch (error) {
       
        rspo.json({err:"Server side error"});
    } finally {
        completeRequest(crntIP, crntAPI);
    }
}