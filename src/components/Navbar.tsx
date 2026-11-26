import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavigate: (id: string) => void;
}

const NAV_LINKS = [
  { id: 'characters', label: 'Characters' },
  { id: 'vehicles', label: 'Vehicles' },
  { id: 'podium', label: 'Podium' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'about', label: 'About' },
];

export function Navbar({ onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLinkClick = (id: string) => {
    setMobileOpen(false);
    onNavigate(id);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${
        scrolled
          ? 'bg-[#050508]/92 border-b border-white/10 shadow-lg shadow-black/40'
          : 'bg-gradient-to-b from-[#050508]/90 via-[#050508]/45 to-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-6 lg:px-10">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('hero');
          }}
          className="font-display text-2xl font-extrabold tracking-[0.14em] text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2e93]"
        >
          VICE <span className="text-[#ff2e93]">VI</span>
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(item.id);
              }}
              className="relative py-1 text-sm font-medium text-zinc-300 transition-colors duration-150 hover:text-white whitespace-nowrap shrink-0 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-[#ff2e93] after:transition-all after:duration-200 hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00e5ff]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleLinkClick('podium')}
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#ff2e93] px-4 py-2 text-xs font-semibold tracking-wide text-white transition-all duration-150 hover:bg-[#ff47a1] hover:shadow-[0_0_24px_rgba(255,46,147,0.45)] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00e5ff]"
          >
            Enter Podium
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 bg-black/50 text-zinc-200 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2e93]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#07070c] px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
                className="flex min-h-[44px] items-center text-base font-medium text-zinc-200 hover:text-[#ff2e93]"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => handleLinkClick('podium')}
              className="mt-2 min-h-[44px] w-full rounded-lg bg-[#ff2e93] px-4 py-2.5 text-sm font-semibold text-white"
            >
              Enter Podium
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
