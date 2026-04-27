import { Router } from "express";
import { uploadFile } from "../controllers/controller.upload.js";
import { upload } from "../multer/multer.js";

const uploadRoute = Router();

uploadRoute.post("/", upload.single("file"), uploadFile);
uploadRoute.post("/single", upload.single("file"), uploadFile);

export { uploadRoute };

