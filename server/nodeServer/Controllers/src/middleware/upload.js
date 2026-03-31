import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /avif|webp|gif/;
  const ext = file.mimetype.split("/")[1];

  if (allowed.test(ext)) cb(null, true);
  else cb(new Error("Invalid file type"), false);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }
});