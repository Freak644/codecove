import { database } from '../../Controllers/myConnectionFile.js';
import bcrypt from 'bcrypt';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';
import fs from 'fs';
import path from 'path';
import { completeRequest } from '../../Controllers/progressTracker.js';

async function checkDuplicate(sqlData, username, email) {
  if (sqlData.some(prv => prv.username === username)) return username;
  if (sqlData.some(prv => prv.email === email)) return email;
}

export const CreateUser = async (rkv, rspo) => {
  const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
  const crntAPI = rkv.originalUrl.split("?")[0];
  const MAX_WIDTH = 8000;
  const MAX_HEIGHT = 8000;
  const MAX_PIXELS = 50_000_000;

  const { email, password, username } = rkv.body;
  const file = rkv.file;

  //if (!file) return rspo.status(400).send({ err: "Please upload an Avtar" });

  try {
    // 1️⃣ Validate file type
    if (file) {
        const type = await fileTypeFromBuffer(file.buffer);
        if (!type || !['image/png', 'image/jpg', 'image/jpeg'].includes(type.mime)) {
          return rspo.status(400).send({ err: "Invalid file type" });
        }

        // 2️⃣ Validate image dimensions
        const metaData = await sharp(file.buffer).metadata();
        if (!metaData.width || !metaData.height) {
          return rspo.status(400).send({ err: "Can't read image dimensions" });
        }
        if (
          metaData.width > MAX_WIDTH ||
          metaData.height > MAX_HEIGHT ||
          metaData.width * metaData.height > MAX_PIXELS
        ) {
          return rspo.status(413).send({ err: "Image is too large" });
        }
    }

    // 3️⃣ Validate user input
    if (!email?.trim() || !username?.trim() || !password?.trim()) {
      return rspo.status(400).send({ err: "Please provide proper information" });
    }

    if (!email.endsWith("@gmail.com") ||
      !/^[A-Za-z0-9][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      return rspo.status(400).send({ err: "Invalid email" });
    }

    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?!.*\s).{6,}$/.test(password)) {
      return rspo.status(400).send({ err: "Password must be strong (6 chars, uppercase, number, symbol)" });
    }

    // 4️⃣ Check duplicates
    const [existing] = await database.query(
      "SELECT username,email FROM users WHERE username=? OR email=?",
      [username, email]
    );
    if (existing.length > 0) {
      const duplicate = await checkDuplicate(existing, username, email);
      return rspo.status(302).send({ err: `${duplicate} already has an account` });
    }

    // 5️⃣ All validations passed → Save the file
    const dir = "./Images/Avtar";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let avatarFileName = "default.png";
    if (file) {
      avatarFileName = Date.now()+"-"+file.originalname;
      const avatarPath = path.join(dir, avatarFileName);
      fs.writeFileSync(avatarPath, file.buffer);
    }

    const avatar = `Images/Avtar/${avatarFileName}`;

    // 6️⃣ Hash password and save user
    const hashPass = await bcrypt.hash(password, 10);
    const createQuery = "INSERT INTO users (username,email,password,avatar) VALUES (?,?,?,?)";
    await database.query(createQuery, [username, email, hashPass, avatar]);

    // Optional: send welcome email
    // await sendTheMail(email, "Welcome to CodeCove🎉", "Welcome", { username });

    rspo.status(201).send({ pass: "Account created successfully" });

  } catch (error) {
    // anything fails after saving, delete the file
    if (rkv.file) {
      const avatarFileName = `Images/Avtar/${rkv.file.originalname}`;
      try { fs.unlinkSync(avatarFileName); } catch (err) { console.error(err) };
    }
    rspo.status(500).send({ err: "Something went wrong", details: error.message });
  }finally{
    completeRequest(crntIP,crntAPI);
  }
};
