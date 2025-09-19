import { useRef, useState, useEffect } from "react";
import { Download } from "lucide-react";

const VideoPreview = ({ clip, title, views }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // ✅ compute videoUrl inside the component, once we have clip

  const videoUrl = clip.url.startsWith("http") ? clip.url : clip.url;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const updateTime = () => setCurrentTime(v.currentTime);
    const updateDuration = () => setDuration(v.duration || 0);
    v.addEventListener("timeupdate", updateTime);
    v.addEventListener("loadedmetadata", updateDuration);
    return () => {
      v.removeEventListener("timeupdate", updateTime);
      v.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  const formatTime = (t) => {
    if (!t || isNaN(t)) return "00:00";
    const mins = Math.floor(t / 60)
      .toString()
      .padStart(2, "0");
    const secs = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div
      className="relative w-full aspect-[9/16] bg-black rounded-xl overflow-hidden flex items-center justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        playsInline
        loop
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {/* Overlay play/pause on hover */}
      {hovered && (
        <button
          className="absolute inset-0 flex items-center justify-center z-20"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        >
          <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
            {isPlaying ? (
              // Pause icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M5.5 3.5A.5.5 0 0 1 6 4v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5Zm5 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5Z" />
              </svg>
            ) : (
              // Play icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l4.5-2.5a.5.5 0 0 0 0-.814l-4.5-2.5z" />
              </svg>
            )}
          </div>
        </button>
      )}

      {/* Timer (top-right) */}
      <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded-md text-xs text-white z-20">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 w-full bg-black/70 p-2 flex items-center gap-2 z-20">
        {views && (
          <span className="text-green-400 font-bold text-sm">{views}</span>
        )}
        {title && (
          <span className="text-xs text-white truncate flex-1">{title}</span>
        )}
        <a
          href={videoUrl}
          download={`${title || "viral_clip"}.mp4`}
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <Download size={14} className="text-white" />
        </a>
      </div>
    </div>
  );
};

export default VideoPreview;
