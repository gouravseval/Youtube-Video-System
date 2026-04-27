import { Request, Response } from "express";
import { videoService } from "../services/video.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Readable } from "stream";

class VideoController {
    async streamVideo(req: Request, res: Response) {
        const id = req.params.id as string;
        const video = await videoService.getVideoById(id);

        const range = req.headers.range;

        try {
            const headers: Record<string, string> = {};
            if (range) {
                headers['Range'] = range;
            }

            const response = await fetch(video.link, {
                headers: headers
            });

            const responseHeaders: Record<string, string> = {
                'Content-Type': response.headers.get('Content-Type') || 'video/mp4',
                'Accept-Ranges': 'bytes',
            };

            if (response.headers.has('Content-Length')) {
                responseHeaders['Content-Length'] = response.headers.get('Content-Length')!;
            }
            if (response.headers.has('Content-Range')) {
                responseHeaders['Content-Range'] = response.headers.get('Content-Range')!;
            }

            res.writeHead(response.status, responseHeaders);

            if (response.body) {
                Readable.fromWeb(response.body as any).pipe(res);
            } else {
                res.end();
            }
        } catch (error) {
            console.error("Streaming Error:", error);
            res.status(500).json({ message: "Failed to stream video" });
        }
    }

    async getAllVideos(req: Request, res: Response) {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;

        const videos = await videoService.getAllVideos({ page, limit });

        return res
            .status(200)
            .json(new ApiResponse(200, videos, "Videos fetched successfully"));
    }

    async getVideoById(req: Request, res: Response) {
        const id = req.params.id as string;
        const video = await videoService.getVideoById(id);

        return res
            .status(200)
            .json(new ApiResponse(200, video, "Video fetched successfully"));
    }

    async uploadVideo(req: Request, res: Response) {
        const video = await videoService.uploadVideo({
            name: req.body.name,
            localFilePath: req.file?.path,
            originalName: req.file?.originalname,
            userId: (req as any).user?.id,
        });

        return res
            .status(201)
            .json(new ApiResponse(201, video, "Video uploaded successfully"));
    }

    async deleteVideo(req: Request, res: Response) {
        const id = req.params.id as string;
        await videoService.deleteVideo(id);

        return res
            .status(200)
            .json(new ApiResponse(200, null, "Video deleted successfully"));
    }

    async createVideo(req: Request, res: Response) {
        const video = await videoService.createVideo({
            name: req.body.name,
            link: req.body.link,
            userId: (req as any).user?.id,
        });

        return res
            .status(201)
            .json(new ApiResponse(201, video, "Video created successfully"));
    }
}

export const videoController = new VideoController();
