import React, { useState, useEffect, useRef } from 'react';
import autoImages from 'virtual:images';

interface GallerySectionProps {
  onToast: (msg: string) => void;
  groomNameEn?: string;
  brideNameEn?: string;
}

interface RingPhoto {
  id: number;
  url: string;
  titleEn?: string;
  titleAr?: string;
}

const DEFAULT_TITLES = [
  'Adham & Aml',
  'فرحة العمر',
  'أدهم ♡ أمل',
  'ليلة الزفاف',
  'أجمل اللحظات',
  'فرحتنا الغالية',
  'معاً دائماً',
  'أيام الهنا',
];

const FALLBACK_PLACEHOLDERS = [
  'https://placehold.co/600x600/1e1b18/f6e09e?text=Adham+%26+Aml+1',
  'https://placehold.co/600x600/172030/fde68a?text=Adham+%26+Aml+2',
  'https://placehold.co/600x600/241c15/fef08a?text=Adham+%26+Aml+3',
  'https://placehold.co/600x600/121826/facc15?text=Adham+%26+Aml+4',
];

const mapUrlsToPhotos = (urls: string[]): RingPhoto[] => {
  if (!urls || urls.length === 0) {
    return FALLBACK_PLACEHOLDERS.map((url, idx) => ({
      id: idx,
      url,
      titleEn: idx === 0 ? 'Adham & Aml' : undefined,
      titleAr: idx > 0 ? DEFAULT_TITLES[idx] : undefined,
    }));
  }

  return urls.map((url, idx) => ({
    id: idx,
    url,
    titleEn: idx === 0 ? 'Adham & Aml' : undefined,
    titleAr: idx > 0 ? (DEFAULT_TITLES[idx] || `صورة ${idx + 1}`) : undefined,
  }));
};

