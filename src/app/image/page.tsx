"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Header from "@/components/Header";
import ImagePromptForm from "@/components/ImagePromptForm";
import {
  ImageCard,
  ImageGridSkeleton,
  ImageEmptyState,
  ImageDetailOverlay,
  type GeneratedImage,
} from "@/components/image";

export default function ImagePage() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "";
  const initialModel = searchParams.get("model") || undefined;
  const initialCharacterId = searchParams.get("characterId") || undefined;
  const initialProductId = searchParams.get("productId") || undefined;
  const initialSubModel = initialCharacterId || initialProductId || undefined;
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [generatingCount, setGeneratingCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(
    null
  );
  const [recreateData, setRecreateData] = useState<{ prompt: string } | null>(
    null
  );
  const [editData, setEditData] = useState<{ imageUrl: string } | null>(null);

  // Fetch images from database on mount
  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch("/api/images");
      if (response.ok) {
        const images = await response.json();
        setGeneratedImages(images);
      } else {
        toast.error("Failed to load images");
      }
    } catch {
      toast.error("Failed to load images");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const toggleSelectImage = (id: string) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDownload = async (url: string, prompt: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        toast.error("Failed to download image");
        return;
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${prompt.slice(0, 30).replace(/[^a-z0-9]/gi, "_")}_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error("Failed to download image");
    }
  };

  const handleDelete = async (id: string) => {
    // Optimistically update UI
    setGeneratedImages((prev) => prev.filter((img) => img.id !== id));
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });

    // Delete from database
    try {
      const response = await fetch(`/api/images/${id}`, { method: "DELETE" });
      if (!response.ok) {
        toast.error("Failed to delete image");
        fetchImages(); // Restore state
      }
    } catch {
      toast.error("Failed to delete image");
      fetchImages(); // Restore state
    }
  };

  const handleGenerate = async (data: {
    prompt: string;
    model: string;
    count: number;
    aspectRatio: string;
    resolution: string;
    outputFormat: string;
    referenceImages: string[];
  }) => {
    setIsGenerating(true);
    setGeneratingCount(data.count);

    try {
      // Generate images sequentially based on count
      const newImages: GeneratedImage[] = [];

      for (let i = 0; i < data.count; i++) {
        const response = await fetch("/api/generate-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: data.prompt,
            aspectRatio: data.aspectRatio,
            resolution: data.resolution,
            outputFormat: data.outputFormat,
            imageUrls: data.referenceImages,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.error || "Failed to generate image");
          break; // Stop generating more if one fails
        }

        if (result.resultUrls && result.resultUrls.length > 0) {
          for (const url of result.resultUrls) {
            // Save to database
            const saveResponse = await fetch("/api/images", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                url,
                prompt: data.prompt,
                aspectRatio: data.aspectRatio,
              }),
            });

            if (saveResponse.ok) {
              const savedImage = await saveResponse.json();
              newImages.push(savedImage);
            }
          }
        }
      }

      setGeneratedImages((prev) => [...newImages, ...prev]);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0a0a0a]">
      <Header />
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        {/* Main Content Area */}
        <div className="min-h-0 flex-1">
          {/* Gallery Grid */}
          <div
            id="soul-feed-scroll"
            className="hide-scrollbar h-full overflow-auto pb-40"
          >
            {/* Loading state */}
            {isLoading && (
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-8 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
                  <span className="text-sm text-zinc-400">
                    Loading images...
                  </span>
                </div>
              </div>
            )}

            {/* Generated Images Display */}
            {!isLoading && (generatedImages.length > 0 || isGenerating) ? (
              <div
                className="grid w-full grid-cols-2 gap-3 md:grid-cols-4"
                style={{ gridAutoRows: "320px" }}
              >
                {/* Skeleton loaders while generating */}
                {isGenerating && <ImageGridSkeleton count={generatingCount} />}

                {/* Generated images */}
                {generatedImages.map((img, index) => (
                  <ImageCard
                    key={img.id}
                    image={img}
                    isSelected={selectedImages.has(img.id)}
                    isPriority={index < 4}
                    onSelect={() => toggleSelectImage(img.id)}
                    onClick={() => setSelectedImage(img)}
                    onDownload={() => handleDownload(img.url, img.prompt)}
                    onDelete={() => handleDelete(img.id)}
                    onEdit={() => setEditData({ imageUrl: img.url })}
                  />
                ))}
              </div>
            ) : !isLoading ? (
              <ImageEmptyState />
            ) : null}
          </div>
        </div>
      </div>

      {/* Bottom Prompt Form */}
      <ImagePromptForm
        onSubmit={handleGenerate}
        initialPrompt={initialPrompt}
        initialModel={initialModel}
        initialSubModel={initialSubModel}
        recreateData={recreateData}
        editData={editData}
      />

      {/* Image Detail Overlay */}
      {selectedImage && (
        <ImageDetailOverlay
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDelete={(id) => {
            handleDelete(id);
            setSelectedImage(null);
          }}
          onDownload={handleDownload}
          onRecreate={(prompt) => {
            setRecreateData({ prompt });
            setSelectedImage(null);
          }}
        />
      )}
    </div>
  );
}
