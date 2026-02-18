import { database } from '../../Controllers/myConnectionFile.js';
import bcrypt from 'bcrypt';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';
import fs from 'fs';
import path from 'path';
import { Decrypt } from '../../utils/Encryption.js';
import jwt from 'jsonwebtoken';
import { completeRequest } from '../../Controllers/progressTracker.js';


async function checkDuplicate(sqlData, username, email) {

  if (sqlData.some(prv => prv.username === username)) return username;
  if (sqlData.some(prv => prv.email === email)) return email;
}

export const CreateUser = async (rkv, rspo) => {
  const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
  const crntAPI = rkv.originalUrl.split("?")[0];
  const { email, password, username } = rkv.body;
  const file = rkv.file;

  //if (!file) return rspo.status(400).send({ err: "Please upload an Avtar" });

  try {

    let token = rkv.cookies.emailStatus; // this is the Encrypted token
    if (!token) return rspo.status(403).send({err:"Email Cookie is missing"});
    let decryptedToken = await Decrypt(token);
    let tokenData = jwt.decode(decryptedToken,process.env.jwt_sec);
    let decodedTime = Math.floor(Date.now()/1000);
    if (tokenData.exp < decodedTime) return rspo.status(504).send({err:"Your email verification is expire"});
    if (!tokenData.verify) return rspo.status(401).send({err:"We found that your email verifycation is Unauthorise!!!"});
    if (file) { // if file then check it is it a valid image file 
        if (!Buffer.isBuffer(file.buffer)) {
            return rspo.status(400).send({ err: "Invalid file buffer" });
        }

        const MAX_FILE_SIZE = 2 * 1024 * 1024; 
        if (file.buffer.length > MAX_FILE_SIZE) {
            return rspo.status(413).send({ err: "File too large" });
        }

        const type = await fileTypeFromBuffer(file.buffer);
        const allowed = ['image/webp','image/avif']; 
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
        const MAX_PIXELS = 4096 * 4096;

        if (
            metaData.width > MAX_WIDTH ||
            metaData.height > MAX_HEIGHT ||
            metaData.width * metaData.height > MAX_PIXELS
        ) {
            return rspo.status(413).send({ err: "Image is too large" });
        }
    }


    if (!email?.trim() || !username?.trim() || !password?.trim() || username.length<6) {
      return rspo.status(400).send({ err: "Please provide proper information" });
    }

    if (!email.endsWith("@gmail.com") ||
      !/^[A-Za-z0-9][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      return rspo.status(400).send({ err: "Invalid email" });
    }

    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?!.*\s).{6,}$/.test(password)) {
      return rspo.status(400).send({ err: "Password must be strong (6 chars, uppercase, number, symbol)" });
    }


    const [existing] = await database.query(
      "SELECT username,email FROM users WHERE username=? OR email=?",
      [username, email]
    );
    if (existing.length > 0) {
      const duplicate = await checkDuplicate(existing, username, email);
      return rspo.status(302).send({ err: `${duplicate} already has an account` });
    }

    const dir = "./Images/Avtar";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let avatarFileName = "default.webp";
    if (file) {
      avatarFileName = username+Date.now()+file.originalname;
      const avatarPath = path.join(dir, avatarFileName);
      fs.writeFileSync(avatarPath, file.buffer);
    }

    const avatar = `Images/Avtar/${avatarFileName}`;


    const hashPass = await bcrypt.hash(password, 10);
    const createQuery = "INSERT INTO users (username,email,password,avatar) VALUES (?,?,?,?)";
    await database.query(createQuery, [username, email, hashPass, avatar]);

    // Optional: send welcome email
    // await sendTheMail(email, "Welcome to CodeCove🎉", "Welcome", { username });

    rspo.status(201).send({ pass: "Account created successfully" });

    let [crntUser] = await database.query("SELECT id FROM users WHERE username = ?",[username]);
    let uid = crntUser[0].id;
    await database.query("INSERT INTO userActivety_for_achievements (user_id) VALUE (?)",[uid]);

  } catch (error) {
    // anything fails after saving, delete the file
    console.log(error.message)
    if (rkv.file) {
      const avatarFileName = `Images/Avtar/${rkv.file.originalname}`;
      try { fs.unlinkSync(avatarFileName); } catch (err) { console.error(err) };
    }
    rspo.status(500).send({ err: "Something went wrong"});
  } finally {
    completeRequest(crntIP,crntAPI);
  }
};
