import { AppDataSource } from "../db/data-source.js";
import { VideoEntity } from "../models/video.entity.js";
import { uploadOnCloudinary } from "../cloudinary/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Readable } from "stream";

const videoRepository = AppDataSource.getRepository(VideoEntity);

export const streamVideo = async (req, res) => {
  const { id } = req.params;
  const video = await videoRepository.findOneBy({ id });
  if (!video) throw new ApiError(404, "Video not found");

  const range = req.headers.range;

  try {
    const headers = {};
    if (range) {
      headers['Range'] = range;
    }

    const response = await fetch(video.link, {
      headers: headers
    });

    const responseHeaders = {
      'Content-Type': response.headers.get('Content-Type') || 'video/mp4',
      'Accept-Ranges': 'bytes',
    };

    if (response.headers.has('Content-Length')) {
      responseHeaders['Content-Length'] = response.headers.get('Content-Length');
    }
    if (response.headers.has('Content-Range')) {
      responseHeaders['Content-Range'] = response.headers.get('Content-Range');
    }

    res.writeHead(response.status, responseHeaders);

    if (response.body) {
      Readable.fromWeb(response.body).pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    console.error("Streaming Error:", error);
    res.status(500).json({ message: "Failed to stream video" });
  }
};


export const getAllVideos = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const videos = await videoRepository.find({
    order: { createdAt: "DESC" },
    skip: skip,
    take: limit,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
};


export const getVideoById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Video ID is required");
  }

  const video = await videoRepository.findOneBy({ id });
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
};

export const uploadVideo = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    throw new ApiError(400, "Video name is required");
  }

  if (!req.file) {
    throw new ApiError(400, "No video file uploaded");
  }

  const localFilePath = req.file.path;
  const response = await uploadOnCloudinary(localFilePath);

  if (!response) {
    throw new ApiError(500, "Failed to upload video to Cloudinary");
  }

  const video = videoRepository.create({
    name,
    fileName: req.file.originalname,
    link: response.secure_url,
    user_id: req.user?.id,
  });
  await videoRepository.save(video);

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video uploaded successfully"));
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Video ID is required");
  }

  const video = await videoRepository.findOneBy({ id });
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  await videoRepository.remove(video);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Video deleted successfully"));
};

export const createVideo = async (req, res) => {
  const { name, link } = req.body;

  if (!name || !link) {
    throw new ApiError(400, "Name and link are required");
  }

  const video = videoRepository.create({
    name,
    link,
    fileName: name,
    user_id: req.user?.id,
  });
  await videoRepository.save(video);

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video created successfully"));
};


