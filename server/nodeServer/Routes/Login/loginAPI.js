import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { database } from '../../Controllers/myConnectionFile.js';
export const LoginAPI = async (rkv,rspo) => {
    let {Email,Password} = rkv.body;
    
    rspo.send({Email,Password})
}