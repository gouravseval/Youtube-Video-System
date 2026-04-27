import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { User, ThumbsUp, MessageSquare, Share2 } from "lucide-react";
import { apiService } from "../api/api";

interface VideoData {
  _id: string;
  name: string;
  link: string;
  createdAt: string;
}

export default function VideoDetails() {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendedVideos, setRecommendedVideos] = useState<VideoData[]>([]);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await apiService.video.getById(id);
        setVideo(res.data?.data);

        // Fetch recommendations (just reuse getAll for now)
        const recRes = await apiService.video.getAll(1, 8);
        setRecommendedVideos(
          recRes.data?.data?.filter((v: any) => v._id !== id) || [],
        );
      } catch (error) {
        console.error("Failed to fetch video details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-6rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] text-zinc-400">
        <h2 className="text-2xl font-bold mb-2">Video Not Found</h2>
        <Link to="/" className="text-red-500 hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-12">
      {/* Main Content */}
      <div className="flex-1 lg:max-w-[70%]">
        {/* Video Player */}
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
          <video
            src={`${import.meta.env.VITE_API_BASE_URL}/api/video/stream/${video._id}`}

            controls
            autoPlay
            className="w-full h-full object-contain"
          />
        </div>

        {/* Video Info */}
        <div className="mt-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-zinc-100">{video.name}</h1>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-zinc-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-zinc-400" />
              </div>
              <div>
                <span className="text-zinc-200 font-medium">
                  Anonymous Creator
                </span>
                <p className="text-xs text-zinc-400">
                  Published on {new Date(video.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-full transition-colors duration-200">
                <ThumbsUp className="w-4 h-4" />
                <span>Like</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-full transition-colors duration-200">
                <MessageSquare className="w-4 h-4" />
                <span>Comment</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-full transition-colors duration-200">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Videos Sidebar */}
      <div className="flex-1 lg:max-w-[30%]">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">Up Next</h3>
        <div className="space-y-4">
          {recommendedVideos.map((rec) => (
            <Link
              key={rec._id}
              to={`/video/${rec._id}`}
              className="flex gap-3 bg-zinc-900/50 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors duration-200 border border-zinc-800/30 group"
            >
              <div className="relative w-32 aspect-video bg-zinc-800 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={`https://picsum.photos/seed/${rec._id}/320/180`}
                  alt={rec.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-between py-1">
                <span className="text-sm font-medium text-zinc-100 line-clamp-2 group-hover:text-red-500 transition-colors duration-200">
                  {rec.name}
                </span>
                <span className="text-xs text-zinc-400">
                  {new Date(rec.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
