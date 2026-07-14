import { useState, useRef, useCallback, useEffect, useMemo } from 'react';

export default function ImageCarousel({ images, alt, className, thumbnail = false, onImageClick, interval = 4000 }) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * images.length));
  const [paused, setPaused] = useState(false);
  const touchStart = useRef(null);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const stagger = useMemo(() => Math.random() * interval, []);

  const prev = useCallback(() => setIndex(i => (i === 0 ? images.length - 1 : i - 1)), [images.length]);
  const next = useCallback(() => setIndex(i => (i === images.length - 1 ? 0 : i + 1)), [images.length]);

  useEffect(() => {
    if (images.length < 2 || paused) return;
    const start = () => {
      timerRef.current = setInterval(next, interval);
    };
    const delay = setTimeout(start, stagger);
    return () => {
      clearTimeout(delay);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images.length, paused, interval, next, stagger]);

  const handleTouchStart = useCallback((e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      dx > 0 ? prev() : next();
    }
    touchStart.current = null;
  }, [prev, next]);

  const goTo = useCallback((i) => setIndex(i), []);

  if (!images?.length) return null;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none ${className || ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={i} className="min-w-0 w-full shrink-0">
            <img
              src={src}
              alt={i === 0 ? alt : ''}
              loading={i === 0 ? 'eager' : 'lazy'}
              className={`w-full object-cover ${thumbnail ? 'h-full' : 'h-64 md:h-80'}`}
              onClick={() => onImageClick?.(i)}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => { prev(); setPaused(true); setTimeout(() => setPaused(false), interval * 2); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors"
            aria-label="Previous image"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => { next(); setPaused(true); setTimeout(() => setPaused(false), interval * 2); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors"
            aria-label="Next image"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { goTo(i); setPaused(true); setTimeout(() => setPaused(false), interval * 2); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === index ? 'bg-white w-3' : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
          <div className="absolute top-3 right-3 bg-black/40 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
            {index + 1}/{images.length}
          </div>
        </>
      )}
    </div>
  );
}
