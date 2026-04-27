import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath: string): Promise<any> => {
    try {
        if (!localFilePath) return null;

        const response = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_large(
                localFilePath,
                { resource_type: "video" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
        });

        console.log("Cloudinary Response:", response);

        // Safely remove the local file
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return response;
    } catch (error) {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.error("Cloudinary Upload Error:", error);
        return null;
    }
};

export { uploadOnCloudinary };
