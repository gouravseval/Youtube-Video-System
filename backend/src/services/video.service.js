import { AppDataSource } from "../db/data-source.js";
import { VideoEntity } from "../models/video.entity.js";
import { uploadOnCloudinary } from "../cloudinary/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";

class VideoService {
    constructor() {
        this.videoRepository = AppDataSource.getRepository(VideoEntity);
    }

    async getAllVideos({ page = 1, limit = 12 }) {
        const skip = (page - 1) * limit;

        const videos = await this.videoRepository.find({
            order: { createdAt: "DESC" },
            skip: skip,
            take: limit,
        });

        return videos;
    }

    async getVideoById(id) {
        if (!id) {
            throw new ApiError(400, "Video ID is required");
        }

        const video = await this.videoRepository.findOneBy({ id });
        if (!video) {
            throw new ApiError(404, "Video not found");
        }

        return video;
    }

    async uploadVideo({ name, localFilePath, originalName, userId }) {
        if (!name || name.trim() === "") {
            throw new ApiError(400, "Video name is required");
        }

        if (!localFilePath) {
            throw new ApiError(400, "No video file uploaded");
        }

        const response = await uploadOnCloudinary(localFilePath);

        if (!response) {
            throw new ApiError(500, "Failed to upload video to Cloudinary");
        }

        const video = this.videoRepository.create({
            name,
            fileName: originalName,
            link: response.secure_url,
            user_id: userId,
        });
        await this.videoRepository.save(video);

        return video;
    }

    async deleteVideo(id) {
        if (!id) {
            throw new ApiError(400, "Video ID is required");
        }

        const video = await this.videoRepository.findOneBy({ id });
        if (!video) {
            throw new ApiError(404, "Video not found");
        }

        await this.videoRepository.remove(video);
        return true;
    }

    async createVideo({ name, link, userId }) {
        if (!name || !link) {
            throw new ApiError(400, "Name and link are required");
        }

        const video = this.videoRepository.create({
            name,
            link,
            fileName: name,
            user_id: userId,
        });
        await this.videoRepository.save(video);

        return video;
    }
}

export const videoService = new VideoService();
