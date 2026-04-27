import { uploadOnCloudinary } from "../cloudinary/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";

class FileService {
    async uploadSingleFile(localFilePath) {
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
