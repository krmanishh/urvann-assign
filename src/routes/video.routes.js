import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/publish-video").post(verifyJWT , upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
])  , publishAVideo)
router.route("/update-video/:videoId").patch(verifyJWT , upload.single('video'), updateVideo)
router.route("/get-all-videos").get(getAllVideos)
router.route("/get-video/:videoId").get(getVideoById)
router.route("/delete-video/:videoId").delete(verifyJWT , deleteVideo)
router.route("/toggle-publishStatus/:videoId").patch(verifyJWT , togglePublishStatus)

export default router;