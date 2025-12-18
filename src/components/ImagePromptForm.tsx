"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20">
    <path
      fill="currentColor"
      d="M9.16602 9.16602V4.16602H10.8327V9.16602H15.8327V10.8327H10.8327V15.8327H9.16602V10.8327H4.16602V9.16602H9.16602Z"
    />
  </svg>
);

const MinusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M4.16602 9.16602H15.8327V10.8327H4.16602V9.16602Z"
    />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.81344 7.97994C4.0087 7.78468 4.32528 7.78468 4.52055 7.97994L10.0003 13.4597L15.4801 7.97994C15.6754 7.78468 15.9919 7.78468 16.1872 7.97994C16.3825 8.1752 16.3825 8.49179 16.1872 8.68705L10.3539 14.5204L10.0003 14.8739L9.64677 14.5204L3.81344 8.68705C3.61818 8.49179 3.61818 8.1752 3.81344 7.97994Z"
      fill="currentColor"
    />
  </svg>
);

const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" className="h-4 w-4">
    <path
      d="M11.8525 4.21651L11.7221 3.2387C11.6906 3.00226 11.4889 2.82568 11.2504 2.82568C11.0118 2.82568 10.8102 3.00226 10.7786 3.23869L10.6483 4.21651C10.2658 7.0847 8.00939 9.34115 5.14119 9.72358L4.16338 9.85396C3.92694 9.88549 3.75037 10.0872 3.75037 10.3257C3.75037 10.5642 3.92694 10.7659 4.16338 10.7974L5.14119 10.9278C8.00938 11.3102 10.2658 13.5667 10.6483 16.4349L10.7786 17.4127C10.8102 17.6491 11.0118 17.8257 11.2504 17.8257C11.4889 17.8257 11.6906 17.6491 11.7221 17.4127L11.8525 16.4349C12.2349 13.5667 14.4913 11.3102 17.3595 10.9278L18.3374 10.7974C18.5738 10.7659 18.7504 10.5642 18.7504 10.3257C18.7504 10.0872 18.5738 9.88549 18.3374 9.85396L17.3595 9.72358C14.4913 9.34115 12.2349 7.0847 11.8525 4.21651Z"
      fill="currentColor"
    />
    <path
      d="M4.6519 14.7568L4.82063 14.2084C4.84491 14.1295 4.91781 14.0757 5.00037 14.0757C5.08292 14.0757 5.15582 14.1295 5.1801 14.2084L5.34883 14.7568C5.56525 15.4602 6.11587 16.0108 6.81925 16.2272L7.36762 16.3959C7.44652 16.4202 7.50037 16.4931 7.50037 16.5757C7.50037 16.6582 7.44652 16.7311 7.36762 16.7554L6.81926 16.9241C6.11587 17.1406 5.56525 17.6912 5.34883 18.3946L5.1801 18.9429C5.15582 19.0218 5.08292 19.0757 5.00037 19.0757C4.91781 19.0757 4.84491 19.0218 4.82063 18.9429L4.65191 18.3946C4.43548 17.6912 3.88486 17.1406 3.18147 16.9241L2.63311 16.7554C2.55421 16.7311 2.50037 16.6582 2.50037 16.5757C2.50037 16.4931 2.55421 16.4202 2.63311 16.3959L3.18148 16.2272C3.88486 16.0108 4.43548 15.4602 4.6519 14.7568Z"
      fill="currentColor"
    />
  </svg>
);

