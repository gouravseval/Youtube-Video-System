import { Request, Response } from "express";
import { fileService } from "../services/file.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

class UploadController {
    async uploadFile(req: Request, res: Response) {
        const result = await fileService.uploadSingleFile(req.file?.path);

        return res
            .status(200)
            .json(new ApiResponse(200, result, "File uploaded successfully"));
    }
}

export const uploadController = new UploadController();
