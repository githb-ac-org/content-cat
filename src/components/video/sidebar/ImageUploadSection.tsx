"use client";

import Image from "next/image";
import { ImageUploadIcon, SwapIcon, CloseIcon } from "../icons";

interface ImageUploadSectionProps {
  // For start/end frames mode
  supportsStartEndFrames: boolean;
  startImageUrl: string | null;
  endImageUrl: string | null;
  isSwapping: boolean;
  startImageInputRef: React.RefObject<HTMLInputElement | null>;
  endImageInputRef: React.RefObject<HTMLInputElement | null>;
  onImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "start" | "end" | "single"
  ) => void;
  onClearImage: (type: "start" | "end" | "single") => void;
  onSwapImages: () => void;
  // For single image mode
  singleImageUrl?: string;
  // Optional mode override for models like Veo 3.1 that support both modes
  mode?: "image-to-video" | "first-last-frame";
}

export default function ImageUploadSection({
  supportsStartEndFrames,
  startImageUrl,
  endImageUrl,
  isSwapping,
  startImageInputRef,
  endImageInputRef,
  onImageUpload,
  onClearImage,
  onSwapImages,
  singleImageUrl,
  mode,
}: ImageUploadSectionProps) {
  // Determine if we should show start/end frames UI
  // For Veo 3.1: show start/end only in first-last-frame mode
  // For other models: use supportsStartEndFrames flag
  const showStartEndFrames = mode
    ? mode === "first-last-frame"
    : supportsStartEndFrames;

  if (showStartEndFrames) {
    return (
      <div
        className="relative grid grid-cols-2 gap-2 select-none"
        style={{ height: "120px" }}
      >
        {/* Swap Button - centered between frames */}
        {(startImageUrl || endImageUrl) && (
          <button
            type="button"
            disabled={isSwapping}
            onClick={onSwapImages}
            className="absolute top-1/2 left-1/2 z-[3] flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 text-pink-400 transition hover:bg-zinc-800 disabled:opacity-50"
          >
            <SwapIcon />
          </button>
        )}

        {/* Start Frame */}
        <div
          className="group relative size-full rounded-lg"
          style={{ height: "120px" }}
        >
          <label className="relative block size-full cursor-pointer overflow-hidden rounded-lg">
            <input
              ref={startImageInputRef}
              accept="image/jpeg, image/jpg, image/png, image/webp"
              className="sr-only"
              type="file"
              onChange={(e) => onImageUpload(e, "start")}
            />
            {startImageUrl ? (
              <Image
                src={startImageUrl}
                alt="Start frame"
                fill
                sizes="120px"
                className={`object-contain transition-opacity duration-150 ${isSwapping ? "opacity-0" : "opacity-100"}`}
              />
            ) : (
              <div className="flex size-full flex-col items-center justify-center rounded-lg border border-dashed border-zinc-700 transition-colors hover:border-zinc-500">
                <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-800 p-1.5">
                  <ImageUploadIcon />
                </div>
                <p className="mt-1.5 text-center text-[10px] text-white/60">
                  Start frame
                </p>
              </div>
            )}
          </label>
          {startImageUrl && (
            <div className="absolute -top-2.5 -right-2.5 z-[4]">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClearImage("start");
                }}
                className="flex size-5 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 text-white/80 transition hover:bg-zinc-700 hover:text-white"
              >
                <CloseIcon />
              </button>
            </div>
          )}
          {!startImageUrl && (
            <div className="pointer-events-none absolute top-1.5 right-1.5 rounded-2xl bg-white/10 px-1.5 py-0.5 text-[9px] font-medium text-white/80 backdrop-blur-sm">
              Required
            </div>
          )}
        </div>

        {/* End Frame */}
        <div
          className="group relative size-full rounded-lg"
          style={{ height: "120px" }}
        >
          <label className="relative block size-full cursor-pointer overflow-hidden rounded-lg">
            <input
              ref={endImageInputRef}
              accept="image/jpeg, image/jpg, image/png, image/webp"
              className="sr-only"
              type="file"
              onChange={(e) => onImageUpload(e, "end")}
            />
            {endImageUrl ? (
              <Image
                src={endImageUrl}
                alt="End frame"
                fill
                sizes="120px"
                className={`object-contain transition-opacity duration-150 ${isSwapping ? "opacity-0" : "opacity-100"}`}
              />
            ) : (
              <div className="flex size-full flex-col items-center justify-center rounded-lg border border-dashed border-zinc-700 transition-colors hover:border-zinc-500">
                <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-800 p-1.5">
                  <ImageUploadIcon />
                </div>
                <p className="mt-1.5 text-center text-[10px] text-white/60">
                  End frame
                </p>
              </div>
            )}
          </label>
          {endImageUrl && (
            <div className="absolute -top-2.5 -right-2.5 z-[4]">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClearImage("end");
                }}
                className="flex size-5 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 text-white/80 transition hover:bg-zinc-700 hover:text-white"
              >
                <CloseIcon />
              </button>
            </div>
          )}
          {!endImageUrl && (
            <div className="pointer-events-none absolute top-1.5 right-1.5 rounded-2xl bg-white/5 px-1.5 py-0.5 text-[9px] font-medium text-zinc-400 backdrop-blur-sm">
              Optional
            </div>
          )}
        </div>
      </div>
    );
  }

  // Single Image Upload for other models
  return (
    <div
      className="group relative size-full rounded-lg select-none"
      style={{ height: "120px" }}
    >
      <label className="relative block size-full cursor-pointer overflow-hidden rounded-lg">
        <input
          accept="image/jpeg, image/jpg, image/png, image/webp"
          className="sr-only"
          type="file"
          onChange={(e) => onImageUpload(e, "single")}
        />
        {singleImageUrl ? (
          <Image
            src={singleImageUrl}
            alt="Uploaded image"
            fill
            sizes="200px"
            className="object-contain"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center rounded-lg border border-dashed border-zinc-700 transition-colors hover:border-zinc-500">
            <div className="flex size-9 items-center justify-center rounded-lg bg-zinc-800 p-1.5 shadow-[0_-1.872px_0_0_rgba(20,1,8,0.30)_inset,0_3.744px_3.744px_0_rgba(0,0,0,0.25)]">
              <ImageUploadIcon />
            </div>
            <div className="mt-2 text-center text-xs text-white/60">
              <p className="mb-0.5">
                Upload image or{" "}
                <span className="px-1 font-semibold text-white">
                  generate it
                </span>
              </p>
              <p className="text-white/50">PNG, JPG or Paste from clipboard</p>
            </div>
          </div>
        )}
      </label>
      {singleImageUrl && (
        <div className="absolute -top-2.5 -right-2.5 z-[4]">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClearImage("single");
            }}
            className="flex size-5 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 text-white/80 transition hover:bg-zinc-700 hover:text-white"
          >
            <CloseIcon />
          </button>
        </div>
      )}
      {!singleImageUrl && (
        <div className="pointer-events-none absolute top-2 right-2 rounded-3xl bg-white/5 px-2 py-1.5 text-xs text-zinc-400 ring ring-gray-500/5 backdrop-blur-sm ring-inset">
          Optional
        </div>
      )}
    </div>
  );
}
