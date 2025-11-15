import multer from 'multer';
import path from 'path';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Images/temp"); // temp folder
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

export const diskUpload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
});