const AutoIcon = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" className="h-4 w-4">
    <path
      d="M15.167 2.20801C15.4429 2.20818 15.6668 2.43212 15.667 2.70801C15.667 2.98404 15.443 3.20783 15.167 3.20801H7.04199C4.92512 3.20801 3.20934 4.92422 3.20898 7.04102V18.958C3.20899 21.0751 4.9249 22.791 7.04199 22.791H18.959C21.0096 22.7907 22.6845 21.1805 22.7871 19.1553L22.792 18.958V10.833C22.7922 10.557 23.016 10.333 23.292 10.333C23.5679 10.3332 23.7918 10.5571 23.792 10.833V18.958L23.7861 19.207C23.6566 21.7605 21.5446 23.7907 18.959 23.791H7.04199C4.37262 23.791 2.20899 21.6274 2.20898 18.958V7.04102C2.20934 4.37194 4.37283 2.20801 7.04199 2.20801H15.167ZM20.583 1.08301C20.7261 1.08301 20.8524 1.17674 20.8945 1.31348L21.1875 2.26367C21.5626 3.48287 22.5171 4.43736 23.7363 4.8125L24.6865 5.10547C24.8233 5.14757 24.917 5.27391 24.917 5.41699C24.9169 5.55995 24.8232 5.68647 24.6865 5.72852L23.7363 6.02051C22.5172 6.39563 21.5627 7.35019 21.1875 8.56934L20.8945 9.51953C20.8524 9.6563 20.7261 9.75 20.583 9.75C20.44 9.74986 20.3135 9.65619 20.2715 9.51953L19.9795 8.56934C19.6044 7.35015 18.6498 6.39565 17.4307 6.02051L16.4805 5.72852C16.3438 5.68647 16.2501 5.55995 16.25 5.41699C16.25 5.2739 16.3437 5.14755 16.4805 5.10547L17.4307 4.8125C18.6498 4.43734 19.6044 3.48283 19.9795 2.26367L20.2715 1.31348C20.3135 1.17681 20.44 1.08315 20.583 1.08301Z"
      fill="currentColor"
    />
  </svg>
);

const modelOptions = [
  { value: "nano_banana_2", label: "Default" },
  { value: "characters", label: "Characters" },
  { value: "products", label: "Products" },
];

interface SavedCharacter {
  id: string;
  name: string;
  referenceImages: string[];
  thumbnailUrl: string | null;
}

interface SavedProduct {
  id: string;
  name: string;
  referenceImages: string[];
  thumbnailUrl: string | null;
}

const aspectRatioOptions = [
  { value: "auto", label: "Auto" },
  { value: "1:1", label: "1:1" },
  { value: "2:3", label: "2:3" },
  { value: "3:2", label: "3:2" },
  { value: "3:4", label: "3:4" },
  { value: "4:3", label: "4:3" },
  { value: "4:5", label: "4:5" },
  { value: "5:4", label: "5:4" },
  { value: "9:16", label: "9:16" },
  { value: "16:9", label: "16:9" },
  { value: "21:9", label: "21:9" },
];

const resolutionOptions = [
  { value: "1K", label: "1K" },
  { value: "2K", label: "2K" },
  { value: "4K", label: "4K" },
];

const outputFormatOptions = [
  { value: "png", label: "PNG" },
  { value: "jpeg", label: "JPG" },
  { value: "webp", label: "WebP" },
];

const CheckIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className="h-4 w-4 text-gray-400"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.99999 15.1715L19.192 5.97852L20.607 7.39252L9.99999 17.9995L3.63599 11.6355L5.04999 10.2215L9.99999 15.1715Z"
      fill="currentColor"
    />
  </svg>
);

const AspectRatioIcon1x1 = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    className="h-5 w-5 text-white"
  >
    <path
      d="M10.5 3C11.8807 3 13 4.11929 13 5.5V10.5C13 11.8807 11.8807 13 10.5 13H5.5C4.11929 13 3 11.8807 3 10.5V5.5C3 4.11929 4.11929 3 5.5 3H10.5ZM5.5 4C4.67157 4 4 4.67157 4 5.5V10.5C4 11.3284 4.67157 12 5.5 12H10.5C11.3284 12 12 11.3284 12 10.5V5.5C12 4.67157 11.3284 4 10.5 4H5.5Z"
      fill="currentColor"
    />
  </svg>
);

const AspectRatioIcon4x3 = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    className="h-5 w-5 text-white"
  >
    <path
      d="M12.5 3C13.8807 3 15 4.11929 15 5.5V11.5C15 12.8807 13.8807 14 12.5 14H3.5C2.11929 14 1 12.8807 1 11.5V5.5C1 4.11929 2.11929 3 3.5 3H12.5ZM3.5 4C2.67157 4 2 4.67157 2 5.5V11.5C2 12.3284 2.67157 13 3.5 13H12.5C13.3284 13 14 12.3284 14 11.5V5.5C14 4.67157 13.3284 4 12.5 4H3.5Z"
      fill="currentColor"
    />
  </svg>
);

