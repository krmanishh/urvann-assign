import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import { publishAVideo, updateVideo } from "../controllers/video.controller";

const router = Router();

router.route("/publish-video").post(upload.single('video'), publishAVideo)
router.route("/update-video").post(upload.single('video'), updateVideo)

