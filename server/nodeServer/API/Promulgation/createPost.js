import {v2 as cloudinary} from 'cloudinary';
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
    let {user_id} = rkv.authData;
    let {caption, canComment, canSave, tags, post_moment, moderationLevel, likeCount: showLikesCount, visibility} = rkv.body || {};
    let imgArray = [];
    // console.log(canSave)
    try {
       console.log("here")
      if (fileArray.length === 0 ) return rspo.status(400).send({err:"No file Found"});
      fileArray.forEach(file => {
        imgArray.push(file.filename);
      });
      const validationError = "ValidationFaild"
      const allowedCategories = [
        "memes", "miniblog", "wip", "til"
      ];
      const boolValues = ["true","false"];

      if (!boolValues.includes(canComment) || !boolValues.includes(canSave)) throw new Error("BoolendError");
      
      if (!allowedCategories.includes(post_moment)) throw new Error(validationError);;
      

      console.log(typeof canComment, showLikesCount);
      const toBool = (v) => v === "true" ? 1 : 0;

      const normalized = {
        canComment: toBool(canComment),
        likeCount: toBool(showLikesCount),
      };

    
      const window = new JSDOM('').window;
      const DOMpurify = createDOMPurify(window);
      const sanitiz = (str)=> DOMpurify.sanitize(str);
      caption = sanitiz(caption)
      let [row] = await database.query("SELECT username FROM users WHERE user_id=?",
        [user_id]
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
        (post_id, user_id, images_url, caption, moderationLevel, visibility, canComment, likeCount, canSave, post_moment) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          post_id,
          user_id,
          JSON.stringify(cloudLiks),
          caption,
          parseInt(moderationLevel),
          visibility,
          normalized.canComment,
          normalized.showLikesCount,
          canSave,
          post_moment
        ]
      );

      
      rspo.status(201).send({pass:"Your Post is POst", postData:{post_id,user_id,cloudLiks,caption,moderationLevel,visibility, canComment,likeCount: showLikesCount, canSave, post_moment}})

    } catch (error) {
        console.log(error)
        await clearTemp(imgArray);
        return rspo.status(500).send({err:"server side error"});
    } finally {
        completeRequest(crntIP,crntAPI)
    }
} 