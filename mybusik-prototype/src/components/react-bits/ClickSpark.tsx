// Adapted from React Bits ClickSpark, David Haz (MIT + Commons Clause).
// Fixed viewport, DPR-aware; RAF runs only while bursts exist, with reduced-motion support.
import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

type Spark = { x: number; y: number; angle: number; startTime: number };
export default function ClickSpark() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current, ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let sparks: Spark[] = [], frame = 0;
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (now: number) => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      sparks = sparks.filter(spark => {
        const progress = (now - spark.startTime) / 540;
        if (progress >= 1) return false;
        const eased = progress * (2 - progress), distance = eased * 34;
        const lineLength = 8 * (1 - eased);
        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        ctx.strokeStyle = '#d97998'; ctx.globalAlpha = 1 - progress;
        ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(spark.x + (distance + lineLength) * Math.cos(spark.angle), spark.y + (distance + lineLength) * Math.sin(spark.angle));
        ctx.stroke(); return true;
      });
      ctx.globalAlpha = 1;
      frame = sparks.length ? requestAnimationFrame(draw) : 0;
    };
    const burst = (x: number, y: number, count = 8) => {
      sparks.push(...Array.from({ length: count }, (_, i) => ({ x, y, angle: 2 * Math.PI * i / count, startTime: performance.now() })));
      sparks = sparks.slice(-160);
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const click = (event: MouseEvent) => {
      const button = event.target instanceof Element ? event.target.closest('button') : null;
      if (!button || button.disabled) return;
      const rect = button.getBoundingClientRect();
      burst(event.detail ? event.clientX : rect.left + rect.width / 2, event.detail ? event.clientY : rect.top + rect.height / 2);
    };
    const scratch = (event: Event) => { const { x, y } = (event as CustomEvent<{x:number;y:number}>).detail; burst(x, y, 5); };
    const visibility = () => { if (document.hidden) { sparks = []; cancelAnimationFrame(frame); frame = 0; ctx.clearRect(0, 0, innerWidth, innerHeight); } };
    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('click', click, true);
    window.addEventListener('busik-spark', scratch);
    document.addEventListener('visibilitychange', visibility);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); document.removeEventListener('click', click, true); window.removeEventListener('busik-spark', scratch); document.removeEventListener('visibilitychange', visibility); };
  }, [reduce]);
  return reduce ? null : <canvas ref={canvasRef} className="click-spark-canvas" aria-hidden="true" />;
}
