import { uploadOnCloudinary } from "../cloudinary/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const uploadFile = async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  const localFilePath = req.file.path;
  const response = await uploadOnCloudinary(localFilePath);
  console.log(response)

  if (!response) {
    throw new ApiError(500, "Failed to upload file to Cloudinary");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { secure_url: response.secure_url }, "File uploaded successfully"));

};
