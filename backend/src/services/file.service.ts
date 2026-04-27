import { uploadOnCloudinary } from "../cloudinary/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";

interface IFileService {
    uploadSingleFile(localFilePath?: string): Promise<{ secure_url: string }>;
}

class FileService implements IFileService {
    async uploadSingleFile(localFilePath?: string): Promise<{ secure_url: string }> {
        if (!localFilePath) {
            throw new ApiError(400, "No file provided");
        }

        const response = await uploadOnCloudinary(localFilePath);

        if (!response) {
            throw new ApiError(500, "Failed to upload file to Cloudinary");
        }

        return { secure_url: response.secure_url };
    }
}

export const fileService = new FileService();
