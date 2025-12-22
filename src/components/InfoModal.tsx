"use client";

import { useState } from "react";

interface InfoModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  command?: string;
  onClose: () => void;
}

export default function InfoModal({
  isOpen,
  title,
  message,
  command,
  onClose,
}: InfoModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!command) return;
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{ willChange: "opacity" }}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      {/* Modal */}
      <div
        className={`relative z-10 w-full max-w-sm rounded-xl border border-white/10 bg-black/60 p-6 shadow-2xl backdrop-blur-xl transition-all duration-200 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        style={{ willChange: "transform, opacity" }}
      >
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm text-zinc-300">{message}</p>

        {command && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 p-3">
            <code className="flex-1 text-sm text-pink-400">{command}</code>
            <button
              onClick={handleCopy}
              className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
