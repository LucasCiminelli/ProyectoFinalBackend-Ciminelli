import multer from "multer";
import path from "path";

const storage = (folderName) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, `./src/public/${folderName}`),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  });

export const multerUploader = (folderName) =>
  multer({ storage: storage(folderName) });
