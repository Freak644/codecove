import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { FileChecker } from './fileChecker.js';
import  {nanoid} from 'nanoid';
import { database } from '../../Controllers/myConnectionFile.js';
import createDOMPurify from 'isomorphic-dompurify';
import {JSDOM} from 'jsdom';
import { userInfo } from 'os';
import https from 'https';
import plimit from "p-limit";
import pLimit from 'p-limit';
import { completeRequest } from '../../Controllers/progressTracker.js';
dotenv.config();
cloudinary.config({
  cloud_name:process.env.cloudinary_name,
  api_key: process.env.cloudinary_key,
  api_secret: process.env.cloudinary_sec,
  http_agent: new https.Agent({ keepAlive: true, maxSockets: 5 })
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
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    const upLoadLimit = pLimit(2);
    const fileArray = rkv.files;
    let {id} = rkv.authData;
    let {Absuse, Link, Spam, Violence, canComment, canSave, caption, likeCount, visibility, postGroup} = rkv.body;
    let imgArray = [];
    
    try {
      if (fileArray.length === 0 ) return rspo.status(400).send({err:"No file Found"});
      fileArray.forEach(file => {
        imgArray.push(file.filename);
      });

      const acceptOp = [
        "true","false","Bugs","TIL","Snippets","Mini Blog","Setup Showcase",
        "QuickTips","Meme","WIP","Everyone","Follower"
      ];
      const payload = { Absuse, Link, Spam, Violence, canComment, canSave, likeCount, visibility, postGroup };

      for (let key in payload) {
        let value = payload[key];

        if (!acceptOp.includes(value)) {
          await clearTemp(imgArray);
          return rspo.status(400).send({ err: "Bad Request: invalid value in " + key });
        }
      }
      const window = new JSDOM('').window;
      const DOMpurify = createDOMPurify(window);
      const sanitiz = (str)=> DOMpurify.sanitize(str);
      caption = sanitiz(caption)
      let [row] = await database.query("SELECT username FROM users WHERE id=?",
        [id]
      );
      if(row.length<1) {
        await clearTemp(imgArray);
        return rspo.status(401).send({err:"No user found"});
      }

      for (const crntImg of fileArray) {
        let rekvst = await FileChecker(crntImg.path,crntImg.size);
        if (rekvst.err) {
          await clearTemp(imgArray);
          return rspo.status(400).send(rekvst.err);
        }
      }

      const uploadImage = fileArray.map(crntImg=>
          upLoadLimit(async ()=>{
            const result = await cloudinary.uploader.upload(
              crntImg.path,
              {
                folder: row[0].username,
                transformation:[{quality:"auto"}]
              }
            )
            await fs.promises.unlink(crntImg.path)
            return result.secure_url;})
      )

      const cloudLiks = await Promise.all(uploadImage)
   
      let post_id = nanoid();
      await database.query("INSERT INTO posts (post_id, id, images_url, caption, blockCat, visibility, canComment, likeCount, canSave, post_moment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [post_id, id, JSON.stringify(cloudLiks), caption, JSON.stringify({Absuse,Spam,Link,Violence}), visibility == "true" ? 1 : 0, canComment == "true" ? 1 : 0,likeCount == "true" ? 1 : 0, canSave, postGroup]
      )

      
      rspo.status(201).send({err:"Your Post is POst"})

    } catch (error) {
        //console.log(error)
        await clearTemp(imgArray);
        return rspo.status(500).send({err:"server side error"});
    } finally {
        completeRequest(crntIP,crntAPI)
    }
} 