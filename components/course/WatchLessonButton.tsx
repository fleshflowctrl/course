"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
type Props = {
  lessonNumber: number;
  title: string;
  /** Passed from server so SSR and client match. */
  storageConfigured: boolean;
};

export function WatchLessonButton({
  lessonNumber,
  title,
  storageConfigured,
}: Props) {
  const dialogTitleId = useId();
  const [open, setOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setVideoUrl(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  async function openPlayer() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/course/video-url?lesson=${encodeURIComponent(String(lessonNumber))}`,
      );
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Could not load video");
      }
      if (!data.url) {
        throw new Error("No playback URL returned");
      }
      setVideoUrl(data.url);
      setOpen(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!storageConfigured) {
    return null;
  }

  return (
    <div className="flex shrink-0 flex-col items-stretch gap-1 sm:items-end">
      <Button
        type="button"
        size="md"
        className="w-full justify-center sm:w-auto"
        disabled={loading}
        aria-busy={loading}
        aria-label={`Watch: ${title}`}
        onClick={openPlayer}
      >
        {loading ? "Loading…" : "Watch"}
      </Button>
      {error && !open ? (
        <p className="max-w-[14rem] text-right text-xs text-error" role="alert">
          {error}
        </p>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close video"
            onClick={close}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            className="relative z-[101] flex w-full max-w-4xl flex-col rounded-t-card border border-divider bg-cream shadow-warm sm:rounded-card"
          >
            <div className="flex items-start justify-between gap-3 border-b border-divider px-4 py-3 sm:px-5">
              <p
                id={dialogTitleId}
                className="min-w-0 pr-2 font-heading text-lg font-semibold leading-snug text-taupe sm:text-xl"
              >
                <span className="text-brown">Lesson {lessonNumber}.</span> {title}
              </p>
              <button
                type="button"
                className="shrink-0 rounded-full p-1.5 text-brown hover:bg-beige/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                onClick={close}
                aria-label="Close"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="bg-black px-2 py-3 sm:px-4 sm:py-4">
              {videoUrl ? (
                <video
                  key={videoUrl}
                  className="mx-auto aspect-video w-full max-h-[70vh] rounded-md bg-black"
                  controls
                  playsInline
                  preload="metadata"
                  src={videoUrl}
                />
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
