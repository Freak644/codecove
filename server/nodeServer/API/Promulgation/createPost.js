import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { FileChecker, safeUnlink } from './fileChecker.js';
import  {nanoid} from 'nanoid';
import { database } from '../../Controllers/myConnectionFile.js';
import createDOMPurify, { clearConfig } from 'isomorphic-dompurify';
import {JSDOM} from 'jsdom';
import https from 'https';
import pLimit from 'p-limit';
import { completeRequest } from '../../Controllers/src/middleware/progressTracker.js';
dotenv.config();
cloudinary.config({
  cloud_name:process.env.cloudinary_name,
  api_key: process.env.cloudinary_key,
  api_secret: process.env.cloudinary_sec,
  http_agent: new https.Agent({ keepAlive: true, maxSockets: 5 })
})




const dir = path.join(process.cwd(), "Images", "temp");

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}
const clearTemp = async (currentFiles) => {
  for (let file of currentFiles) {
    let imgPath = path.join(dir,file);
    await fs.promises.unlink(imgPath);
  }
  console.log("tempFile Clear")
}

export const CreatePost = async (rkv,rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    const upLoadLimit = pLimit(2);
    const fileArray = rkv.files;
    let {id} = rkv.authData;
    let {Absuse, Link, Spam, Violence, canComment, canSave, caption, likeCount, visibility, postGroup} = rkv.body;
    let imgArray = [];
    // console.log(canSave)
    try {
      if (fileArray.length === 0 ) return rspo.status(400).send({err:"No file Found"});
      fileArray.forEach(file => {
        imgArray.push(file.filename);
      });
      const validationError = "ValidationFaild"
      const allowedCategories = [
        "Bugs","TIL","Snippets","Mini Blog","Setup Showcase",
        "QuickTips","Meme","WIP"
      ];
      const allowedSave = ["Everyone","Follower","false"];
      const boolValues = ["true","false"];

      if (!boolValues.includes(canComment)) throw new Error("BoolendError");
      ;
      if (!allowedSave.includes(canSave)) throw new Error("canSaveBoolError");
      if (!allowedCategories.includes(postGroup)) throw new Error(validationError);;
      if (!boolValues.includes(visibility)) throw new Error(validationError);;

      //const payload = { Absuse, Link, Spam, Violence, canComment, canSave, likeCount, visibility, postGroup };

      const toBool = (v) => v === "true" ? 1 : 0;

      const normalized = {
        canComment: toBool(canComment),
        likeCount: toBool(likeCount),
        visibility: toBool(visibility)
      };

    
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
      console.log("here")
      const uploadImage = fileArray.map(crntImg=>
          upLoadLimit(async ()=>{
            const result = await cloudinary.uploader.upload(
              crntImg.path,
              {
                folder: row[0].username,
                transformation: [
                  {quality: "auto", fetch_format: "auto"},
                  {width: 800, crop: "scale"}
                ]
              }
            )
            await safeUnlink(crntImg.path)
            console.log("here2")
            return result.secure_url;})
      )

      const cloudLiks = await Promise.all(uploadImage)
   
      let post_id = nanoid();
      await database.query(
        `INSERT INTO posts 
        (post_id, id, images_url, caption, blockCat, visibility, canComment, likeCount, canSave, post_moment) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          post_id,
          id,
          JSON.stringify(cloudLiks),
          caption,
          JSON.stringify({ Absuse, Spam, Link, Violence }),
          normalized.visibility,
          normalized.canComment,
          normalized.likeCount,
          canSave,
          postGroup
        ]
      );

      
      rspo.status(201).send({pass:"Your Post is POst", postData:{post_id,id,cloudLiks,caption,blockCat:{Absuse,Spam,Link,Violence},visibility:visibility == "true" ? 1 : 0, canComment: canComment === "true" ? 1 : 0,likeCount: likeCount == "true" ? 1 : 0, canSave, postGroup}})

    } catch (error) {
        console.log(error)
        await clearTemp(imgArray);
        return rspo.status(500).send({err:"server side error"});
    } finally {
        completeRequest(crntIP,crntAPI)
    }
} 