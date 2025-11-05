import sharp from 'sharp';
import {fileTypeFromBuffer} from 'file-type';
import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
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
export const CreatePost = async (rkv,rspo) => {
    const MAX_HEIGHT = 8000;
    const MAX_WIDTH = 8000;
    const MAX_PIXELS = 50_000_000;
    const file = rkv.file;
    if (!file) return rspo.status(401).send({err:"no file found"});
    let size = file.size / (1024 * 1024);
    if (size > 5) {
      return rspo.status(401).send({err:"file.size<=5MB"})
    }
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
    const imgPath = path.join(dir,file.originalname);
    await fs.promises.writeFile(imgPath,file.buffer)
    let {id} = rkv.authData;
    try {
      const result = await cloudinary.uploader.upload(imgPath,{
        folder:`user-${id}`,
        resource_type:"image"
      })
      await fs.promises.unlink(imgPath);
      rspo.status(200).send({pass:"done boss ",miniData:result.secure_url}) 
    } catch (error) {
      await fs.promises.unlink(imgPath)
      rspo.status(500).send({err:"server side error",details:error.message});
    }
}