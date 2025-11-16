import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { FileChecker } from './fileChecker.js';
import  {nanoid} from 'nanoid';
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
    let {Visibility, Comment, Like, Save, Caption, Absuse, Spam, Link, Violence} = rkv.body;
    let imgArray = []
    fileArray.forEach(file => {
      imgArray.push(file.filename);
    });
      try {
        const cloudLiks = [];
        let [row] = await database.query("SELECT username FROM users WHERE id=?",
          [id]
        );
        if(row.length<1) {
          await clearTemp(imgArray);
          return rspo.status(401).send({err:"No user found"});}
        for (const crntImg of rkv.files) {
          let rekvst = await FileChecker(crntImg.path,crntImg.size);
          if (rekvst.err) {
            await clearTemp(imgArray);
            return rspo.status(400).send(rekvst.err);
          }
          const cloudRkv = await cloudinary.uploader.upload(crntImg.path, { folder: row[0].username });
          cloudLiks.push(cloudRkv.secure_url);
          await fs.promises.unlink(crntImg.path);
        }
        let post_id = nanoid();
        await database.query("INSERT INTO posts (post_id, id, images_url, caption, blockCat, visibility, comment, showcount, saveop) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [post_id, id, JSON.stringify(cloudLiks), Caption, JSON.stringify({Absuse,Spam,Link,Violence}), Visibility ? 1 : 0, Comment ? 1 : 0,Like ? 1 : 0, Save ? 1 : 0]
        )
        rspo.status(200).send({pass:"post created"})
      } catch (error) {
        console.log(error.message)
        return rspo.status(500).send({err:"server side error",details:error.message});
      }
}
