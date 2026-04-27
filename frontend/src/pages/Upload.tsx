import React, { useState } from "react";
import { Upload as UploadIcon, Film, Loader2 } from "lucide-react";
import { apiService } from "../api/api";

export default function Upload() {
  const [videoName, setVideoName] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !videoName.trim()) {
      alert("Please provide both a video file and a name.");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload file to Cloudinary
      const uploadRes = await apiService.upload.single(videoFile, (percent) => {
        setProgress(percent);
      });
      const link =
        uploadRes.data?.data?.secure_url || uploadRes.data?.secure_url;

      if (!link) {
        throw new Error("Failed to get upload link");
      }

      // 2. Create video record in DB
      await apiService.video.create({ name: videoName, link });

      alert("Video uploaded successfully!");
      setVideoName("");
      setVideoFile(null);
    } catch (error: any) {
      console.error("Upload Error:", error);
      alert(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] px-4">
      <div className="w-full max-w-md p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-red-500/10 rounded-full mb-3">
            <UploadIcon className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-100">Upload Video</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Share your content with the world
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Video Name
            </label>
            <input
              type="text"
              value={videoName}
              onChange={(e) => setVideoName(e.target.value)}
              placeholder="Enter video title"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Select Video
            </label>
            <div className="relative">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setVideoFile(file);
                  if (file && !videoName) {
                    // Auto-fill name with filename (without extension)
                    const nameWithoutExt = file.name
                      .split(".")
                      .slice(0, -1)
                      .join(".");
                    setVideoName(nameWithoutExt);
                  }
                }}
                className="hidden"
                id="video-upload"
                required
              />
              <label
                htmlFor="video-upload"
                className="flex flex-col items-center justify-center w-full h-32 px-4 bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-red-500/50 transition-colors duration-200"
              >
                <Film className="w-6 h-6 text-zinc-400 mb-2" />
                <span className="text-sm text-zinc-300 font-medium text-center break-all">
                  {videoFile ? videoFile.name : "Click to browse files"}
                </span>
                <span className="text-xs text-zinc-500 mt-1">
                  MP4, WebM, etc.
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Uploading...</span>
                <p className="text-xs text-zinc-400 mt-1 text-right">
                  {progress}%
                </p>
              </>
            ) : (
              <span>Upload Video</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
