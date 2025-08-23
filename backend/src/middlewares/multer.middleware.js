import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${randomUUID()}${ext}`);
  }
});

export const upload = multer({ storage });

