import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, X } from 'lucide-react';
import { Vehicle } from '../data/viceCityData';
import { ResilientImage } from './ResilientImage';

interface VehicleModalProps {
  vehicle: Vehicle | null;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAssignToPodium: (slotIndex: 0 | 1 | 2, vehicleId: string) => void;
  onClose: () => void;
}

export function VehicleModal({
  vehicle,
  isFavorite,
  onToggleFavorite,
  onAssignToPodium,
  onClose,
}: VehicleModalProps) {
  useEffect(() => {
    if (!vehicle) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [vehicle, onClose]);

  return (
    <AnimatePresence>
      {vehicle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="vehicle-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-[#0a0a11] shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close vehicle specifications"
              className="absolute top-4 right-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-black/75 text-zinc-200 transition-colors hover:border-[#ff2e93] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00e5ff]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="relative bg-[#07070c] lg:col-span-6">
                <div className="aspect-[4/3] h-full w-full overflow-hidden">
                  <ResilientImage
                    src={vehicle.image}
                    alt={`${vehicle.manufacturer} ${vehicle.name}`}
                    className="h-full w-full object-cover"
                    fallbackLabel={vehicle.name}
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a11] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0a0a11]" />
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6">
                <div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="text-[#00e5ff]">{vehicle.manufacturer}</span>
                    <span aria-hidden="true">·</span>
                    <span>{vehicle.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{vehicle.originDistrict}</span>
                  </div>

                  <h3
                    id="vehicle-modal-title"
                    className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
                  >
                    {vehicle.name}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                    {vehicle.description}
                  </p>

                  {/* Tabular Telemetry Grid */}
                  <div className="mt-6 grid grid-cols-2 gap-4 border-y border-white/10 py-5">
                    <div>
                      <p className="text-xs text-zinc-400">Top Speed</p>
                      <p className="mt-0.5 font-mono text-lg font-medium tabular-nums text-white">
                        {vehicle.topSpeedMph} mph
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">0–60 mph</p>
                      <p className="mt-0.5 font-mono text-lg font-medium tabular-nums text-white">
                        {vehicle.zeroToSixty.toFixed(1)} s
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Output</p>
                      <p className="mt-0.5 font-mono text-lg font-medium tabular-nums text-white">
                        {vehicle.horsepower} hp
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Valuation</p>
                      <p className="mt-0.5 font-mono text-lg font-medium tabular-nums text-[#ff2e93]">
                        {vehicle.price}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-zinc-400">
                    Drivetrain: <span className="text-zinc-200">{vehicle.drivetrain}</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onAssignToPodium(0, vehicle.id);
                      onClose();
                    }}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#ff2e93] px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#ff47a1] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00e5ff]"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Feature on 01 — Elite Podium</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleFavorite(vehicle.id)}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                    className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00e5ff] ${
                      isFavorite
                        ? 'border-[#ff2e93] bg-[#ff2e93]/15 text-[#ff2e93]'
                        : 'border-white/15 bg-white/[0.04] text-zinc-200 hover:border-white/30'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                    <span>{isFavorite ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
