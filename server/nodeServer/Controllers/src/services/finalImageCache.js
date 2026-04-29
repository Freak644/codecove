import sharp from "sharp";
import fs from "fs";
import path from "path";

const CACHE_BASE = path.join(process.cwd(), "Images", "avatars", "cache");


const getTheCache = async (originalPath, size) => {
    
  const fileName = path.basename(originalPath); // <userId>.webp
  // clamp size (security + sanity)
  const safeSize = Math.min(Math.max(size, 32), 512);

  // cache file name
  const cacheName = `${safeSize}-${fileName}`;

  // hashed cache structure (same logic as original)
  const userId = fileName.split(".")[0];
  const a = userId.slice(0, 2);
  const b = userId.slice(2, 4);

  const cacheDir = path.join(CACHE_BASE, a, b);
  const cachePath = path.join(cacheDir, cacheName);

  // 1. return if cached
  if (fs.existsSync(cachePath)) {
    return cachePath;
  }

  //  2. check original exists
  if (!fs.existsSync(originalPath)) {
    throw new Error("Original image not found");
  }

  //  3. ensure cache dir exists
  if (!fs.existsSync(cacheDir)) {
    await fs.promises.mkdir(cacheDir, { recursive: true });
  }

  //  4. resize + optimize
  await sharp(originalPath)
    .resize(safeSize, safeSize, { fit: "cover" })
    .webp({ quality: 75 })
    .toFile(cachePath);

   
  return cachePath;
};

export {getTheCache}