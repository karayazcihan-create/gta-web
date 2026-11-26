import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { CHARACTERS, VEHICLES, Vehicle } from '../data/viceCityData';
import { ResilientImage } from './ResilientImage';

interface CharacterShowcaseProps {
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export function CharacterShowcase({ onSelectVehicle }: CharacterShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const prefersReducedMotion = useReducedMotion();

  const character = CHARACTERS[activeIndex];
  const signatureVehicle =
    VEHICLES.find((v) => v.id === character.signatureVehicleId) ?? VEHICLES[0];

  const goTo = (nextIdx: number) => {
    const normalized = (nextIdx + CHARACTERS.length) % CHARACTERS.length;
    setDirection(normalized >= activeIndex ? 1 : -1);
    setActiveIndex(normalized);
  };

  return (
    <section
      id="characters"
      className="relative border-t border-white/5 bg-[#06060b] py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section Heading + Carousel Controls */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-[#ff2e93]">
              01 · Principal Figures
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Faces of Vice City
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tabular-nums text-zinc-400">
              0{activeIndex + 1} / 0{CHARACTERS.length}
            </span>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Previous character"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 bg-white/[0.03] text-zinc-200 transition-colors duration-150 hover:border-[#ff2e93] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00e5ff]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next character"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 bg-white/[0.03] text-zinc-200 transition-colors duration-150 hover:border-[#ff2e93] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00e5ff]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Interactive Character Carousel Stage */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b12]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={character.id}
              custom={direction}
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, x: direction * 28 }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: direction * -28 }
              }
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 items-stretch lg:grid-cols-12"
            >
              {/* Artwork Column */}
              <div className="group relative overflow-hidden lg:col-span-5">
                <div
                  className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    boxShadow: `inset 0 0 0 2px ${character.accentColor}, inset 0 0 42px ${character.accentColor}38`,
                  }}
                />
                <div className="aspect-[3/4] w-full overflow-hidden lg:aspect-auto lg:h-[560px]">
                  <ResilientImage
                    src={character.image}
                    alt={`${character.name} — GTA VI character portrait`}
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    fallbackLabel={character.name}
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0b12] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#0b0b12]/90" />
              </div>

              {/* Editorial Profile Column */}
              <div className="flex flex-col justify-between p-8 lg:col-span-7 lg:p-12">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-zinc-400">
                    <span style={{ color: character.accentColor }}>{character.moniker}</span>
                    <span aria-hidden="true">·</span>
                    <span>{character.role}</span>
                    <span aria-hidden="true">·</span>
                    <span>{character.district}</span>
                  </div>

                  <h3 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                    {character.name}
                  </h3>

                  <p className="mt-5 text-base leading-relaxed text-zinc-300">
                    {character.biography}
                  </p>

                  <div className="mt-7 border-t border-white/10 pt-6">
                    <p className="text-xs font-semibold tracking-[0.14em] text-zinc-400">
                      Personality Profile
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                      {character.personality}
                    </p>
                  </div>

                  <blockquote className="mt-6 text-base font-medium italic text-zinc-100">
                    {character.quote}
                  </blockquote>
                </div>

                {/* Signature Vehicle Tie-in */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
                  <div>
                    <p className="text-xs text-zinc-400">Signature Ride</p>
                    <p className="mt-0.5 font-display text-xl font-bold text-white">
                      {signatureVehicle.manufacturer} {signatureVehicle.name}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectVehicle(signatureVehicle)}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white transition-all duration-150 hover:border-[#00e5ff] hover:bg-[#00e5ff]/10 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00e5ff]"
                  >
                    <span>Inspect Signature Car</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Interactive Character Strip Selector with Neon Hover Borders */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHARACTERS.map((char, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={char.id}
                type="button"
                onClick={() => goTo(index)}
                className={`group relative flex items-center gap-4 rounded-xl border p-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00e5ff] ${
                  isActive
                    ? 'border-[#ff2e93]/70 bg-[#12121d] shadow-[0_0_24px_rgba(255,46,147,0.18)]'
                    : 'border-white/10 bg-[#0b0b12] hover:border-[#00e5ff]/60 hover:bg-[#10101a]'
                }`}
              >
                <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg">
                  <ResilientImage
                    src={char.image}
                    alt={char.name}
                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    fallbackLabel={char.name}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-zinc-400 truncate">{char.moniker}</p>
                  <p className="mt-0.5 font-display text-lg font-bold tracking-tight text-white truncate">
                    {char.name}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">{char.district}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
