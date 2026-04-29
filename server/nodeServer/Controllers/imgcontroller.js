import { getAvatarPath } from "../utils/getImagePath.js";

import path from "path";
import { getTheCache } from "./src/services/finalImageCache.js";
const getAvatar = async (req, res) => {
  try {
    const userId = req.params.id;
    const size = parseInt(req.query.size) || 100;

    const { filePath } = getAvatarPath(userId)
    const finalPath = await getTheCache(filePath,size)

    res.set("Cache-Control", "public, max-age=31536000, immutable");
    res.sendFile(path.resolve(finalPath));
  } catch (err) {
    console.log(err.message)
    res.status(404).send("Image not found");
  }
};

export {getAvatar}