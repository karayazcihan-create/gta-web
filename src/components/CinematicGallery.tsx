import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { GALLERY_ITEMS, GalleryCategory } from '../data/viceCityData';
import { ResilientImage } from './ResilientImage';

const CATEGORIES: GalleryCategory[] = [
  'All',
  'Streets & Coast',
  'Nightlife',
  'Showroom',
  'Characters',
];

export function CinematicGallery() {
  const [filter, setFilter] = useState<GalleryCategory>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const items = useMemo(() => {
    if (filter === 'All') return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter((item) => item.category === filter);
  }, [filter]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % items.length,
        );
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + items.length) % items.length,
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, items.length]);

  const activeItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <section
      id="gallery"
      className="relative border-t border-white/5 bg-[#050508] py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header + Filter Bar */}
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-[#00e5ff]">
              05 · Visual Monograph
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Cinematic Gallery
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setFilter(cat);
                  setLightboxIndex(null);
                }}
                className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00e5ff] ${
                  filter === cat
                    ? 'bg-[#ff2e93] text-white'
                    : 'bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Asymmetric Editorial Photo Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, idx) => {
            const isWide = item.featured && filter === 'All';
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightboxIndex(idx)}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b12] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00e5ff] ${
                  isWide ? 'sm:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div
                  className={`w-full overflow-hidden ${
                    isWide ? 'aspect-[16/9]' : 'aspect-[4/3]'
                  }`}
                >
                  <ResilientImage
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    fallbackLabel={item.title}
                  />
                </div>

                {/* Scrim & Editorial Caption */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-85 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-black/60 text-zinc-200 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Maximize2 className="h-4 w-4" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[11px] font-medium text-[#00e5ff]">
                    {item.category} · {item.location}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-white">
                    {item.title}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Full-Screen Lightbox Image Viewer */}
      <AnimatePresence>
        {activeItem && lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 p-4 sm:p-8"
            onClick={() => setLightboxIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label={activeItem.title}
          >
            <div className="flex items-center justify-between">
              <div className="text-xs text-zinc-400">
                <span className="font-mono tabular-nums text-white">
                  0{lightboxIndex + 1} / 0{items.length}
                </span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span>{activeItem.cameraSpec}</span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                aria-label="Close full-screen viewer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 bg-white/[0.05] text-white transition-colors hover:border-[#ff2e93]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              className="relative mx-auto flex max-h-[75vh] w-full max-w-6xl flex-1 items-center justify-center py-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((lightboxIndex - 1 + items.length) % items.length)
                }
                aria-label="Previous gallery image"
                className="mr-3 hidden h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/[0.05] text-white hover:border-[#00e5ff] sm:inline-flex"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.22 }}
                className="relative h-full w-full overflow-hidden rounded-xl border border-white/10"
              >
                <ResilientImage
                  src={activeItem.image}
                  alt={activeItem.title}
                  className="mx-auto max-h-[72vh] w-full object-contain"
                  fallbackLabel={activeItem.title}
                />
              </motion.div>

              <button
                type="button"
                onClick={() => setLightboxIndex((lightboxIndex + 1) % items.length)}
                aria-label="Next gallery image"
                className="ml-3 hidden h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/[0.05] text-white hover:border-[#00e5ff] sm:inline-flex"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <div
              className="mx-auto flex w-full max-w-6xl flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <p className="text-xs text-[#ff2e93]">
                  {activeItem.category} · {activeItem.location}
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold text-white">
                  {activeItem.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 sm:hidden">
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((lightboxIndex - 1 + items.length) % items.length)
                  }
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxIndex((lightboxIndex + 1) % items.length)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
