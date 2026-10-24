import { media } from '../../media';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import ClickSpark from '../react-bits/ClickSpark';
import { PauseIcon, PlayIcon } from '@radix-ui/react-icons';

// Crop the original raster wordmark; this is the exact brand heart, not a redraw.
export function LogoHeart({ className = '' }: { className?: string }) {
  return <svg className={`logo-heart ${className}`} viewBox="1630 115 365 420" aria-hidden="true" focusable="false"><image href={media('mybusik-logo-transparent.png')} width="2062" height="763" /></svg>;
}

let lastHaptic = 0;
export function haptic(kind: 'tap' | 'success' = 'tap') {
  if (!navigator.vibrate || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const now = performance.now();
  if (kind === 'tap' && now - lastHaptic < 90) return;
  lastHaptic = now;
  navigator.vibrate(kind === 'success' ? [18, 45, 28] : 9);
}

export function scratchSpark(x: number, y: number) {
  window.dispatchEvent(new CustomEvent('busik-spark', { detail: { x, y } }));
}

const hearts = Array.from({ length: 26 }, (_, i) => ({
  x: ((i * 37 + 4) % 100) / 100,
  size: 18 + (i * 11) % 32,
  duration: 23 + (i * 7) % 16,
  delay: ((i * 13) % 37) / 37,
  angle: (i * 47) % 130 - 65,
  drift: (i * 29) % 120 - 60,
}));

export function AmbientHearts() {
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(false);
  pausedRef.current = paused;

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !ctx) return;
    const image = new Image();
    image.src = media('mybusik-logo-transparent.png');
    let raf = 0, previous = 0, time = 0, width = 0, height = 0, dpr = 1;
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const nextDpr = Math.min(devicePixelRatio || 1, 2);
      const w = Math.round(bounds.width * nextDpr), h = Math.round(bounds.height * nextDpr);
      if (w === canvas.width && h === canvas.height) return;
      canvas.width = w; canvas.height = h; dpr = nextDpr;
      width = bounds.width; height = bounds.height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (now: number) => {
      if (!previous) previous = now;
      if (!pausedRef.current && !document.hidden) time += Math.min(50, now - previous) / 1000;
      previous = now;
      ctx.clearRect(0, 0, width, height);
      if (image.complete && image.naturalWidth) {
        const count = width < 600 ? 17 : hearts.length;
        for (let i = 0; i < count; i++) {
          const heart = hearts[i];
          const p = (time / heart.duration + heart.delay) % 1;
          // The icon is fully transparent after three quarters of its travel.
          if (p >= .75) continue;
          const opacity = p < .1 ? p / .1 * .4 : p < .4 ? .4 - (p - .1) * .24 : .328 * (1 - (p - .4) / .35);
          const x = heart.x * width + heart.drift * p / .75;
          const y = -65 + (height * .75 + 65) * p / .75;
          ctx.save(); ctx.globalAlpha = Math.max(0, opacity);
          ctx.translate(x, y); ctx.rotate((heart.angle + 55 * p / .75) * Math.PI / 180);
          ctx.drawImage(image, 1630, 115, 365, 420, -heart.size / 2, -heart.size * 1.15 / 2, heart.size, heart.size * 1.15);
          ctx.restore();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    image.onload = () => { resize(); };
    const visibility = () => { previous = 0; };
    const orientation = () => { resize(); };
    window.addEventListener('resize', orientation);
    document.addEventListener('visibilitychange', visibility);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf); observer.disconnect(); image.onload = null;
      window.removeEventListener('resize', orientation);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [reduce]);

  if (reduce) return null;
  return <>
    <canvas ref={canvasRef} className="ambient-hearts" aria-hidden="true" />
    <button type="button" className="ambient-toggle" aria-label={paused ? 'Включить фоновые сердечки' : 'Приостановить фоновые сердечки'} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <PlayIcon /> : <PauseIcon />}</button>
  </>;
}

// A single burst layer for every native button, including Radix dialog portals.
export function InteractionFeedback() {
  useEffect(() => {
    const click = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest('button') : null;
      if (!target || target.disabled) return;
      haptic();
    };
    document.addEventListener('click', click, true);
    return () => document.removeEventListener('click', click, true);
  }, []);
  return <ClickSpark />;
}
