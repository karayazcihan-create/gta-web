import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowDownRight } from 'lucide-react';
import { HERO_IMAGE } from '../data/viceCityData';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  onExplore: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  hue: string;
}

export function HeroSection({ onExplore }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (prefersReducedMotion) return;
    const handleMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 18;
      const ny = (e.clientY / window.innerHeight - 0.5) * 14;
      setParallax({ x: -nx, y: -ny });
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    const palette = ['255, 46, 147', '0, 229, 255', '168, 85, 247'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Particle[] = Array.from({ length: 42 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: -0.18 - Math.random() * 0.32,
      radius: 1 + Math.random() * 2.1,
      alpha: 0.25 + Math.random() * 0.5,
      hue: palette[i % palette.length],
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue}, ${p.alpha})`;
        ctx.fill();
      }
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [prefersReducedMotion]);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-[#050508] pt-16"
    >
      {/* Parallax Backdrop Image */}
      <div
        className="pointer-events-none absolute inset-[-28px] transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0) scale(1.04)`,
        }}
      >
        <ResilientImage
          src={HERO_IMAGE}
          alt="Vice City illuminated midnight oceanfront skyline"
          className="h-full w-full object-cover object-center opacity-75"
          fallbackLabel="Vice City Midnight Skyline"
        />
      </div>

      {/* Measured contrast scrims and ambient Vice lighting */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050508]/95 via-[#050508]/65 to-[#050508]/35" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-[#050508]/60" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-[#ff2e93]/18 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-1/4 h-96 w-96 rounded-full bg-[#00e5ff]/14 blur-[130px]" />

      {/* Subtle Ambient Light Particles */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* Editorial Hero Foreground */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 lg:px-10">
        <div className="max-w-3xl">
          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 text-sm font-medium tracking-[0.22em] text-[#00e5ff]"
          >
            Leonida State Exhibition · Midnight Collection
          </motion.p>

          <motion.h1
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl font-extrabold leading-[0.94] tracking-tight text-white sm:text-7xl lg:text-[5.5rem] vice-neon-text"
            style={{ textWrap: 'balance' }}
          >
            WELCOME TO{' '}
            <span className="bg-gradient-to-r from-[#ff2e93] via-[#d946ef] to-[#00e5ff] bg-clip-text text-transparent">
              VICE CITY
            </span>
          </motion.h1>

          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 font-display text-xl font-semibold tracking-[0.16em] text-zinc-200 sm:text-2xl"
          >
            THE WORLD IS YOURS. THE NIGHT IS YOUNG.
          </motion.p>

          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-xl text-base leading-relaxed text-zinc-300"
          >
            Step inside an architectural underground showroom where Vice City’s defining characters meet bespoke exotic machines on a three-level illuminated podium.
          </motion.p>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-wrap items-center gap-6"
          >
            <button
              type="button"
              onClick={onExplore}
              className="group inline-flex items-center gap-3 rounded-lg bg-[#ff2e93] px-7 py-3.5 text-sm font-semibold tracking-wider text-white shadow-[0_0_32px_rgba(255,46,147,0.45)] transition-all duration-200 hover:bg-[#ff429e] hover:shadow-[0_0_45px_rgba(255,46,147,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00e5ff]"
            >
              <span>EXPLORE GTA VI</span>
              <ArrowDownRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </button>

            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span>6 Automotive Classes</span>
              <span aria-hidden="true">·</span>
              <span>Interactive 3-Tier 3D Podium</span>
              <span aria-hidden="true">·</span>
              <span>4 Key Figures</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom transition fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#050508] to-transparent" />
    </section>
  );
}
