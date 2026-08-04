/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useRef, useState } from "react";

import GalleryLightbox from "./GalleryLightbox";
import type { GalleryData } from "./gallery";

const SWIPE_THRESHOLD = 50;

const COLUMN_CLASSES: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
};

/**
 * Фото-галерея, вставленная в контент через CKEditor.
 * `carousel` — слайдер с превью, `grid` — плитка. В обоих случаях клик
 * открывает полноэкранный просмотр.
 */
export default function ArdiGallery({ layout, columns, images }: GalleryData) {
  const [active, setActive] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(-1);

  if (!images.length) return null;
  if (layout === "grid") {
    return (
      <>
        <GalleryGrid columns={columns} images={images} onOpen={setZoomIndex} />
        {zoomIndex >= 0 && (
          <GalleryLightbox
            images={images}
            index={zoomIndex}
            onIndexChange={setZoomIndex}
            onClose={() => setZoomIndex(-1)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <GalleryCarousel
        images={images}
        active={active}
        onActiveChange={setActive}
        onOpen={() => setZoomIndex(active)}
      />
      {zoomIndex >= 0 && (
        <GalleryLightbox
          images={images}
          index={zoomIndex}
          onIndexChange={(next) => {
            setZoomIndex(next);
            setActive(next);
          }}
          onClose={() => setZoomIndex(-1)}
        />
      )}
    </>
  );
}

function GalleryGrid({
  columns,
  images,
  onOpen,
}: Pick<GalleryData, "columns" | "images"> & { onOpen: (index: number) => void }) {
  return (
    <div className={`not-prose my-8 grid gap-3 sm:gap-4 ${COLUMN_CLASSES[columns] || COLUMN_CLASSES[3]}`}>
      {images.map((image, index) => (
        <figure key={`${image.src}-${index}`} className="m-0">
          <button
            type="button"
            onClick={() => onOpen(index)}
            aria-label={`Открыть фото ${index + 1}`}
            className="group relative block w-full cursor-zoom-in overflow-hidden rounded-xl bg-gray-100 ring-1 ring-black/5 transition hover:ring-black/10"
          >
            <img
              src={image.src}
              alt={image.caption || `Фото ${index + 1}`}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
            <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
          </button>
          {image.caption && (
            <figcaption className="mt-2 px-0.5 text-xs leading-snug text-gray-500">{image.caption}</figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

function GalleryCarousel({
  images,
  active,
  onActiveChange,
  onOpen,
}: {
  images: GalleryData["images"];
  active: number;
  onActiveChange: (index: number) => void;
  onOpen: () => void;
}) {
  const swipeStart = useRef<number | null>(null);
  const swiped = useRef(false);

  const go = useCallback(
    (delta: number) => {
      if (images.length < 2) return;
      onActiveChange((active + delta + images.length) % images.length);
    },
    [active, images.length, onActiveChange],
  );

  const current = images[active];

  return (
    <div
      className="not-prose my-8"
      role="group"
      aria-roledescription="карусель"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          go(1);
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          go(-1);
        }
      }}
    >
      <div className="group relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm ring-1 ring-black/5">
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(-${active * 100}%)` }}
          onPointerDown={(event) => {
            swipeStart.current = event.clientX;
            swiped.current = false;
          }}
          onPointerUp={(event) => {
            if (swipeStart.current === null) return;
            const delta = event.clientX - swipeStart.current;
            swipeStart.current = null;
            if (Math.abs(delta) > SWIPE_THRESHOLD) {
              swiped.current = true;
              go(delta < 0 ? 1 : -1);
            }
          }}
        >
          {images.map((image, index) => (
            <div key={`${image.src}-${index}`} className="w-full shrink-0">
              <img
                src={image.src}
                alt={image.caption || `Фото ${index + 1}`}
                loading={index === 0 ? "eager" : "lazy"}
                draggable={false}
                onClick={() => {
                  if (!swiped.current) onOpen();
                }}
                className="aspect-[16/10] w-full cursor-zoom-in bg-gray-100 object-cover select-none"
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <CarouselArrow side="left" onClick={() => go(-1)} />
            <CarouselArrow side="right" onClick={() => go(1)} />
            <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium tabular-nums text-white backdrop-blur-sm">
              {active + 1} / {images.length}
            </span>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center gap-1.5 bg-gradient-to-t from-black/45 to-transparent px-4 pb-3 pt-8">
              {images.map((image, index) => (
                <button
                  key={`dot-${image.src}-${index}`}
                  type="button"
                  aria-label={`Перейти к фото ${index + 1}`}
                  aria-current={index === active}
                  onClick={() => onActiveChange(index)}
                  className={`pointer-events-auto h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                    index === active ? "w-6 bg-white" : "w-1.5 bg-white/55 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {current?.caption && (
        <p className="mt-3 text-center text-sm leading-snug text-gray-500">{current.caption}</p>
      )}

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {images.map((image, index) => (
            <button
              key={`thumb-${image.src}-${index}`}
              type="button"
              aria-label={`Показать фото ${index + 1}`}
              onClick={() => onActiveChange(index)}
              className={`h-14 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg ring-2 transition sm:h-16 sm:w-24 ${
                index === active ? "opacity-100 ring-[#9f6bdb]" : "opacity-60 ring-transparent hover:opacity-100"
              }`}
            >
              <img src={image.src} alt="" loading="lazy" draggable={false} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CarouselArrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={side === "left" ? "Предыдущее фото" : "Следующее фото"}
      onClick={onClick}
      className={`absolute top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/85 p-2.5 text-gray-800 opacity-0 shadow-md backdrop-blur-sm transition hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 max-sm:opacity-100 ${
        side === "left" ? "left-3" : "right-3"
      }`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points={side === "left" ? "15,18 9,12 15,6" : "9,18 15,12 9,6"} />
      </svg>
    </button>
  );
}
