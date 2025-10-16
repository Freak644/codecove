import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { database } from '../../Controllers/myConnectionFile.js';
import dotenv from 'dotenv';
dotenv.config();
export const LoginAPI = async (rkv,rspo) => {
    let {Email,Password} = rkv.body;
    try {
        if (!Email?.trim() || !Password?.trim()) {
        return rspo.status(400).send({ err: "Please Provide proper information"})
        }
        let [isUser] = await database.execute(
            "SELECT username,password,id FROM users WHERE username=? OR email=?",
            [Email,Email]
        )
        if (!isUser.length>0) {
            if (Email.endsWith("@gmail.com")) {
                return rspo.status(401).send({ err: "Please check your Email"})
            } else {
                return rspo.status(401).send({ err: "Please check your username"})
            }
        }
        let {password} = isUser[0];
        let isPassMatch = await bcrypt.compare(Password,password);
        if (!isPassMatch) {
            return rspo.status(401).send({ err: "Check your Password"})
        }
        let {id} = isUser[0];
        let authToken = jwt.sign({id},process.env.jwt_sec,{expiresIn:"1h"});
        rspo.cookie("myAuthToken",authToken,{
            httpOnly:true,
            secure:true,
            sameSite:"strict",
            maxAge: 1 * 60 *1000
        })
        rspo.status(200).send({ pass: "Login",authToken:isUser[0].username})
    } catch (error) {
        rspo.status(500).send({ err: "Sever Side Error",details:error.message});
    }
}