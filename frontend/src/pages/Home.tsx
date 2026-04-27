import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Calendar, Link as LinkIcon } from "lucide-react";

import { apiService } from "../api/api";

interface VideoItem {
  id: string;
  name: string;
  link: string;
  createdAt: string;
  thumbnail: string;
}

export default function Home() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchVideos = async (pageNum: number) => {
    if (loading || (!hasMore && pageNum > 1)) return;
    setLoading(true);
    try {
      const res = await apiService.video.getAll(pageNum);
      const fetchedVideos = res.data?.data || [];

      if (fetchedVideos.length === 0) {
        setHasMore(false);
        return;
      }

      const mappedVideos = fetchedVideos.map((v: any) => ({
        id: v.id,
        name: v.name,
        link: v.link,
        createdAt: new Date(v.createdAt).toLocaleDateString(),
        thumbnail: `https://picsum.photos/seed/${v.id}/640/360`,
      }));

      setVideos((prev) => (pageNum === 1 ? mappedVideos : [...prev, ...mappedVideos]));
      setPage(pageNum);

      if (fetchedVideos.length < 12) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(1);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          fetchVideos(page + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [videos, loading, hasMore, page]);


  return (
    <div className="pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <Link
            key={video.id}
            to={`/video/${video.id}`}
            className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all duration-200 group flex flex-col h-full shadow-md cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-zinc-800 overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-2 right-2 bg-black/80 text-zinc-200 text-xs px-1.5 py-0.5 rounded font-medium">
                12:34
              </span>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-zinc-100 font-semibold line-clamp-2 group-hover:text-red-400 transition-colors duration-200 flex-grow">
                {video.name}
              </h3>

              <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1.5">
                <div className="flex items-center text-xs text-zinc-400">
                  <LinkIcon className="w-3.5 h-3.5 mr-1.5 text-zinc-500 shrink-0" />
                  <span className="truncate">{video.link}</span>
                </div>
                <div className="flex items-center text-xs text-zinc-400">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-zinc-500 shrink-0" />
                  <span>{video.createdAt}</span>
                </div>
              </div>
            </div>
          </Link>

        ))}
      </div>

      {/* Observer Target / Loading Indicator */}
      <div
        ref={observerTarget}
        className="flex justify-center items-center h-20 mt-6"
      >
        {loading && (
          <div className="flex items-center space-x-2 text-zinc-400 text-sm">
            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading more videos...</span>
          </div>
        )}
      </div>
    </div>
  );
}
