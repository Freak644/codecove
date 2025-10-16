import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const Auth = async (rkv,rspo,next) => {
    let token = rkv.cookies.myAuthToken;
    if(!token) return rspo.status(401).send({login: "Please Login"});
    let tokenData = jwt.decode(token,process.env.jwt_sec);
    let decodedTime = Math.floor(Date.now()/1000);
    if (tokenData.exp<decodedTime) {
        return rspo.status(501).send({login: "Your Auth token is expire"});
    }
    rkv.authData = tokenData;
    next();
}