const AspectRatioIcon16x9 = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    className="h-5 w-5 text-white"
  >
    <path
      d="M13.833 3.5C14.8454 3.5 15.6658 4.32064 15.666 5.33301V10.667C15.6658 11.6794 14.8454 12.5 13.833 12.5H3.16602C2.1539 12.4996 1.33318 11.6791 1.33301 10.667V5.33301C1.33318 4.32085 2.1539 3.50035 3.16602 3.5H13.833ZM3.16602 4.5C2.70619 4.50035 2.33318 4.87314 2.33301 5.33301V10.667C2.33318 11.1269 2.70619 11.4996 3.16602 11.5H13.833C14.2931 11.5 14.6658 11.1271 14.666 10.667V5.33301C14.6658 4.87292 14.2931 4.5 13.833 4.5H3.16602Z"
      fill="currentColor"
    />
  </svg>
);

const AspectRatioIcon9x16 = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    className="h-5 w-5 text-white"
  >
    <path
      d="M10.7412 1.0127C12.002 1.14057 12.9863 2.20547 12.9863 3.5V12.5C12.9863 13.8806 11.8669 14.9998 10.4863 15H6.5C5.11938 14.9999 4 13.8806 4 12.5V3.5C4 2.11936 5.11938 1.00011 6.5 1H10.4863L10.7412 1.0127ZM6.5 2C5.67167 2.00011 5 2.67164 5 3.5V12.5C5 13.3284 5.67167 13.9999 6.5 14H10.4863C11.3146 13.9998 11.9863 13.3283 11.9863 12.5V3.5C11.9863 2.72348 11.3959 2.0848 10.6396 2.00781L10.4863 2H6.5Z"
      fill="currentColor"
    />
  </svg>
);

const AspectRatioIcon3x4 = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    className="h-5 w-5 text-white"
  >
    <path
      d="M13 12.5C13 13.8807 11.8807 15 10.5 15L4.5 15C3.11929 15 2 13.8807 2 12.5L2 3.5C2 2.11929 3.11929 1 4.5 1L10.5 1C11.8807 1 13 2.11929 13 3.5L13 12.5ZM12 3.5C12 2.67157 11.3284 2 10.5 2L4.5 2C3.67157 2 3 2.67157 3 3.5L3 12.5C3 13.3284 3.67157 14 4.5 14L10.5 14C11.3284 14 12 13.3284 12 12.5L12 3.5Z"
      fill="currentColor"
    />
  </svg>
);

const AspectRatioIcon2x3 = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    className="h-5 w-5 text-white"
  >
    <path
      d="M11.5 1C12.8807 1 14 2.11929 14 3.5V12.5C14 13.8807 12.8807 15 11.5 15H4.5C3.11929 15 2 13.8807 2 12.5V3.5C2 2.11929 3.11929 1 4.5 1H11.5ZM4.5 2C3.67157 2 3 2.67157 3 3.5V12.5C3 13.3284 3.67157 14 4.5 14H11.5C12.3284 14 13 13.3284 13 12.5V3.5C13 2.67157 12.3284 2 11.5 2H4.5Z"
      fill="currentColor"
    />
  </svg>
);

const AspectRatioIcon3x2 = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    className="h-5 w-5 text-white"
  >
    <path
      d="M12.5 3C13.8807 3 15 4.11929 15 5.5V10.5C15 11.8807 13.8807 13 12.5 13H3.5C2.11929 13 1 11.8807 1 10.5V5.5C1 4.11929 2.11929 3 3.5 3H12.5ZM3.5 4C2.67157 4 2 4.67157 2 5.5V10.5C2 11.3284 2.67157 12 3.5 12H12.5C13.3284 12 14 11.3284 14 10.5V5.5C14 4.67157 13.3284 4 12.5 4H3.5Z"
      fill="currentColor"
    />
  </svg>
);

const AspectRatioIcon4x5 = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    className="h-5 w-5 text-white"
  >
    <path
      d="M11 1C12.3807 1 13.5 2.11929 13.5 3.5V12.5C13.5 13.8807 12.3807 15 11 15H5C3.61929 15 2.5 13.8807 2.5 12.5V3.5C2.5 2.11929 3.61929 1 5 1H11ZM5 2C4.17157 2 3.5 2.67157 3.5 3.5V12.5C3.5 13.3284 4.17157 14 5 14H11C11.8284 14 12.5 13.3284 12.5 12.5V3.5C12.5 2.67157 11.8284 2 11 2H5Z"
      fill="currentColor"
    />
  </svg>
);

