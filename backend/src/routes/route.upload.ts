import { Router, Request, Response, NextFunction } from "express";
import { uploadController } from "../controllers/controller.upload.js";
import { upload } from "../multer/multer.js";

const uploadRoute = Router();

uploadRoute.post("/", upload.single("file"), (req: Request, res: Response, next: NextFunction) => uploadController.uploadFile(req, res).catch(next));
uploadRoute.post("/single", upload.single("file"), (req: Request, res: Response, next: NextFunction) => uploadController.uploadFile(req, res).catch(next));

export { uploadRoute };
