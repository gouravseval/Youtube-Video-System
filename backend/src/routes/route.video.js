import { Router } from "express";
import { videoController } from "../controllers/controller.video.js";
import { upload } from "../multer/multer.js";

export const videoRoutes = Router();

videoRoutes.get("/", (req, res, next) => videoController.getAllVideos(req, res).catch(next));
videoRoutes.get("/:id", (req, res, next) => videoController.getVideoById(req, res).catch(next));
videoRoutes.get("/stream/:id", (req, res, next) => videoController.streamVideo(req, res).catch(next));

videoRoutes.post("/", (req, res, next) => videoController.createVideo(req, res).catch(next));
videoRoutes.post("/upload", upload.single("video"), (req, res, next) => videoController.uploadVideo(req, res).catch(next));
videoRoutes.delete("/:id", (req, res, next) => videoController.deleteVideo(req, res).catch(next));