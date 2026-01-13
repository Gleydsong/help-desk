import path from "path";
import multer from "multer";
import { env } from "./env";

const uploadDir = path.resolve(env.UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${unique}-${safeName}`);
  }
});

export const uploadConfig = {
  directory: uploadDir,
  storage
};
