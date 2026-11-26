import { useMemo, useState } from 'react';
import {
  ArrowUpDown,
  Heart,
  LayoutGrid,
  Rows3,
  Search,
  Sparkles,
} from 'lucide-react';
import {
  VEHICLE_CATEGORIES,
  VEHICLES,
  Vehicle,
  VehicleCategory,
} from '../data/viceCityData';
import { ResilientImage } from './ResilientImage';

interface VehicleCollectionSectionProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onAssignToPodium: (slotIndex: 0 | 1 | 2, vehicleId: string) => void;
}

type SortKey = 'popularity' | 'speed' | 'power';
type ViewMode = 'grid' | 'showcase';

export function VehicleCollectionSection({
  favorites,
  onToggleFavorite,
  onSelectVehicle,
  onAssignToPodium,
}: VehicleCollectionSectionProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | VehicleCategory>('All');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('popularity');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filteredVehicles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return VEHICLES.filter((v) => {
      if (selectedCategory !== 'All' && v.category !== selectedCategory) return false;
      if (favoritesOnly && !favorites.includes(v.id)) return false;
      if (!query) return true;
      return (
        v.name.toLowerCase().includes(query) ||
        v.manufacturer.toLowerCase().includes(query) ||
        v.category.toLowerCase().includes(query) ||
        v.originDistrict.toLowerCase().includes(query)
      );
    }).sort((a, b) => {
      if (sortBy === 'speed') return b.topSpeedMph - a.topSpeedMph;
      if (sortBy === 'power') return b.horsepower - a.horsepower;
      return b.popularity - a.popularity;
    });
  }, [search, selectedCategory, favoritesOnly, favorites, sortBy]);

  return (
    <section
      id="collection"
      className="relative border-t border-white/5 bg-[#06060b] py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-[#a855f7]">
              04 · Interactive Fleet Index
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Vice City Vehicle Collection
            </h2>
          </div>
          <p className="font-mono text-xs tabular-nums text-zinc-400">
            Showing {filteredVehicles.length} of {VEHICLES.length} Vehicles · {favorites.length} Saved
          </p>
        </div>

        {/* Interactive Toolbar */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0b0b12] p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search model, maker, or Vice City district..."
                aria-label="Search vehicles"
                className="h-11 w-full rounded-lg border border-white/10 bg-[#050508] pr-4 pl-10 text-sm text-white placeholder:text-zinc-500 focus:border-[#00e5ff] focus:outline-none"
              />
            </div>

            {/* Sort, Favorites & View Mode Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#050508] px-3 h-11">
                <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
                <select
                  aria-label="Sort vehicles"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className="bg-transparent text-xs font-medium text-zinc-200 focus:outline-none"
                >
                  <option value="popularity" className="bg-[#0b0b12]">Sort: Popularity</option>
                  <option value="speed" className="bg-[#0b0b12]">Sort: Top Speed</option>
                  <option value="power" className="bg-[#0b0b12]">Sort: Horsepower</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setFavoritesOnly((prev) => !prev)}
                className={`inline-flex h-11 items-center gap-2 rounded-lg border px-3.5 text-xs font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00e5ff] ${
                  favoritesOnly
                    ? 'border-[#ff2e93] bg-[#ff2e93]/15 text-[#ff2e93]'
                    : 'border-white/10 bg-[#050508] text-zinc-300 hover:border-white/25'
                }`}
              >
                <Heart className={`h-3.5 w-3.5 ${favoritesOnly ? 'fill-current' : ''}`} />
                <span>Favorites ({favorites.length})</span>
              </button>

              <div className="flex items-center rounded-lg border border-white/10 bg-[#050508] p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-[#ff2e93] text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('showcase')}
                  aria-label="Showcase list view"
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
                    viewMode === 'showcase'
                      ? 'bg-[#ff2e93] text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Rows3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
            {(['All', ...VEHICLE_CATEGORIES] as const).map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00e5ff] ${
                    active
                      ? 'bg-[#00e5ff] text-[#050508] font-semibold'
                      : 'bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results or Empty State */}
        {filteredVehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0b0b12] px-6 py-16 text-center">
            <p className="font-display text-2xl font-bold text-white">
              No matching vehicles found
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Try clearing your search filter or switching back to all vehicle categories.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setFavoritesOnly(false);
              }}
              className="mt-5 rounded-lg bg-[#ff2e93] px-4 py-2 text-xs font-semibold text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map((vehicle) => {
              const fav = favorites.includes(vehicle.id);
              return (
                <div
                  key={vehicle.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b12] transition-all duration-200 hover:border-[#00e5ff]/50"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#07070c]">
                    <ResilientImage
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      fallbackLabel={vehicle.name}
                    />
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(vehicle.id)}
                      aria-label={fav ? `Remove ${vehicle.name} from favorites` : `Favorite ${vehicle.name}`}
                      className={`absolute top-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                        fav
                          ? 'border-[#ff2e93] bg-[#ff2e93]/90 text-white'
                          : 'border-white/15 bg-black/70 text-zinc-200 hover:border-[#ff2e93]'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${fav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>
                          {vehicle.manufacturer} · {vehicle.category}
                        </span>
                        <span className="font-mono tabular-nums text-[#00e5ff]">
                          {vehicle.popularity}% Demand
                        </span>
                      </div>
                      <h3 className="mt-1.5 font-display text-2xl font-bold text-white">
                        {vehicle.name}
                      </h3>

                      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-xs">
                        <div>
                          <span className="text-zinc-500">Top Speed</span>
                          <p className="font-mono tabular-nums text-zinc-200">
                            {vehicle.topSpeedMph} mph
                          </p>
                        </div>
                        <div>
                          <span className="text-zinc-500">0–60</span>
                          <p className="font-mono tabular-nums text-zinc-200">
                            {vehicle.zeroToSixty.toFixed(1)}s
                          </p>
                        </div>
                        <div>
                          <span className="text-zinc-500">Output</span>
                          <p className="font-mono tabular-nums text-zinc-200">
                            {vehicle.horsepower} hp
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectVehicle(vehicle)}
                        className="flex-1 rounded-lg bg-white/[0.06] py-2 text-xs font-semibold text-white transition-colors hover:bg-[#ff2e93]"
                      >
                        Specs &amp; Details
                      </button>
                      <button
                        type="button"
                        onClick={() => onAssignToPodium(0, vehicle.id)}
                        title="Place on Podium 01"
                        className="inline-flex h-9 items-center gap-1 rounded-lg border border-white/15 px-3 text-xs font-medium text-zinc-200 transition-colors hover:border-[#00e5ff] hover:text-white"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-[#ff2e93]" />
                        <span>Podium</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {filteredVehicles.map((vehicle) => {
              const fav = favorites.includes(vehicle.id);
              return (
                <div
                  key={vehicle.id}
                  className="grid grid-cols-1 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b12] transition-colors hover:border-[#00e5ff]/50 lg:grid-cols-12"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#07070c] lg:col-span-5 lg:aspect-auto lg:h-64">
                    <ResilientImage
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="h-full w-full object-cover"
                      fallbackLabel={vehicle.name}
                    />
                  </div>
                  <div className="flex flex-col justify-between p-6 lg:col-span-7 lg:p-8">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
                        <span>
                          {vehicle.manufacturer} · {vehicle.category} · {vehicle.originDistrict}
                        </span>
                        <span className="font-mono tabular-nums text-[#ff2e93]">
                          {vehicle.price}
                        </span>
                      </div>
                      <h3 className="mt-2 font-display text-3xl font-bold text-white">
                        {vehicle.name}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                        {vehicle.description}
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
                      <div className="flex flex-wrap items-center gap-6 text-xs">
                        <span className="font-mono tabular-nums text-zinc-200">
                          {vehicle.topSpeedMph} mph
                        </span>
                        <span className="font-mono tabular-nums text-zinc-200">
                          {vehicle.horsepower} hp
                        </span>
                        <span className="font-mono tabular-nums text-zinc-200">
                          0–60 in {vehicle.zeroToSixty.toFixed(1)}s
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onToggleFavorite(vehicle.id)}
                          className={`inline-flex h-10 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors ${
                            fav
                              ? 'border-[#ff2e93] bg-[#ff2e93]/15 text-[#ff2e93]'
                              : 'border-white/15 text-zinc-300 hover:border-white/30'
                          }`}
                        >
                          <Heart className={`h-3.5 w-3.5 ${fav ? 'fill-current' : ''}`} />
                          <span>{fav ? 'Saved' : 'Save'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectVehicle(vehicle)}
                          className="h-10 rounded-lg bg-[#ff2e93] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#ff47a1]"
                        >
                          Inspect Vehicle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
