"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { GeneratedVideo } from "./types";

interface VideoResultCardProps {
  video: GeneratedVideo;
  onRerun?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
  onFavorite?: () => void;
  onAttachImages?: (imageUrl?: string) => void;
}

// Icons
const PlayIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" className="size-6 text-white">
    <path
      d="M4.78824 1.26719C3.78891 0.649958 2.5 1.36881 2.5 2.54339V9.45736C2.5 10.6319 3.7889 11.3508 4.78824 10.7336L10.3853 7.27657C11.3343 6.69042 11.3343 5.31034 10.3853 4.72418L4.78824 1.26719Z"
      fill="currentColor"
    />
  </svg>
);

const PauseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" className="size-6 text-white">
    <path
      d="M3 1.5C2.44772 1.5 2 1.94772 2 2.5V9.5C2 10.0523 2.44772 10.5 3 10.5H4C4.55228 10.5 5 10.0523 5 9.5V2.5C5 1.94772 4.55228 1.5 4 1.5H3Z"
      fill="currentColor"
    />
    <path
      d="M8 1.5C7.44772 1.5 7 1.94772 7 2.5V9.5C7 10.0523 7.44772 10.5 8 10.5H9C9.55228 10.5 10 10.0523 10 9.5V2.5C10 1.94772 9.55228 1.5 9 1.5H8Z"
      fill="currentColor"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    className="[&_path]:stroke-[3px]"
  >
    <path
      d="M4.75518 5.15769C4.65005 4.94744 4.35001 4.94744 4.24488 5.15769L3.59168 6.4641C3.56407 6.51931 3.51931 6.56407 3.4641 6.59168L2.15769 7.24488C1.94744 7.35001 1.94744 7.65005 2.15769 7.75518L3.4641 8.40839C3.51931 8.43599 3.56407 8.48075 3.59168 8.53596L4.24488 9.84237C4.35001 10.0526 4.65005 10.0526 4.75518 9.84237L5.40839 8.53596C5.43599 8.48075 5.48075 8.43599 5.53596 8.40839L6.84237 7.75518C7.05262 7.65005 7.05262 7.35001 6.84237 7.24488L5.53596 6.59168C5.48075 6.56407 5.43599 6.51931 5.40839 6.4641L4.75518 5.15769Z"
      fill="currentColor"
    />
    <path
      d="M17.2071 4.2072L19.7929 6.79299C20.1834 7.18351 20.1834 7.81667 19.7929 8.2072L8.04289 19.9572C7.85536 20.1447 7.601 20.2501 7.33579 20.2501H3.75V16.6643C3.75 16.3991 3.85536 16.1447 4.04289 15.9572L15.7929 4.2072C16.1834 3.81668 16.8166 3.81668 17.2071 4.2072Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 5.57193C18.3331 -0.86765 29.1898 11.0916 12 20.75C-5.18982 11.0916 5.66687 -0.867651 12 5.57193Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill={filled ? "currentColor" : "none"}
    />
  </svg>
);

const DownloadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M20.25 14.75V19.25C20.25 19.8023 19.8023 20.25 19.25 20.25H4.75C4.19772 20.25 3.75 19.8023 3.75 19.25V14.75M12 15V3.75M12 15L8.5 11.5M12 15L15.5 11.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FolderDownloadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 19.25V13M12 13L14.5 15.5M12 13L9.5 15.5M7.375 19.25H3.75C3.19772 19.25 2.75 18.8023 2.75 18.25V4.75C2.75 4.19772 3.19772 3.75 3.75 3.75H9.46482C9.79917 3.75 10.1114 3.9171 10.2969 4.1953L11.7031 6.3047C11.8886 6.5829 12.2008 6.75 12.5352 6.75H20.25C20.8023 6.75 21.25 7.19772 21.25 7.75V18.25C21.25 18.8023 20.8023 19.25 20.25 19.25H16.625"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.25 13C20.8023 13 21.25 12.5523 21.25 12C21.25 11.4477 20.8023 11 20.25 11C19.6977 11 19.25 11.4477 19.25 12C19.25 12.5523 19.6977 13 20.25 13Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.75 13C4.30228 13 4.75 12.5523 4.75 12C4.75 11.4477 4.30228 11 3.75 11C3.19772 11 2.75 11.4477 2.75 12C2.75 12.5523 3.19772 13 3.75 13Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RerunIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    className="[&_path]:stroke-[3px]"
  >
    <path
      d="M4.24023 14.75C5.37278 17.9543 8.42869 20.25 12.0208 20.25C16.5771 20.25 20.2708 16.5563 20.2708 12C20.2708 7.44365 16.5771 3.75 12.0208 3.75C9.20364 3.75 7.32073 4.95438 5.4998 7.00891M4.7498 4V7.5C4.7498 7.77614 4.97366 8 5.2498 8H8.7498"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M19.25 7.75C19.25 7.19772 18.8023 6.75 18.25 6.75H9.75C9.19772 6.75 8.75 7.19772 8.75 7.75V20.25C8.75 20.8023 9.19772 21.25 9.75 21.25H18.25C18.8023 21.25 19.25 20.8023 19.25 20.25V7.75Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.25 6.75V3.75C15.25 3.19772 14.8023 2.75 14.25 2.75H5.75C5.19772 2.75 4.75 3.19772 4.75 3.75V16.25C4.75 16.8023 5.19772 17.25 5.75 17.25H8.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M4.75 6.5L5.72041 20.32C5.7572 20.8439 6.19286 21.25 6.71796 21.25H17.282C17.8071 21.25 18.2428 20.8439 18.2796 20.32L19.25 6.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.25 5.75H20.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.5246 5.58289C8.73079 3.84652 10.2081 2.5 12 2.5C13.7919 2.5 15.2692 3.84652 15.4754 5.58289"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 10.5V16.25"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 10.5V16.25"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ResolutionIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M8.5 7.75L6.25 10L8.5 12.25M12.7071 20.0429L22.049 10.701C22.4371 10.3129 22.4398 9.68443 22.0551 9.29295L16.901 4.04903C16.713 3.85774 16.4561 3.75 16.1879 3.75H7.81214C7.54393 3.75 7.28696 3.85774 7.09895 4.04903L1.94493 9.29295C1.56016 9.68443 1.56288 10.3129 1.95102 10.701L11.2929 20.0429C11.6834 20.4334 12.3166 20.4334 12.7071 20.0429Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 7.75V12L14.75 14.75M21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const KlingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.7522 2.86984L16.818 2.93745L16.8199 2.93552C18.087 4.25441 17.7236 6.90443 15.8863 9.90864L19.5 13.6567L19.3447 13.9703C18.7372 15.1986 17.9147 16.2992 16.9193 17.216C15.608 18.43 14.0251 19.2853 12.3143 19.7044L12.2522 19.7198L12.1634 19.7417L12.0994 19.7565L11.9584 19.7887L11.8416 19.8126L11.754 19.8299C11.6609 19.8493 11.5634 19.8673 11.4683 19.884L11.3888 19.8963L11.3286 19.904C11.2429 19.916 11.1576 19.9272 11.0727 19.9375C9.64831 20.1036 8.20616 19.9376 6.8516 19.4517C5.49703 18.9658 4.2643 18.1723 3.24348 17.1291L3.18385 17.0692C1.91429 15.7503 2.27391 13.0983 4.11366 10.0922L0.5 6.34416L0.65528 6.03054C1.26118 4.80131 2.0846 3.70115 3.08261 2.78741C4.10242 1.8473 5.28649 1.11848 6.57081 0.640344C6.86894 0.528933 7.18075 0.431691 7.48696 0.34926C7.73931 0.279139 7.9944 0.220054 8.25155 0.172163C8.33851 0.154131 8.43665 0.135456 8.53168 0.118712C10.0139 -0.12084 11.5297 0.00325476 12.9574 0.481036C14.385 0.958817 15.6847 1.77698 16.7522 2.86984Z"
    />
  </svg>
);

const WanIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <g clipPath="url(#clip0_wan_card)">
      <path d="M19.9361 12.1411L17.6243 8.09523L17.3525 7.61735L18.5771 5.47657C18.6187 5.4023 18.6411 5.32158 18.6411 5.23763C18.6411 5.15367 18.6187 5.07295 18.5771 4.99868L17.215 2.61896C17.1735 2.5447 17.1127 2.48658 17.0424 2.4446C16.972 2.40262 16.8921 2.38002 16.8058 2.38002H11.6323L10.4077 0.236011C10.3245 0.0874804 10.1679 -0.00292969 9.9984 -0.00292969H7.27738C7.19425 -0.00292969 7.11111 0.0196728 7.04077 0.0616489C6.97042 0.103625 6.90967 0.161746 6.86811 0.236011L4.55316 4.28509L4.28138 4.75974H1.83213C1.749 4.75974 1.66587 4.78235 1.59552 4.82432C1.52518 4.8663 1.46443 4.92442 1.42286 4.99868L0.0639488 7.38164C0.0223821 7.4559 0 7.53663 0 7.62058C0 7.70453 0.0223821 7.78525 0.0639488 7.85952L2.65068 12.3833L1.42606 14.5273C1.38449 14.6015 1.36211 14.6823 1.36211 14.7662C1.36211 14.8502 1.38449 14.9309 1.42606 15.0051L2.78817 17.3849C2.82974 17.4591 2.89049 17.5173 2.96083 17.5592C3.03118 17.6012 3.11111 17.6238 3.19744 17.6238H8.36771L9.59233 19.7678C9.67546 19.9163 9.83214 20.0068 10.0016 20.0068H12.7226C12.8058 20.0068 12.8889 19.9842 12.9592 19.9422C13.0296 19.9002 13.0903 19.8421 13.1319 19.7678L15.7186 15.2441H18.1679C18.251 15.2441 18.3341 15.2215 18.4045 15.1795C18.4748 15.1375 18.5356 15.0794 18.5771 15.0051L19.9393 12.6254C19.9808 12.5512 20.0032 12.4704 20.0032 12.3865C20.0032 12.3025 19.9808 12.2218 19.9393 12.1475L19.9361 12.1411Z" />
    </g>
    <defs>
      <clipPath id="clip0_wan_card">
        <rect width="20" height="20" fill="currentColor" />
      </clipPath>
    </defs>
  </svg>
);

const MODEL_ICONS: Record<string, React.ReactNode> = {
  "kling-2.6": <KlingIcon />,
  "kling-2.5-turbo": <KlingIcon />,
  "wan-2.6": <WanIcon />,
};

const MODEL_NAMES: Record<string, string> = {
  "kling-2.6": "Kling 2.6",
  "kling-2.5-turbo": "Kling 2.5 Turbo",
  "wan-2.6": "Wan 2.6",
};

