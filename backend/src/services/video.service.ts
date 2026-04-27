import { AppDataSource } from "../db/data-source.js";
import { Video } from "../models/video.entity.js";
import { uploadOnCloudinary } from "../cloudinary/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { IVideoService, IVideoCreate, IVideoUpload } from "../interfaces/video.interface.js";
import { Repository } from "typeorm";

class VideoService implements IVideoService {
    private videoRepository: Repository<Video>;

    constructor() {
        this.videoRepository = AppDataSource.getRepository(Video);
    }

    async getAllVideos({ page = 1, limit = 12 }: { page?: number; limit?: number }): Promise<Video[]> {
        const skip = (page - 1) * limit;

        const videos = await this.videoRepository.find({
            order: { createdAt: "DESC" as any },
            skip: skip,
            take: limit,
        });

        return videos;
    }

    async getVideoById(id: string): Promise<Video> {
        if (!id) {
            throw new ApiError(400, "Video ID is required");
        }

        const video = await this.videoRepository.findOneBy({ id });
        if (!video) {
            throw new ApiError(404, "Video not found");
        }

        return video;
    }

    async uploadVideo({ name, localFilePath, originalName, userId }: IVideoUpload): Promise<Video> {
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

    async deleteVideo(id: string): Promise<boolean> {
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

    async createVideo({ name, link, userId }: IVideoCreate): Promise<Video> {
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
