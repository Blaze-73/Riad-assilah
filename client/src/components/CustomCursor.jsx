import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;
      if (cursor) {
        cursor.style.transform = `translate(${currentX - 1}px, ${currentY - 1}px)`;
      }
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    animate();

    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  if (typeof window === 'undefined') return null;

  return (
    <div
      ref={cursorRef}
      className="hidden lg:block fixed top-0 left-0 w-2 h-2 bg-terracotta rounded-full pointer-events-none z-[9999] mix-blend-difference"
      style={{ transition: 'width 0.2s, height 0.2s' }}
    />
  );
}
