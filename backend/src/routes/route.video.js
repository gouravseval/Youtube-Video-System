import { Router } from "express";
import {
  getAllVideos,
  getVideoById,
  streamVideo,
  uploadVideo,
  deleteVideo,
  createVideo,

} from "../controllers/controller.video.js";
import { upload } from "../multer/multer.js";

export const videoRoutes = Router();

videoRoutes.get("/", getAllVideos);
videoRoutes.get("/:id", getVideoById);
videoRoutes.get("/stream/:id", streamVideo);

videoRoutes.post("/", createVideo);
videoRoutes.post("/upload", upload.single("video"), uploadVideo);
videoRoutes.delete("/:id", deleteVideo);