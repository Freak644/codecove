import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const Encrypt = async (plainText) => {
    console.log("KEY OK:", Buffer.from(process.env.encryption_Key, "hex").length === 32);
    const key = Buffer.from(process.env.encryption_Key,"hex"); 
    const iv = crypto.randomBytes(12); 

    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

    let encrypted = cipher.update(plainText, "utf8");
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    const tag = cipher.getAuthTag();

    return `${iv.toString("hex")}:${encrypted.toString("hex")}:${tag.toString("hex")}`;
};

const Decrypt = async (token) => {
    const [ivHex, encryptedHex, tagHex] = token.split(":");

    const key = Buffer.from(process.env.encryption_Key,"hex");
    const iv = Buffer.from(ivHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");
    const tag = Buffer.from(tagHex, "hex");

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString("utf8");
};

export { Encrypt, Decrypt };