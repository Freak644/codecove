import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { FileChecker } from './fileChecker.js';
import { database } from '../../Controllers/myConnectionFile.js';
/* THe flow will be 
React (FormData)
   ↓
Express + multer.memoryStorage()
   ↓
req.file.buffer  ← (Binary data)
   ↓
streamifier.createReadStream(buffer)
   ↓
cloudinary.uploader.upload_stream()
   ↓
Cloudinary Storage (returns URL)
*/
dotenv.config();
cloudinary.config({
  cloud_name:process.env.cloudinary_name,
  api_key: process.env.cloudinary_key,
  api_secret: process.env.cloudinary_sec
})
const dir = path.join(process.cwd(),"./Images/temp")
if(!fs.existsSync(dir)) fs.mkdirSync(dir);
const clearTemp = async (currentFiles) => {
  for (let file of currentFiles) {
    let imgPath = path.join(dir,file);
    await fs.promises.unlink(imgPath);
  }
  console.log("tempFile Clear")
}
export const CreatePost = async (rkv,rspo) => {
    const fileArray = rkv.files
    let {id} = rkv.authData;
    if (fileArray.length == 0) return rspo.status(401).send({err:"no file found"});
    let imgArray = []
    fileArray.forEach(file => {
      imgArray.push(file.filename);
    });
      try {
        let [row] = await database.query("SELECT username FROM users WHERE id=?",
          [id]
        );
        if(row.length<1) return rspo.status(401).send({err:"No user found"});
        for (let imgfile of imgArray) {
          
        }
        const result = await cloudinary.uploader.upload(imgPath,{
          folder:row[0].username,
          resource_type:"image"
        })
        rspo.status(200).send({pass:"done"})
      } catch (error) {
        await clearTemp(imgArray);
        return rspo.status(500).send({err:"server side error",details:error.message});
      }
}
