import sharp from 'sharp';
import {fileTypeFromBuffer} from 'file-type';
export const CreatePost = async (rkv,rspo) => {
    const MAX_HEIGHT = 8000;
    const MAX_WIDTH = 8000;
    const MAX_PIXELS = 50_000_000;
    const file = rkv.file;
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
    let {id} = rkv.authData;
    console.log(file,id)
    rspo.status(401).send({err:"something went wrong"});
}