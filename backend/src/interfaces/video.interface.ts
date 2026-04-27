import { Video } from "../models/video.entity.js";

export interface IVideoCreate {
    name: string;
    link: string;
    userId?: string;
}

export interface IVideoUpload {
    name: string;
    localFilePath?: string;
    originalName?: string;
    userId?: string;
}

export interface IVideoService {
    getAllVideos(options: { page?: number; limit?: number }): Promise<Video[]>;
    getVideoById(id: string): Promise<Video>;
    uploadVideo(data: IVideoUpload): Promise<Video>;
    deleteVideo(id: string): Promise<boolean>;
    createVideo(data: IVideoCreate): Promise<Video>;
}