const AspectRatioIcon5x4 = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    className="h-5 w-5 text-white"
  >
    <path
      d="M12.5 2.5C13.8807 2.5 15 3.61929 15 5V11C15 12.3807 13.8807 13.5 12.5 13.5H3.5C2.11929 13.5 1 12.3807 1 11V5C1 3.61929 2.11929 2.5 3.5 2.5H12.5ZM3.5 3.5C2.67157 3.5 2 4.17157 2 5V11C2 11.8284 2.67157 12.5 3.5 12.5H12.5C13.3284 12.5 14 11.8284 14 11V5C14 4.17157 13.3284 3.5 12.5 3.5H3.5Z"
      fill="currentColor"
    />
  </svg>
);

const ResolutionIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="h-4 w-4">
    <path
      d="M2 3.5C2 2.67157 2.67157 2 3.5 2H12.5C13.3284 2 14 2.67157 14 3.5V12.5C14 13.3284 13.3284 14 12.5 14H3.5C2.67157 14 2 13.3284 2 12.5V3.5ZM3.5 3C3.22386 3 3 3.22386 3 3.5V12.5C3 12.7761 3.22386 13 3.5 13H12.5C12.7761 13 13 12.7761 13 12.5V3.5C13 3.22386 12.7761 3 12.5 3H3.5ZM5 5.5C5 5.22386 5.22386 5 5.5 5H10.5C10.7761 5 11 5.22386 11 5.5C11 5.77614 10.7761 6 10.5 6H5.5C5.22386 6 5 5.77614 5 5.5ZM5.5 7C5.22386 7 5 7.22386 5 7.5C5 7.77614 5.22386 8 5.5 8H8.5C8.77614 8 9 7.77614 9 7.5C9 7.22386 8.77614 7 8.5 7H5.5Z"
      fill="currentColor"
    />
  </svg>
);

const FormatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="h-4 w-4">
    <path
      d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.5L13 5.5V13.5C13 13.7761 12.7761 14 12.5 14H3.5C3.22386 14 3 13.7761 3 13.5V2.5ZM4 3V13H12V6H9V3H4ZM10 3.707V5H11.293L10 3.707Z"
      fill="currentColor"
    />
  </svg>
);

const aspectRatioIcons: Record<string, React.ReactNode> = {
  auto: <AutoIcon />,
  "1:1": <AspectRatioIcon1x1 />,
  "2:3": <AspectRatioIcon2x3 />,
  "3:2": <AspectRatioIcon3x2 />,
  "3:4": <AspectRatioIcon3x4 />,
  "4:3": <AspectRatioIcon4x3 />,
  "4:5": <AspectRatioIcon4x5 />,
  "5:4": <AspectRatioIcon5x4 />,
  "9:16": <AspectRatioIcon9x16 />,
  "16:9": <AspectRatioIcon16x9 />,
  "21:9": <AspectRatioIcon16x9 />,
};

interface SelectDropdownProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  showIcons?: boolean;
}