export default function VideoResultCard({
  video,
  onRerun,
  onCopy,
  onDelete,
  onDownload,
  onFavorite,
  onAttachImages,
}: VideoResultCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    onFavorite?.();
  };

  const handleAttachImage = (imageUrl: string) => {
    if (!onAttachImages) return;
    onAttachImages(imageUrl);
  };

  const formattedDate = new Date(video.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div
      className="w-full pl-1 pt-1 animate-in fade-in slide-in-from-bottom-4 duration-500"
      style={{ marginBottom: "20px" }}
    >
      <li style={{ listStyle: "none" }}>
        <div
          className="group/card grid items-stretch"
          style={{ gridTemplateColumns: "1fr minmax(200px, 260px)", gap: "12px" }}
        >
          {/* Video Preview Container */}
          <div
            className="grid auto-rows-[1fr] grid-flow-row-dense gap-2 will-change-auto"
            style={{ gridTemplateColumns: "1fr" }}
          >
            <div
              className="group relative overflow-hidden rounded-2xl bg-zinc-900 transition has-[[aria-selected=true]]:ring-3 has-[[aria-selected=true]]:ring-white"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <figure
                aria-selected="false"
                className="group relative z-0 h-full w-full"
                style={{ aspectRatio: "1.77778 / 1" }}
              >
                {/* Video Player - hidden until playing */}
                <video
                  ref={videoRef}
                  src={video.url}
                  className={`absolute inset-0 size-full object-contain transition-opacity duration-300 ${
                    isPlaying ? "opacity-100 z-[1]" : "opacity-0 -z-[1]"
                  }`}
                  playsInline
                  onEnded={() => setIsPlaying(false)}
                />

                {/* Thumbnail/Preview Image */}
                {video.thumbnailUrl ? (
                  <Image
                    src={video.thumbnailUrl}
                    alt={`Video: ${video.prompt.slice(0, 50)}`}
                    fill
                    className={`pointer-events-auto object-contain transition-opacity duration-300 -z-[1] ${
                      isPlaying ? "opacity-0" : "opacity-100"
                    }`}
                    sizes="(max-width: 768px) 500px, 1280px"
                  />
                ) : (
                  /* Video as poster when no thumbnail */
                  <video
                    src={video.url}
                    className={`absolute inset-0 size-full object-contain pointer-events-none transition-opacity duration-300 -z-[1] ${
                      isPlaying ? "opacity-0" : "opacity-100"
                    }`}
                    muted
                    playsInline
                    preload="metadata"
                  />
                )}

                {/* Play/Pause Button - Centered Grid */}
                <div
                  className={`size-full grid items-center justify-center transition-opacity duration-200 ${
                    isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
                  }`}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    className="size-6 text-white"
                    style={{
                      filter: "drop-shadow(rgba(0, 0, 0, 0.5) 0px 4px 4px)",
                    }}
                  >
                    {isPlaying ? (
                      <>
                        <path
                          d="M3 1.5C2.44772 1.5 2 1.94772 2 2.5V9.5C2 10.0523 2.44772 10.5 3 10.5H4C4.55228 10.5 5 10.0523 5 9.5V2.5C5 1.94772 4.55228 1.5 4 1.5H3Z"
                          fill="currentColor"
                        />
                        <path
                          d="M8 1.5C7.44772 1.5 7 1.94772 7 2.5V9.5C7 10.0523 7.44772 10.5 8 10.5H9C9.55228 10.5 10 10.0523 10 9.5V2.5C10 1.94772 9.55228 1.5 9 1.5H8Z"
                          fill="currentColor"
                        />
                      </>
                    ) : (
                      <path
                        d="M4.78824 1.26719C3.78891 0.649958 2.5 1.36881 2.5 2.54339V9.45736C2.5 10.6319 3.7889 11.3508 4.78824 10.7336L10.3853 7.27657C11.3343 6.69042 11.3343 5.31034 10.3853 4.72418L4.78824 1.26719Z"
                        fill="currentColor"
                      />
                    )}
                  </svg>
                </div>

                {/* Clickable Area */}
                <button
                  type="button"
                  className="absolute inset-0 cursor-pointer"
                  onClick={handlePlayPause}
                />
              </figure>

              {/* Hover Action Buttons */}
              <div className="transition group-hover:opacity-100 flex items-center gap-2 absolute top-4 right-4 opacity-0">
                {/* Checkbox */}
                <button
                  type="button"
                  role="checkbox"
                  className="p-2 rounded-lg transition-all duration-150 hover:bg-white/10 active:scale-95"
                  aria-checked="false"
                  data-state="closed"
                >
                  <div className="size-4 rounded border border-white/50 bg-transparent transition hover:border-white" />
                </button>

                {/* Edit Button */}
                <button
                  type="button"
                  data-state="closed"
                  aria-busy="false"
                  className="p-2 rounded-lg flex items-center justify-center text-white/90 transition-all duration-150 hover:text-white hover:bg-white/10 active:scale-95 [&_path]:stroke-2"
                >
                  <svg
                    className="size-4"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M4.75518 5.15769C4.65005 4.94744 4.35001 4.94744 4.24488 5.15769L3.59168 6.4641C3.56407 6.51931 3.51931 6.56407 3.4641 6.59168L2.15769 7.24488C1.94744 7.35001 1.94744 7.65005 2.15769 7.75518L3.4641 8.40839C3.51931 8.43599 3.56407 8.48075 3.59168 8.53596L4.24488 9.84237C4.35001 10.0526 4.65005 10.0526 4.75518 9.84237L5.40839 8.53596C5.43599 8.48075 5.48075 8.43599 5.53596 8.40839L6.84237 7.75518C7.05262 7.65005 7.05262 7.35001 6.84237 7.24488L5.53596 6.59168C5.48075 6.56407 5.43599 6.51931 5.40839 6.4641L4.75518 5.15769Z"
                      fill="currentColor"
                    />
                    <path
                      d="M9.26447 2.16345C9.1555 1.94552 8.8445 1.94552 8.73553 2.16345L8.25558 3.12335C8.22697 3.18057 8.18057 3.22697 8.12335 3.25558L7.16345 3.73553C6.94552 3.8445 6.94552 4.1555 7.16345 4.26447L8.12335 4.74442C8.18057 4.77303 8.22697 4.81943 8.25558 4.87665L8.73553 5.83655C8.8445 6.05448 9.1555 6.05448 9.26447 5.83655L9.74442 4.87665C9.77303 4.81943 9.81943 4.77303 9.87665 4.74442L10.8365 4.26447C11.0545 4.1555 11.0545 3.8445 10.8365 3.73553L9.87665 3.25558C9.81943 3.22697 9.77303 3.18057 9.74442 3.12335L9.26447 2.16345Z"
                      fill="currentColor"
                    />
                    <path
                      d="M18.7551 15.1577C18.65 14.9474 18.35 14.9474 18.2449 15.1577L17.5917 16.4641C17.5641 16.5193 17.5193 16.5641 17.4641 16.5917L16.1577 17.2449C15.9474 17.35 15.9474 17.65 16.1577 17.7551L17.4641 18.4083C17.5193 18.4359 17.5641 18.4807 17.5917 18.5359L18.2449 19.8423C18.35 20.0526 18.65 20.0526 18.7551 19.8423L19.4083 18.5359C19.4359 18.4807 19.4807 18.4359 19.5359 18.4083L20.8423 17.7551C21.0526 17.65 21.0526 17.35 20.8423 17.2449L19.5359 16.5917C19.4807 16.5641 19.4359 16.5193 19.4083 16.4641L18.7551 15.1577Z"
                      fill="currentColor"
                    />
                    <path
                      d="M17.2071 4.2072L19.7929 6.79299C20.1834 7.18351 20.1834 7.81667 19.7929 8.2072L8.04289 19.9572C7.85536 20.1447 7.601 20.2501 7.33579 20.2501H3.75V16.6643C3.75 16.3991 3.85536 16.1447 4.04289 15.9572L15.7929 4.2072C16.1834 3.81668 16.8166 3.81668 17.2071 4.2072Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Favorite Button */}
                <button
                  type="button"
                  role="checkbox"
                  data-state="closed"
                  aria-checked={isFavorited}
                  onClick={handleFavorite}
                  className={`p-2 rounded-lg flex items-center justify-center transition-all duration-150 hover:bg-white/10 active:scale-95 [&_path]:stroke-2 ${
                    isFavorited ? "text-red-500 hover:text-red-400" : "text-white/90 hover:text-white"
                  }`}
                >
                  <svg className="size-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 5.57193C18.3331 -0.86765 29.1898 11.0916 12 20.75C-5.18982 11.0916 5.66687 -0.867651 12 5.57193Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                      fill={isFavorited ? "currentColor" : "none"}
                    />
                  </svg>
                </button>

                {/* Save to Folder Button */}
                <button
                  type="button"
                  data-state="closed"
                  className="p-2 rounded-lg flex items-center justify-center text-white/90 transition-all duration-150 hover:text-white hover:bg-white/10 active:scale-95 [&_path]:stroke-2"
                >
                  <svg className="size-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 19.25V13M12 13L14.5 15.5M12 13L9.5 15.5M7.375 19.25H3.75C3.19772 19.25 2.75 18.8023 2.75 18.25V4.75C2.75 4.19772 3.19772 3.75 3.75 3.75H9.46482C9.79917 3.75 10.1114 3.9171 10.2969 4.1953L11.7031 6.3047C11.8886 6.5829 12.2008 6.75 12.5352 6.75H20.25C20.8023 6.75 21.25 7.19772 21.25 7.75V18.25C21.25 18.8023 20.8023 19.25 20.25 19.25H16.625"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Download Button */}
                <button
                  type="button"
                  data-state="closed"
                  onClick={onDownload}
                  className="p-2 rounded-lg flex items-center justify-center text-white/90 transition-all duration-150 hover:text-white hover:bg-white/10 active:scale-95 [&_path]:stroke-2"
                >
                  <svg className="size-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20.25 14.75V19.25C20.25 19.8023 19.8023 20.25 19.25 20.25H4.75C4.19772 20.25 3.75 19.8023 3.75 19.25V14.75M12 15V3.75M12 15L8.5 11.5M12 15L15.5 11.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* More Options Button */}
                <button
                  type="button"
                  data-state="closed"
                  className="p-2 rounded-lg flex items-center justify-center text-white/90 transition-all duration-150 hover:text-white hover:bg-white/10 active:scale-95 [&_path]:stroke-2"
                >
                  <svg className="size-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20.25 13C20.8023 13 21.25 12.5523 21.25 12C21.25 11.4477 20.8023 11 20.25 11C19.6977 11 19.25 11.4477 19.25 12C19.25 12.5523 19.6977 13 20.25 13Z"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.75 13C4.30228 13 4.75 12.5523 4.75 12C4.75 11.4477 4.30228 11 3.75 11C3.19772 11 2.75 11.4477 2.75 12C2.75 12.5523 3.19772 13 3.75 13Z"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Action Panel / Info Section */}
          <div id="action-panel" className="will-change-auto min-w-60">
            <div
              className="relative grid gap-3 justify-items-start h-full content-start bg-zinc-950 p-4 pb-14 border border-zinc-800/50 rounded-2xl"
              style={{ minHeight: "100%" }}
            >
              {/* Model Badge */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs font-medium text-white"
                >
                  {MODEL_ICONS[video.model] || <KlingIcon />}
                  {MODEL_NAMES[video.model] || video.model}
                </button>
              </div>

              {/* Prompt Text */}
              <div className="group flex items-start text-sm text-zinc-400 flex-1 min-w-0">
                <div className="group select-none hide-scrollbar overflow-y-scroll text-zinc-400 hover:text-zinc-200 max-h-15 lg:max-h-40 py-0 lg:py-2 lg:-mx-3 lg:px-3 lg:rounded-lg focus-visible:ring focus-visible:ring-white focus-visible:bg-black hover:bg-black duration-0 gap-2 flex flex-col">
                  <p className="text-sm min-w-0 flex-1 cursor-copy break-words break-all whitespace-pre-wrap">
                    {video.prompt}
                  </p>
                </div>
              </div>

              {/* Input Thumbnails */}
              <div className="flex flex-wrap gap-2">
                {/* Motion Reference Thumbnail */}
                {video.motionVideoUrl && (
                  <button
                    type="button"
                    className="select-none group outline-none cursor-pointer rounded-md lg:rounded-lg overflow-hidden duration-150 -rotate-[5deg] hover:rotate-0 hover:scale-125 focus-visible:scale-125 focus-visible:ring-2 focus-visible:ring-white active:scale-115 size-6 lg:size-10 relative"
                  >
                    <video
                      loop
                      playsInline
                      disablePictureInPicture
                      preload="none"
                      src={video.motionVideoUrl}
                      className="object-cover size-full"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity duration-200 bg-black/50">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        className="size-3.5 text-white"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.16667 2.99935C5.16667 1.98683 5.98748 1.16602 7 1.16602H11.6667C12.6792 1.16602 13.5 1.98683 13.5 2.99935V10.3327C13.5 11.3452 12.6792 12.166 11.6667 12.166H7C5.98748 12.166 5.16667 11.3452 5.16667 10.3327V2.99935Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </button>
                )}

                {/* Start Image Thumbnail */}
                {video.startImageUrl && (
                  <button
                    type="button"
                    onClick={() => handleAttachImage(video.startImageUrl!)}
                    title="Click to use this image"
                    className="select-none group outline-none cursor-pointer rounded-md lg:rounded-lg overflow-hidden duration-150 rotate-[5deg] hover:rotate-0 hover:scale-125 focus-visible:scale-125 focus-visible:ring-2 focus-visible:ring-white active:scale-115 size-6 lg:size-10 relative"
                  >
                    <Image
                      src={video.startImageUrl}
                      alt="Start image"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity duration-200 bg-black/50">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        className="size-3.5 text-white"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.16667 2.99935C5.16667 1.98683 5.98748 1.16602 7 1.16602H11.6667C12.6792 1.16602 13.5 1.98683 13.5 2.99935V10.3327C13.5 11.3452 12.6792 12.166 11.6667 12.166H7C5.98748 12.166 5.16667 11.3452 5.16667 10.3327V2.99935ZM7 2.16602C6.53976 2.16602 6.16667 2.53911 6.16667 2.99935V10.3327C6.16667 10.7929 6.53976 11.166 7 11.166H11.6667C12.1269 11.166 12.5 10.7929 12.5 10.3327V2.99935C12.5 2.53911 12.1269 2.16602 11.6667 2.16602H7ZM3 4.83268C3.27614 4.83268 3.5 5.05654 3.5 5.33268V12.9993C3.5 13.4596 3.8731 13.8327 4.33333 13.8327H9C9.27614 13.8327 9.5 14.0565 9.5 14.3327C9.5 14.6088 9.27614 14.8327 9 14.8327H4.33333C3.32081 14.8327 2.5 14.0119 2.5 12.9993V5.33268C2.5 5.05654 2.72386 4.83268 3 4.83268Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </button>
                )}

                {/* End Image Thumbnail */}
                {video.endImageUrl && (
                  <button
                    type="button"
                    onClick={() => handleAttachImage(video.endImageUrl!)}
                    title="Click to use this image"
                    className="select-none group outline-none cursor-pointer rounded-md lg:rounded-lg overflow-hidden duration-150 -rotate-[5deg] hover:rotate-0 hover:scale-125 focus-visible:scale-125 focus-visible:ring-2 focus-visible:ring-white active:scale-115 size-6 lg:size-10 relative"
                  >
                    <Image
                      src={video.endImageUrl}
                      alt="End image"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity duration-200 bg-black/50">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        className="size-3.5 text-white"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.16667 2.99935C5.16667 1.98683 5.98748 1.16602 7 1.16602H11.6667C12.6792 1.16602 13.5 1.98683 13.5 2.99935V10.3327C13.5 11.3452 12.6792 12.166 11.6667 12.166H7C5.98748 12.166 5.16667 11.3452 5.16667 10.3327V2.99935ZM7 2.16602C6.53976 2.16602 6.16667 2.53911 6.16667 2.99935V10.3327C6.16667 10.7929 6.53976 11.166 7 11.166H11.6667C12.1269 11.166 12.5 10.7929 12.5 10.3327V2.99935C12.5 2.53911 12.1269 2.16602 11.6667 2.16602H7ZM3 4.83268C3.27614 4.83268 3.5 5.05654 3.5 5.33268V12.9993C3.5 13.4596 3.8731 13.8327 4.33333 13.8327H9C9.27614 13.8327 9.5 14.0565 9.5 14.3327C9.5 14.6088 9.27614 14.8327 9 14.8327H4.33333C3.32081 14.8327 2.5 14.0119 2.5 12.9993V5.33268C2.5 5.05654 2.72386 4.83268 3 4.83268Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </button>
                )}
              </div>

              {/* Settings Badges */}
              <div className="flex flex-wrap gap-2">
                {/* Resolution Badge */}
                <button
                  type="button"
                  role="presentation"
                  className="flex items-center gap-1 py-1 pl-1.5 pr-2.5 rounded-lg bg-zinc-800 text-xs font-semibold text-white cursor-default hover:opacity-100 hover:brightness-100 hover:bg-zinc-800"
                >
                  <span className="size-3.5 text-zinc-500">
                    <ResolutionIcon />
                  </span>
                  {video.resolution || "1080p"}
                </button>

                {/* Duration Badge */}
                <button
                  type="button"
                  role="presentation"
                  className="flex items-center gap-1 py-1 pl-1.5 pr-2.5 rounded-lg bg-zinc-800 text-xs font-semibold text-white cursor-default hover:opacity-100 hover:brightness-100 hover:bg-zinc-800"
                >
                  <span className="size-3.5 text-zinc-500">
                    <ClockIcon />
                  </span>
                  {video.duration}s
                </button>
              </div>

              {/* Date - shows when not hovering */}
              <span className="pointer-events-none absolute bottom-4.5 left-4 text-xs text-zinc-500 transition-opacity duration-400 group-hover/card:opacity-0">
                {formattedDate}
              </span>

              {/* Bottom Action Buttons - shows on hover */}
              <div className="absolute bottom-4 left-4 flex w-[calc(100%-2rem)] items-center justify-between transition-opacity duration-400 opacity-0 group-hover/card:opacity-100 hover:!opacity-100">
                {/* Rerun Button */}
                <button
                  type="button"
                  onClick={onRerun}
                  className="flex gap-1 cursor-pointer py-1 px-1.5 items-center justify-center text-white/70 transition hover:text-white"
                >
                  <svg
                    className="[&_path]:stroke-[3px]"
                    aria-hidden="true"
                    width="14px"
                    height="14px"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M4.24023 14.75C5.37278 17.9543 8.42869 20.25 12.0208 20.25C16.5771 20.25 20.2708 16.5563 20.2708 12C20.2708 7.44365 16.5771 3.75 12.0208 3.75C9.20364 3.75 7.32073 4.95438 5.4998 7.00891M4.7498 4V7.5C4.7498 7.77614 4.97366 8 5.2498 8H8.7498"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-xs font-semibold">Rerun</span>
                </button>

                {/* Copy & Delete Buttons */}
                <div className="ml-auto flex">
                  <button
                    type="button"
                    onClick={onCopy}
                    className="px-1.5 py-1 text-white/70 transition hover:text-white [&_path]:stroke-[3px]"
                  >
                    <CopyIcon />
                  </button>
                  <button
                    type="button"
                    onClick={onDelete}
                    className="px-1.5 py-1 text-white/70 transition hover:text-red-400 [&_path]:stroke-[3px]"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    </div>
  );
}
