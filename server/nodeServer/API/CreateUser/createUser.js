import { database } from '../../Controllers/myConnectionFile.js';
import bcrypt from 'bcrypt';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';
import fs from 'fs';
import path from 'path';
import { completeRequest } from '../../Controllers/src/middleware/progressTracker.js';
import redis from '../../Controllers/src/config/redis.js';
import {v4 as uuidV4} from 'uuid'
import { getAvatarPath } from '../../utils/getImagePath.js';


async function checkDuplicate(sqlData, username, email) {

  if (sqlData.some(prv => prv.username === username)) return username;
  if (sqlData.some(prv => prv.email === email)) return email;
}


export const CreateUser = async (rkv, rspo) => {
  const crntIP = rkv.userIp;
  const crntAPI = rkv.originalUrl.split("?")[0];
  let { email, password, username } = rkv.body || {};
  const file = rkv.file;

  let newUserID = uuidV4();
  const { dir, filePath } = getAvatarPath(newUserID);
  //if (!file) return rspo.status(400).send({ err: "Please upload an Avtar" });
  try {

    let isValid = await redis.exists(`emailVerified:${email}`);
    if (!isValid) {
      return rspo.status(401).send({err:"Your Email Verification is not Valid Or Expired"})
    }

    if (file) { // if file then check it is it a valid image file 
        if (!Buffer.isBuffer(file.buffer)) {
            return rspo.status(400).send({ err: "Invalid file buffer" });
        }

        const MAX_FILE_SIZE = 2 * 1024 * 1024; 
        if (file.buffer.length > MAX_FILE_SIZE) {
            return rspo.status(413).send({ err: "File too large" });
        }

        const type = await fileTypeFromBuffer(file.buffer);
        const allowed = ['image/webp','image/avif','image/gif']; 
        if (!type || !allowed.includes(type.mime)) {
            return rspo.status(400).send({ err: "Invalid file type" });
        }

        let metaData;
        try {
            metaData = await sharp(file.buffer).metadata();
        } catch (err) {
            return rspo.status(400).send({ err: "Invalid or corrupted image" });
        }

        if (!metaData.width || !metaData.height) {
            return rspo.status(400).send({ err: "Can't read image dimensions" });
        }

        const MAX_WIDTH = 4096;
        const MAX_HEIGHT = 4096;
        const MAX_PIXELS = 16 * 1024 * 1024;

        if (
            metaData.width > MAX_WIDTH ||
            metaData.height > MAX_HEIGHT ||
            metaData.width * metaData.height > MAX_PIXELS
        ) {
            return rspo.status(413).send({ err: "Image is too large" });
        }
    }


    if (!email || !username || !password || !email?.trim() || !username?.trim() || !password?.trim() || username.length<6) {
      return rspo.status(400).send({ err: "Please provide proper information" });
    }

    if (!email.endsWith("@gmail.com") ||
      !/^[A-Za-z0-9][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      return rspo.status(400).send({ err: "Invalid email" });
    }

    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?!.*\s).{6,}$/.test(password)) {
      return rspo.status(400).send({ err: "Password must be strong (6 chars, uppercase, number, symbol)" });
    }
    username = String(username).toLowerCase();
    let isUsername = await redis.sIsMember(`all:usernames`,username)  
    let isEmail = await redis.sIsMember(`all:emails`,email);
    if (isUsername) {
      return rspo.status(302).send({ err: `${username} already has an account` });
    }
    if (isEmail) {
      return rspo.status(302).send({ err: `${email} already has an account` });
    }

    const [existing] = await database.query(
      "SELECT username,email FROM users WHERE username=? OR email=?",
      [username, email]
    );
    if (existing.length > 0) {
      const duplicate = await checkDuplicate(existing, username, email);
      return rspo.status(302).send({ err: `${duplicate} already has an account` });
    }


// ✅ ensure directory exists
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
  
    let avatar = null;

    if (file) {
      // ✅ convert to optimized webp
      await sharp(file.buffer)
        .resize(256, 256, { fit: "cover" }) // avatar base size
        .webp({ quality: 80 })
        .toFile(filePath);

      // ✅ clean API path (NO username, NO folders)
      avatar = `/myServer/avatar/${newUserID}`;
    }

    const hashPass = await bcrypt.hash(password, 10);
    await redis.sAdd("all:usernames",username);
    await redis.sAdd("all:emails",email)
    await database.query(
      "INSERT INTO users (id,username,email,password,avatar) VALUES (?,?,?,?,COALESCE(?, DEFAULT(avatar)))",
      [newUserID, username, email, hashPass, avatar]
    );
    
    // Optional: send welcome email
    // await sendTheMail(email, "Welcome to Echo🎉", "Welcome", { username });

    rspo.status(201).send({ pass: "Account created successfully" });


    //await database.query("INSERT INTO userActivety_for_achievements (user_id) VALUE (?)",[uid]);
    await database.query("INSERT INTO roles (user_id, permoter_id) VALUES (?,?);",[newUserID,"System"]);
   
  } catch (error) {
    // anything fails after saving, delete the file
    console.log(error.message)
    if (rkv.file) {
      
      try { fs.unlinkSync(filePath); } catch (err) { console.error(err) };
    }
    rspo.status(500).send({ err: "Something went wrong"});
  } finally {
    completeRequest(crntIP,crntAPI);
  }
};