function SelectDropdown({
  options,
  value,
  onChange,
  icon,
  showIcons = false,
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 items-center justify-between gap-2 rounded-xl border border-zinc-700/50 bg-zinc-800/50 px-3 text-sm text-white transition hover:bg-zinc-700/50"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{selectedOption?.label || "Select"}</span>
        </div>
        <ChevronDownIcon />
      </button>
      {isOpen && (
        <div className="hide-scrollbar absolute bottom-full left-0 z-50 mb-2 flex max-h-72 min-w-[240px] flex-col overflow-y-auto rounded-xl border border-zinc-700/50 bg-zinc-900 px-1 pt-2 pb-2 shadow-lg">
          {options.map((option) => {
            const isSelected = option.value === value;
            const optionIcon = showIcons
              ? aspectRatioIcons[option.value]
              : null;

            return (
              <div
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="cursor-pointer px-1.5 py-1.5 text-sm"
              >
                <div className="group flex w-full items-center gap-1">
                  {showIcons && (
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md p-1 text-white/25 transition group-hover:bg-white/10 ${isSelected ? "bg-white/10" : "bg-transparent"}`}
                    >
                      {optionIcon}
                    </div>
                  )}
                  <div
                    className={`flex h-8 flex-1 items-center justify-between rounded-md px-2 transition group-hover:bg-white/10 ${isSelected ? "bg-white/10" : ""}`}
                  >
                    <span className="text-sm text-white">{option.label}</span>
                    {isSelected && <CheckIcon />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface ReferenceImage {
  id: string;
  file?: File;
  preview: string;
  base64?: string;
  isLoading: boolean;
}

interface ImagePromptFormProps {
  onSubmit?: (data: {
    prompt: string;
    model: string;
    count: number;
    aspectRatio: string;
    resolution: string;
    outputFormat: string;
    referenceImages: string[];
  }) => void;
  initialPrompt?: string;
  initialModel?: string;
  initialSubModel?: string;
  recreateData?: {
    prompt: string;
  } | null;
  editData?: {
    imageUrl: string;
  } | null;
}

const MAX_REFERENCE_IMAGES = 8;
const MAX_IMAGE_SIZE_MB = 30;
const MAX_BASE64_SIZE = 4 * 1024 * 1024; // 4MB target for base64
const MAX_IMAGE_DIMENSION = 2048; // Max pixels on longest side

/**
 * Compress image while maintaining high quality
 * - Resizes if larger than MAX_IMAGE_DIMENSION
 * - Compresses as JPEG with quality adjustment to meet size target
 */
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Calculate new dimensions (maintain aspect ratio)
      let { width, height } = img;
      if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
        if (width > height) {
          height = Math.round((height / width) * MAX_IMAGE_DIMENSION);
          width = MAX_IMAGE_DIMENSION;
        } else {
          width = Math.round((width / height) * MAX_IMAGE_DIMENSION);
          height = MAX_IMAGE_DIMENSION;
        }
      }

      // Create canvas and draw resized image
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      // Try different quality levels to meet size target
      const qualities = [0.92, 0.85, 0.75, 0.65, 0.5];
      for (const quality of qualities) {
        const base64 = canvas.toDataURL("image/jpeg", quality);
        if (base64.length <= MAX_BASE64_SIZE) {
          resolve(base64);
          return;
        }
      }

      // If still too large, use lowest quality
      resolve(canvas.toDataURL("image/jpeg", 0.5));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
};

export default function ImagePromptForm({
  onSubmit,
  initialPrompt = "",
  initialModel,
  initialSubModel,
  recreateData,
  editData,
}: ImagePromptFormProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [model, setModel] = useState(initialModel || "nano_banana_2");
  const [subModel, setSubModel] = useState(initialSubModel || "");
  const [imageCount, setImageCount] = useState(1);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [resolution, setResolution] = useState("1K");
  const [outputFormat, setOutputFormat] = useState("png");
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);
  const [savedCharacters, setSavedCharacters] = useState<SavedCharacter[]>([]);
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxImages = 4;

  // Fetch saved characters and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [charsRes, prodsRes] = await Promise.all([
          fetch("/api/characters"),
          fetch("/api/products"),
        ]);
        if (charsRes.ok) {
          const chars = await charsRes.json();
          setSavedCharacters(chars);
        }
        if (prodsRes.ok) {
          const prods = await prodsRes.json();
          setSavedProducts(prods);
        }
      } catch (error) {
        console.error("Failed to fetch characters/products:", error);
      }
    };
    fetchData();
  }, []);

  // Build dynamic options for characters and products
  const characterOptions = savedCharacters.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const productOptions = savedProducts.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  // Get selected character/product reference images
  const getSelectedReferenceImages = useCallback((): string[] => {
    if (model === "characters" && subModel) {
      const char = savedCharacters.find((c) => c.id === subModel);
      return char?.referenceImages || [];
    }
    if (model === "products" && subModel) {
      const prod = savedProducts.find((p) => p.id === subModel);
      return prod?.referenceImages || [];
    }
    return [];
  }, [model, subModel, savedCharacters, savedProducts]);

  // Handle initial model/subModel from URL params
  useEffect(() => {
    if (initialModel) {
      setModel(initialModel);
    }
    if (initialSubModel) {
      setSubModel(initialSubModel);
    }
  }, [initialModel, initialSubModel]);

  // Handle recreate data
  useEffect(() => {
    if (recreateData) {
      setPrompt(recreateData.prompt);
      // Clear any existing reference images for a fresh start
      setReferenceImages([]);
    }
  }, [recreateData]);

  // Handle edit data - load image from URL and clear prompt
  useEffect(() => {
    if (!editData?.imageUrl) return;

    const loadImageFromUrl = async () => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      // Add placeholder with loading state
      setReferenceImages([
        {
          id,
          preview: editData.imageUrl,
          isLoading: true,
        },
      ]);

      // Clear the prompt for editing
      setPrompt("");

      try {
        // Fetch the image and convert to blob
        const response = await fetch(editData.imageUrl);
        if (!response.ok) throw new Error("Failed to fetch image");

        const blob = await response.blob();
        const file = new File([blob], "reference.jpg", {
          type: blob.type || "image/jpeg",
        });

        // Compress the image
        const base64 = await compressImage(file);

        setReferenceImages([
          {
            id,
            preview: editData.imageUrl,
            base64,
            isLoading: false,
          },
        ]);
      } catch (error) {
        console.error("Failed to load image for editing:", error);
        // Remove the failed image
        setReferenceImages([]);
      }
    };

    loadImageFromUrl();
  }, [editData]);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const validFiles: File[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.match(/^image\/(jpeg|png|webp)$/)) continue;
        if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) continue;
        if (referenceImages.length + validFiles.length >= MAX_REFERENCE_IMAGES)
          break;
        validFiles.push(file);
      }

      // First, add images with loading state
      const pendingImages: ReferenceImage[] = validFiles.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        preview: URL.createObjectURL(file),
        isLoading: true,
      }));

      setReferenceImages((prev) =>
        [...prev, ...pendingImages].slice(0, MAX_REFERENCE_IMAGES)
      );
      e.target.value = "";

      // Then compress and convert to base64, update each image
      for (const img of pendingImages) {
        try {
          if (!img.file) continue;
          // Compress image to stay under API size limits while maintaining quality
          const base64 = await compressImage(img.file);
          setReferenceImages((prev) =>
            prev.map((i) =>
              i.id === img.id ? { ...i, base64, isLoading: false } : i
            )
          );
        } catch {
          // Remove failed image
          setReferenceImages((prev) => prev.filter((i) => i.id !== img.id));
        }
      }
    },
    [referenceImages.length]
  );

  const removeReferenceImage = useCallback((id: string) => {
    setReferenceImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const isImagesLoading = referenceImages.some((img) => img.isLoading);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isImagesLoading) return;

    // Get manually uploaded reference images (base64)
    const uploadedImageData = referenceImages
      .filter((img) => img.base64)
      .map((img) => img.base64 as string);

    // Get character/product reference images (URLs)
    const savedReferenceImages = getSelectedReferenceImages();

    // Combine both - saved images first, then uploaded
    const allReferenceImages = [...savedReferenceImages, ...uploadedImageData];

    onSubmit?.({
      prompt,
      model,
      count: imageCount,
      aspectRatio,
      resolution,
      outputFormat,
      referenceImages: allReferenceImages,
    });
  };

  const incrementCount = () => {
    setImageCount((prev) => Math.min(prev + 1, maxImages));
  };

  const decrementCount = () => {
    setImageCount((prev) => Math.max(prev - 1, 1));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed inset-x-1/2 bottom-4 z-20 hidden w-full -translate-x-1/2 rounded-[2rem] border border-zinc-700/50 bg-[#131313E5] p-[22px] backdrop-blur-[20.9px] md:block lg:max-w-[65rem] lg:min-w-[1000px]"
    >
      <fieldset className="relative z-20 flex gap-3">
        {/* Left section - Prompt input and controls */}
        <div className="min-h-0 min-w-0 flex-1 space-y-2">
          {/* Reference images preview */}
          {referenceImages.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {referenceImages.map((img) => (
                <div key={img.id} className="group relative shrink-0">
                  <div className="relative size-14 rounded-xl bg-zinc-800">
                    {img.isLoading ? (
                      <div className="size-full animate-[shimmer_1.5s_infinite] animate-pulse rounded-xl bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-[length:200%_100%]" />
                    ) : (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.preview}
                          alt="Reference"
                          className="size-full rounded-xl object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeReferenceImage(img.id)}
                          className="absolute -top-3 -right-3 z-10 grid h-6 w-6 items-center justify-center rounded-lg border border-zinc-600 bg-zinc-800 text-white transition hover:bg-zinc-700 xl:opacity-0 xl:group-hover:opacity-100"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            className="h-3.5 w-3.5"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M3.81246 3.81246C4.00772 3.6172 4.32431 3.6172 4.51957 3.81246L9.99935 9.29224L15.4791 3.81246C15.6744 3.6172 15.991 3.6172 16.1862 3.81246C16.3815 4.00772 16.3815 4.32431 16.1862 4.51957L10.7065 9.99935L16.1862 15.4791C16.3815 15.6744 16.3815 15.991 16.1862 16.1862C15.991 16.3815 15.6744 16.3815 15.4791 16.1862L9.99935 10.7065L4.51957 16.1862C4.32431 16.3815 4.00772 16.3815 3.81246 16.1862C3.6172 15.991 3.6172 15.6744 3.81246 15.4791L9.29224 9.99935L3.81246 4.51957C3.6172 4.32431 3.6172 4.00772 3.81246 3.81246Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {referenceImages.length < MAX_REFERENCE_IMAGES && (
                <div className="relative size-14 shrink-0 rounded-xl bg-zinc-800">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="grid size-full cursor-pointer items-center justify-center text-white transition active:opacity-60"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      className="size-4"
                    >
                      <path
                        d="M9.33301 1.16699C9.60915 1.16699 9.83301 1.39085 9.83301 1.66699C9.83283 1.94299 9.60904 2.16699 9.33301 2.16699H4.33301C3.13654 2.16717 2.16602 3.13748 2.16602 4.33398V11.667L2.17773 11.8887C2.28233 12.9164 3.10552 13.7304 4.13672 13.8232L8.89844 9.06055C9.87476 8.08439 11.4583 8.08429 12.4346 9.06055L13.833 10.459V6.66699C13.833 6.39096 14.057 6.16717 14.333 6.16699C14.6091 6.16699 14.833 6.39085 14.833 6.66699V11.667C14.8328 13.4157 13.4148 14.834 11.666 14.834H4.33301C2.63906 14.8338 1.25593 13.5029 1.1709 11.8301L1.16602 11.667V4.33398C1.16602 2.58519 2.58425 1.16717 4.33301 1.16699H9.33301ZM11.7266 9.76855C11.1408 9.18277 10.1913 9.18277 9.60547 9.76855L5.54004 13.834H11.666C12.796 13.834 13.7244 12.9683 13.8242 11.8643L11.7266 9.76855ZM6.33301 4.5C7.34553 4.5 8.16602 5.32146 8.16602 6.33398C8.16567 7.34621 7.34531 8.16699 6.33301 8.16699C5.32085 8.16682 4.50035 7.3461 4.5 6.33398C4.5 5.32157 5.32063 4.50017 6.33301 4.5ZM6.33301 5.5C5.87292 5.50017 5.5 5.87385 5.5 6.33398C5.50035 6.79382 5.87313 7.16682 6.33301 7.16699C6.79303 7.16699 7.16567 6.79392 7.16602 6.33398C7.16602 5.87375 6.79325 5.5 6.33301 5.5ZM13 0.166992C13.276 0.167168 13.5 0.390958 13.5 0.666992V2.5H15.333C15.609 2.5 15.8328 2.72401 15.833 3C15.8328 3.27599 15.609 3.5 15.333 3.5H13.5V5.33398C13.4997 5.60972 13.2758 5.83381 13 5.83398C12.7242 5.83381 12.5003 5.60972 12.5 5.33398V3.5H10.666C10.3903 3.49965 10.1662 3.27578 10.166 3C10.1662 2.72422 10.3903 2.50035 10.666 2.5H12.5V0.666992C12.5 0.390957 12.724 0.167166 13 0.166992Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Prompt row */}
          <div className="flex gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={handleFileSelect}
            />
            {referenceImages.length === 0 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative -top-[5.5px] grid h-8 w-8 shrink-0 items-center justify-center rounded-[0.625rem] border border-zinc-700/50 bg-zinc-800/50 text-white transition hover:bg-cyan-400/10 hover:text-cyan-400"
                title="Add reference images (max 8)"
              >
                <PlusIcon />
              </button>
            )}
            <textarea
              name="prompt"
              placeholder="Describe the scene you imagine"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!isImagesLoading && prompt.trim()) {
                    handleSubmit(e as unknown as React.FormEvent);
                  }
                }
              }}
              className="hide-scrollbar h-10 min-h-[40px] w-full resize-none rounded-none border-none bg-transparent p-0 text-[15px] text-white placeholder:text-gray-500 focus:outline-none"
            />
          </div>

          {/* Controls row */}
          <div className="flex h-9 items-center gap-2">
            {/* Model selector */}
            <SelectDropdown
              options={modelOptions}
              value={model}
              onChange={(value) => {
                setModel(value);
                setSubModel("");
              }}
            />

            {/* Secondary selector for Characters/Products */}
            {model === "characters" && characterOptions.length > 0 && (
              <SelectDropdown
                options={characterOptions}
                value={subModel}
                onChange={setSubModel}
              />
            )}
            {model === "characters" && characterOptions.length === 0 && (
              <a
                href="/create-character"
                className="flex h-10 items-center gap-2 rounded-xl border border-dashed border-zinc-600 bg-zinc-800/30 px-3 text-sm text-gray-400 transition hover:border-cyan-400/50 hover:text-cyan-400"
              >
                + Create a character
              </a>
            )}
            {model === "products" && productOptions.length > 0 && (
              <SelectDropdown
                options={productOptions}
                value={subModel}
                onChange={setSubModel}
              />
            )}
            {model === "products" && productOptions.length === 0 && (
              <a
                href="/products"
                className="flex h-10 items-center gap-2 rounded-xl border border-dashed border-zinc-600 bg-zinc-800/30 px-3 text-sm text-gray-400 transition hover:border-cyan-400/50 hover:text-cyan-400"
              >
                + Create a product
              </a>
            )}

            {/* Image count selector */}
            <div className="flex h-10 items-center gap-1 rounded-xl border border-zinc-700/50 bg-zinc-800/50 px-3">
              <button
                type="button"
                onClick={decrementCount}
                disabled={imageCount <= 1}
                className="text-gray-400 transition-colors hover:text-white disabled:opacity-40 disabled:hover:text-gray-400"
              >
                <MinusIcon />
              </button>
              <span className="w-8 text-center text-sm font-semibold text-white">
                {imageCount}
                <span className="text-gray-400">/{maxImages}</span>
              </span>
              <button
                type="button"
                onClick={incrementCount}
                disabled={imageCount >= maxImages}
                className="text-gray-400 transition-colors hover:text-white disabled:opacity-40 disabled:hover:text-gray-400"
              >
                <PlusIcon />
              </button>
            </div>

            {/* Aspect ratio selector */}
            <SelectDropdown
              options={aspectRatioOptions}
              value={aspectRatio}
              onChange={setAspectRatio}
              icon={aspectRatioIcons[aspectRatio] || <AutoIcon />}
              showIcons
            />

            {/* Resolution selector */}
            <SelectDropdown
              options={resolutionOptions}
              value={resolution}
              onChange={setResolution}
              icon={<ResolutionIcon />}
            />

            {/* Output format selector */}
            <SelectDropdown
              options={outputFormatOptions}
              value={outputFormat}
              onChange={setOutputFormat}
              icon={<FormatIcon />}
            />
          </div>
        </div>

        {/* Right section - Generate button */}
        <aside className="flex h-[84px] items-end justify-end gap-3 self-end">
          <button
            type="submit"
            disabled={isImagesLoading}
            className="inline-grid h-full w-36 grid-flow-col items-center justify-center gap-2 rounded-xl bg-cyan-400 px-2.5 text-sm font-semibold text-black transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                {isImagesLoading ? "Uploading..." : "Generate"}
              </span>
              <div className="flex items-center gap-0.5">
                <SparkleIcon />
                <span>{imageCount}</span>
              </div>
            </div>
          </button>
        </aside>
      </fieldset>
    </form>
  );
}
