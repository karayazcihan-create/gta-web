import { useState } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { VEHICLES, Vehicle } from '../data/viceCityData';
import { ResilientImage } from './ResilientImage';

interface LegendaryVehiclesSectionProps {
  onSelectVehicle: (vehicle: Vehicle) => void;
  onAssignToPodium: (slotIndex: 0 | 1 | 2, vehicleId: string) => void;
}

export function LegendaryVehiclesSection({
  onSelectVehicle,
  onAssignToPodium,
}: LegendaryVehiclesSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section
      id="vehicles"
      className="relative border-t border-white/5 bg-[#050508] py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-[#00e5ff]">
              02 · Underground Exhibition
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Legendary Vehicles Showcase
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-zinc-400">
            Six curated automotive icons spanning every class on the Vice City asphalt—from carbon mid-engine hypercars to Grassrivers trophy trucks.
          </p>
        </div>

        {/* 6 Luxury Underground Showroom Cards */}
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {VEHICLES.map((vehicle) => {
            const isHovered = hoveredId === vehicle.id;
            return (
              <article
                key={vehicle.id}
                onMouseEnter={() => setHoveredId(vehicle.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b12] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#ff2e93]/50 hover:shadow-[0_24px_60px_-16px_rgba(255,46,147,0.22)]"
              >
                {/* Studio Automotive Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#07070b]">
                  <ResilientImage
                    src={vehicle.image}
                    alt={`${vehicle.manufacturer} ${vehicle.name}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    fallbackLabel={vehicle.name}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0b12] via-transparent to-black/25" />

                  {/* Subtle specular rim accent */}
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${vehicle.accentHex}, transparent)`,
                      opacity: isHovered ? 1 : 0.35,
                    }}
                  />
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
                      <span>
                        {vehicle.manufacturer} · {vehicle.category}
                      </span>
                      <span className="font-mono tabular-nums text-zinc-300">
                        {vehicle.topSpeedMph} mph
                      </span>
                    </div>

                    <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-white">
                      {vehicle.name}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                      {vehicle.tagline}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={() => onSelectVehicle(vehicle)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white transition-colors hover:text-[#ff2e93] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00e5ff]"
                    >
                      <span>View Details</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onAssignToPodium(0, vehicle.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:border-[#00e5ff] hover:text-white whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00e5ff]"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-[#ff2e93]" />
                      <span>Send to Podium</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
