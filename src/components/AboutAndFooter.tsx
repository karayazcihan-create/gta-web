import { Camera, Disc, Globe, Share2 } from 'lucide-react';

interface AboutAndFooterProps {
  onNavigate: (id: string) => void;
}

export function AboutAndFooter({ onNavigate }: AboutAndFooterProps) {
  return (
    <>
      {/* Editorial About Section */}
      <section
        id="about"
        className="relative border-t border-white/5 bg-[#06060b] py-24 lg:py-28"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <p className="text-xs font-medium tracking-[0.2em] text-[#ff2e93]">
                06 · About The Exhibition
              </p>
              <h2 className="mt-2 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                State of Leonida. Built After Dark.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-zinc-300">
                VICE VI curates the defining automotive machinery, principal characters, and nocturnal districts inspired by Grand Theft Auto VI into an architectural luxury showroom. Every surface—from brushed obsidian plinths to neon-lit Art Deco coastlines—captures the modern pulse of Vice City.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:col-span-6">
              <div className="border-t border-white/15 pt-4">
                <p className="font-mono text-2xl font-medium tabular-nums text-white">
                  3 Tiers
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  Real-time WebGL rotating podium with custom paint finishes
                </p>
              </div>
              <div className="border-t border-white/15 pt-4">
                <p className="font-mono text-2xl font-medium tabular-nums text-[#00e5ff]">
                  6 Classes
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  Supercars, sports, muscle, luxury, retro classics, and 4x4 builds
                </p>
              </div>
              <div className="border-t border-white/15 pt-4">
                <p className="font-mono text-2xl font-medium tabular-nums text-[#ff2e93]">
                  Leonida
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  Ocean Beach, Downtown Biscayne, Vice Port, and the Keys
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist Premium Footer */}
      <footer className="border-t border-white/10 bg-[#040407] py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-center lg:px-10">
          <div>
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('hero');
              }}
              className="font-display text-2xl font-extrabold tracking-[0.14em] text-white"
            >
              VICE <span className="text-[#ff2e93]">VI</span>
            </a>
            <p className="mt-1.5 text-xs text-zinc-500">
              GTA VI Luxury Automotive &amp; Editorial Showcase · Unofficial Tribute Experience
            </p>
          </div>

          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-6 text-xs font-medium text-zinc-400">
            {[
              { id: 'characters', label: 'Characters' },
              { id: 'vehicles', label: 'Vehicles' },
              { id: 'podium', label: 'Podium' },
              { id: 'collection', label: 'Collection' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'about', label: 'About' },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.id);
                }}
                className="transition-colors hover:text-white whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {[
              { label: 'Vice City Photography Feed', Icon: Camera, href: '#gallery' },
              { label: 'Leonida Radio & Media', Icon: Disc, href: '#characters' },
              { label: 'World Showcase', Icon: Globe, href: '#about' },
              { label: 'Share Exhibition', Icon: Share2, href: '#podium' },
            ].map(({ label, Icon, href }) => (
              <a
                key={label}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(href.slice(1));
                }}
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 transition-colors hover:border-[#ff2e93] hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-white/5 px-6 pt-6 text-xs text-zinc-600 lg:px-10">
          © 2026 VICE VI Showcase. Crafted for Grand Theft Auto VI automotive enthusiasts. All vehicle &amp; character names are inspired by Rockstar Games’ Leonida universe.
        </div>
      </footer>
    </>
  );
}
