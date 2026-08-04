/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import type { GalleryImage } from "./gallery";

interface GalleryLightboxProps {
  images: GalleryImage[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const SWIPE_THRESHOLD = 60;

export default function GalleryLightbox({ images, index, onIndexChange, onClose }: GalleryLightboxProps) {
  const swipeStart = useRef<number | null>(null);

  const go = useCallback(
    (delta: number) => {
      if (images.length < 2) return;
      onIndexChange((index + delta + images.length) % images.length);
    },
    [images.length, index, onIndexChange],
  );

  // Блокируем прокрутку страницы, пока открыт просмотр.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") go(1);
      else if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go, onClose]);

  // Просмотрщик всегда открывается по клику, т.е. только на клиенте.
  if (typeof document === "undefined") return null;

  const current = images[index];
  if (!current) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-black/95 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр изображения"
      onClick={onClose}
      onPointerDown={(event) => {
        swipeStart.current = event.clientX;
      }}
      onPointerUp={(event) => {
        if (swipeStart.current === null) return;
        const delta = event.clientX - swipeStart.current;
        swipeStart.current = null;
        if (Math.abs(delta) > SWIPE_THRESHOLD) go(delta < 0 ? 1 : -1);
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 text-white/80 sm:px-6">
        <span className="text-sm tabular-nums">
          {index + 1} / {images.length}
        </span>
        <button
          type="button"
          aria-label="Закрыть"
          className="cursor-pointer rounded-full bg-white/10 p-2 transition hover:bg-white/20 hover:text-white"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
        >
          <CloseIcon />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-16">
        {images.length > 1 && (
          <NavButton side="left" label="Предыдущее фото" onClick={() => go(-1)} />
        )}

        <figure className="flex h-full max-h-full w-full flex-col items-center justify-center gap-3">
          <img
            key={current.src}
            src={current.src}
            alt={current.caption || `Изображение ${index + 1}`}
            className="max-h-full max-w-full rounded-xl object-contain shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(event) => event.stopPropagation()}
            draggable={false}
          />
          {current.caption && (
            <figcaption className="max-w-2xl text-center text-sm text-white/70">{current.caption}</figcaption>
          )}
        </figure>

        {images.length > 1 && <NavButton side="right" label="Следующее фото" onClick={() => go(1)} />}
      </div>

      {images.length > 1 && (
        <div
          className="flex justify-center gap-2 overflow-x-auto px-4 pb-5"
          onClick={(event) => event.stopPropagation()}
        >
          {images.map((image, itemIndex) => (
            <button
              key={`${image.src}-${itemIndex}`}
              type="button"
              aria-label={`Перейти к фото ${itemIndex + 1}`}
              onClick={() => onIndexChange(itemIndex)}
              className={`h-14 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition ${
                itemIndex === index ? "border-white opacity-100" : "border-transparent opacity-50 hover:opacity-90"
              }`}
            >
              <img src={image.src} alt="" className="h-full w-full object-cover" loading="lazy" draggable={false} />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}

function NavButton({ side, label, onClick }: { side: "left" | "right"; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={`absolute top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-3 text-white/80 transition hover:bg-white/20 hover:text-white ${
        side === "left" ? "left-2 sm:left-4" : "right-2 sm:right-4"
      }`}
    >
      <ChevronIcon direction={side} />
    </button>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={direction === "left" ? "15,18 9,12 15,6" : "9,18 15,12 9,6"} />
    </svg>
  );
}
