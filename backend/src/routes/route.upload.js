import { Router } from "express";
import { uploadController } from "../controllers/controller.upload.js";
import { upload } from "../multer/multer.js";

const uploadRoute = Router();

uploadRoute.post("/", upload.single("file"), (req, res, next) => uploadController.uploadFile(req, res).catch(next));
uploadRoute.post("/single", upload.single("file"), (req, res, next) => uploadController.uploadFile(req, res).catch(next));

export { uploadRoute };


