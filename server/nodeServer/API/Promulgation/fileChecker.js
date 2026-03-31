import sharp from "sharp";
import fs from "fs";
import { fileTypeFromBuffer } from "file-type";

const MAX_HEIGHT = 8000;
const MAX_WIDTH = 8000;
const MAX_PIXELS = 50_000_000;

export const FileChecker = async (filePath, fileSize) => {
  const sizeMB = fileSize / (1024 * 1024);
  if (sizeMB > 3) {
    return { err: "file.size <= 3MB" };
  }


  const buffer = await fs.promises.readFile(filePath);
  const type = await fileTypeFromBuffer(buffer);
  if (!type || !["image/png", "image/jpg", "image/jpeg"].includes(type.mime)) {
    return { err: "Invalid file type" };
  }


  const metaData = await sharp(filePath).metadata();
  if (!metaData.width || !metaData.height) {
    return { err: "can't read image dimensions" };
  }

  if (
    metaData.width > MAX_WIDTH ||
    metaData.height > MAX_HEIGHT ||
    metaData.width * metaData.height > MAX_PIXELS
  ) {
    return { err: "Image is too large" };
  }

  return true;
};
