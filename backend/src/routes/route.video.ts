import { Router, Request, Response, NextFunction } from "express";
import { videoController } from "../controllers/controller.video.js";
import { upload } from "../multer/multer.js";

export const videoRoutes = Router();

videoRoutes.get("/", (req: Request, res: Response, next: NextFunction) => videoController.getAllVideos(req, res).catch(next));
videoRoutes.get("/:id", (req: Request, res: Response, next: NextFunction) => videoController.getVideoById(req, res).catch(next));
videoRoutes.get("/stream/:id", (req: Request, res: Response, next: NextFunction) => videoController.streamVideo(req, res).catch(next));

videoRoutes.post("/", (req: Request, res: Response, next: NextFunction) => videoController.createVideo(req, res).catch(next));
videoRoutes.post("/upload", upload.single("video"), (req: Request, res: Response, next: NextFunction) => videoController.uploadVideo(req, res).catch(next));
videoRoutes.delete("/:id", (req: Request, res: Response, next: NextFunction) => videoController.deleteVideo(req, res).catch(next));