export const GallerySection: React.FC<GallerySectionProps> = ({
  onToast,
  groomNameEn = 'Adham',
  brideNameEn = 'Aml',
}) => {
  const [photos, setPhotos] = useState<RingPhoto[]>(() => mapUrlsToPhotos(autoImages));
  const [currentFrontIndex, setCurrentFrontIndex] = useState(0);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [activeModalPhoto, setActiveModalPhoto] = useState<RingPhoto | null>(null);

  const shuffleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Drag and Swipe Tracking Refs
  const touchStartXRef = useRef<number | null>(null);
  const dragStartXRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const hasSwipedRef = useRef(false);

  // Fetch images.json at runtime to pick up any new/renamed images dynamically
  useEffect(() => {
    fetch('/images/images.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((fetchedUrls: string[] | null) => {
        if (Array.isArray(fetchedUrls) && fetchedUrls.length > 0) {
          setPhotos(mapUrlsToPhotos(fetchedUrls));
        }
      })
      .catch(() => {});
  }, []);

  const total = photos.length;

  const rotateRingGallery = (step: number) => {
    if (total === 0) return;
    setCurrentFrontIndex((prev) => (prev + step + total) % total);
  };

  const bringRingPhotoToFront = (index: number) => {
    setCurrentFrontIndex(index);
  };

  // Continuous auto-shuffle every 3.2s with hover/modal pause
  useEffect(() => {
    if (shuffleTimerRef.current) {
      clearInterval(shuffleTimerRef.current);
    }

    if (total > 1) {
      shuffleTimerRef.current = setInterval(() => {
        if (!isHoverPaused && !activeModalPhoto) {
          setCurrentFrontIndex((prev) => (prev + 1) % total);
        }
      }, 3200);
    }

    return () => {
      if (shuffleTimerRef.current) {
        clearInterval(shuffleTimerRef.current);
      }
    };
  }, [isHoverPaused, activeModalPhoto, total]);

  // Close modal on Escape key press
  useEffect(() => {
    if (!activeModalPhoto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalPhoto(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalPhoto]);

  // Touch Swipe Handlers (Slide to next/prev)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    hasSwipedRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || hasSwipedRef.current) return;
    const diffX = e.touches[0].clientX - touchStartXRef.current;
    const threshold = 40; // px
    if (diffX < -threshold) {
      // Swiped Left -> Next Image
      rotateRingGallery(1);
      hasSwipedRef.current = true;
    } else if (diffX > threshold) {
      // Swiped Right -> Previous Image
      rotateRingGallery(-1);
      hasSwipedRef.current = true;
    }
  };

  const handleTouchEnd = () => {
    touchStartXRef.current = null;
    // Delay resetting hasSwipedRef so synthetic mobile click after swipe is safely ignored
    setTimeout(() => {
      hasSwipedRef.current = false;
    }, 120);
  };

  // Mouse Drag Handlers (Slide to next/prev on desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    hasSwipedRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || dragStartXRef.current === null || hasSwipedRef.current) return;
    const diffX = e.clientX - dragStartXRef.current;
    const threshold = 45;
    if (diffX < -threshold) {
      rotateRingGallery(1);
      hasSwipedRef.current = true;
    } else if (diffX > threshold) {
      rotateRingGallery(-1);
      hasSwipedRef.current = true;
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    dragStartXRef.current = null;
    setTimeout(() => {
      hasSwipedRef.current = false;
    }, 120);
  };

  // Hover handlers: pause auto-shuffle only (full image opens on press/click)
  const handleCardMouseEnter = () => {
    setIsHoverPaused(true);
  };

  const handleCardMouseLeave = () => {
    setIsHoverPaused(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (result) {
        setPhotos((prev) =>
          prev.map((photo) => (photo.id === slotIndex ? { ...photo, url: result } : photo))
        );
        onToast('تم تحديث الصورة في خاتم العروسين بنجاح ✨');
      }
    };
    reader.readAsDataURL(file);
  };

  const getSlotClass = (idx: number, frontIdx: number, count: number) => {
    if (count <= 4) {
      const rel = (idx - frontIdx + count) % count;
      return `ring-slot-${rel}`;
    }
    const offset = (idx - frontIdx + count) % count;
    if (offset === 0) return 'ring-slot-0'; // Front
    if (offset === 1) return 'ring-slot-1'; // Right
    if (offset === count - 1) return 'ring-slot-3'; // Left
    if (offset === 2) return 'ring-slot-2'; // Back
    return 'ring-slot-hidden'; // Hidden behind in 3D orbit
  };

  return (
    <section id="gallerySection" className="py-6 sm:py-10">
      <div className="celestial-card rounded-3xl p-5 sm:p-10 text-center relative overflow-hidden">
        <span className="text-xs font-ui-ar text-amber-300/90 block">خاتم الذكريات المتحرك</span>
        <h2 className="font-arabic text-2xl sm:text-4xl font-bold text-amber-100 mt-1">
          ألبوم صور العروسين{' '}
          <span className="name-italic-script text-amber-300 text-3xl sm:text-4xl mx-1" dir="ltr">
            {groomNameEn} &amp; {brideNameEn}
          </span>
        </h2>
        <p className="font-arabic text-sm sm:text-lg text-amber-200/80 mt-1">
          اضغط على أي صورة لعرضها بالحجم الكامل • اسحب يميناً أو يساراً للتنقل بين الصور ↔
        </p>

        {/* 3D Golden Wedding Ring Stage (Supports Drag & Swipe Sliding) */}
        <div
          className="wedding-ring-stage my-6 sm:my-8 flex items-center justify-center select-none cursor-grab active:cursor-grabbing touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            handleMouseUp();
            setIsHoverPaused(false);
          }}
        >
          <div className="golden-wedding-band-halo">
            {/* Diamond Solitaire Crest at the Top of the Wedding Band */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-11 h-11 flex items-center justify-center">
              <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-[0_0_16px_rgba(255,255,255,0.95)]">
                <polygon points="30,4 52,20 30,56 8,20" fill="#e0f2fe" stroke="#fef08a" strokeWidth="2.5" />
                <polygon points="30,4 42,20 30,56 18,20" fill="#bae6fd" opacity={0.75} />
                <line x1="8" y1="20" x2="52" y2="20" stroke="#ffffff" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Dynamic Ring Photo Cards (Click / Press to View Full Image) */}
          {photos.map((item) => {
            const slotClass = getSlotClass(item.id, currentFrontIndex, total);
            return (
              <div
                key={item.id}
                id={`ringCard-${item.id}`}
                onClick={() => {
                  if (hasSwipedRef.current) return;
                  bringRingPhotoToFront(item.id);
                  setActiveModalPhoto(item);
                }}
                onMouseEnter={handleCardMouseEnter}
                onMouseLeave={handleCardMouseLeave}
                className={`ring-photo-item ${slotClass} w-56 sm:w-68 rounded-full p-2.5 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 border-2 border-amber-100 shadow-2xl transition-all duration-700 group/card cursor-pointer`}
              >
                <div className="relative w-52 h-52 sm:w-64 sm:h-64 mx-auto rounded-full overflow-hidden bg-slate-950 border-4 border-slate-950 group-hover/card:border-amber-300 transition-colors">
                  <img
                    id={`coupleImg-${item.id}`}
                    src={item.url}
                    alt={`Adham and Aml Photo ${item.id + 1}`}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = `https://placehold.co/600x600/1e1b18/f6e09e?text=Adham+%26+Aml+${item.id + 1}`;
                    }}
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent p-3 text-center">
                    {item.titleEn ? (
                      <p className="name-italic-script text-amber-200 text-xl" dir="ltr">
                        {item.titleEn}
                      </p>
                    ) : (
                      <p className="font-arabic text-amber-200 text-sm font-bold">
                        {item.titleAr}
                      </p>
                    )}
                    <label
                      onClick={(e) => e.stopPropagation()}
                      className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full bg-amber-400/90 text-slate-950 font-ui-ar font-bold text-[10px] cursor-pointer hover:bg-amber-300"
                    >
                      تغيير الصورة
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(e, item.id)}
                      />
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ring Carousel Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          <button
            type="button"
            onClick={() => rotateRingGallery(-1)}
            className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-amber-200 border border-amber-400/40 text-xs font-ui-ar transition flex items-center gap-1"
          >
            <span>←</span>
            <span>السابق</span>
          </button>

          <div className="flex items-center gap-1.5" dir="ltr">
            {photos.map((_, idx) => (
              <button
                key={idx}
                id={`ringDot-${idx}`}
                type="button"
                onClick={() => bringRingPhotoToFront(idx)}
                className={
                  idx === currentFrontIndex
                    ? 'w-8 h-2.5 rounded-full bg-amber-400 transition-all'
                    : 'w-2.5 h-2.5 rounded-full bg-amber-400/35 hover:bg-amber-400/70 transition-all'
                }
                aria-label={`الانتقال إلى صورة ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => rotateRingGallery(1)}
            className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-amber-200 border border-amber-400/40 text-xs font-ui-ar transition flex items-center gap-1"
          >
            <span>التالي</span>
            <span>→</span>
          </button>
        </div>

        {/* Swipe / Slide Hint */}
        <p className="text-[11px] font-ui-ar text-amber-300/60 mt-2">
          يمكنك أيضاً سحب الصور باللمس أو الماوس يميناً ويساراً للتنقل السريع
        </p>
      </div>

      {/* FULL UNCLIPPED IMAGE REVIEW LIGHTBOX ON PRESS / CLICK */}
      {activeModalPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md transition-all duration-300 animate-fadeIn"
          onClick={() => setActiveModalPhoto(null)}
        >
          <div
            className="relative max-w-xl w-full p-4 sm:p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-amber-950/70 border-2 border-amber-400/80 shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top-right corner close button */}
            <button
              type="button"
              onClick={() => setActiveModalPhoto(null)}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-slate-900/95 hover:bg-amber-500 text-amber-200 hover:text-slate-950 border border-amber-400/60 flex items-center gap-1.5 text-xs font-bold font-ui-ar shadow-lg transition z-20 cursor-pointer active:scale-95"
              aria-label="إغلاق المعاينة"
            >
              <span>✕</span>
              <span>إغلاق</span>
            </button>

            {/* Full Uncropped Image Preview */}
            <div className="w-full overflow-hidden rounded-2xl flex items-center justify-center bg-black/75 max-h-[72vh] p-1 border border-amber-400/30">
              <img
                src={activeModalPhoto.url}
                alt={activeModalPhoto.titleAr || activeModalPhoto.titleEn || 'Wedding Photo'}
                className="w-auto h-auto max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Image Details in Review */}
            <div className="mt-3 text-center w-full flex flex-col items-center">
              <p className="name-italic-script gold-foil-text text-3xl" dir="ltr">
                {activeModalPhoto.titleEn || 'Adham & Aml'}
              </p>
              {activeModalPhoto.titleAr && (
                <p className="font-arabic text-amber-200 text-base font-bold mt-0.5">
                  {activeModalPhoto.titleAr}
                </p>
              )}
              <span className="text-[11px] font-ui-ar text-amber-300/75 block mt-1">
                الصورة كاملة بدون قص
              </span>

              {/* Prominent Bottom Close Button */}
              <button
                type="button"
                onClick={() => setActiveModalPhoto(null)}
                className="mt-3 px-6 py-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-ui-ar font-bold text-sm shadow-xl transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>✕</span>
                <span>إغلاق الصورة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
