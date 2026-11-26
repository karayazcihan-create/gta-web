import { useCallback, useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CharacterShowcase } from './components/CharacterShowcase';
import { LegendaryVehiclesSection } from './components/LegendaryVehiclesSection';
import { PodiumExperience } from './components/PodiumExperience';
import { VehicleCollectionSection } from './components/VehicleCollectionSection';
import { CinematicGallery } from './components/CinematicGallery';
import { AboutAndFooter } from './components/AboutAndFooter';
import { VehicleModal } from './components/VehicleModal';
import { VEHICLES, Vehicle } from './data/viceCityData';

const FAVORITES_KEY = 'vice_vi_favorites';

export default function App() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [podiumIds, setPodiumIds] = useState<[string, string, string]>([
    VEHICLES[0].id, // 01 — ELITE: Cheetah Corsa R
    VEHICLES[1].id, // 02 — PREMIUM: Banshee GTS Widebody
    VEHICLES[4].id, // 03 — LEGENDARY: Infernus Retro V12
  ]);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage failures
    }
    return [VEHICLES[0].id, VEHICLES[4].id];
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // Ignore storage failures
    }
  }, [favorites]);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleToggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  const handleChangeSlotVehicle = useCallback(
    (slotIndex: 0 | 1 | 2, vehicleId: string) => {
      setPodiumIds((prev) => {
        const next = [...prev] as [string, string, string];
        next[slotIndex] = vehicleId;
        return next;
      });
    },
    [],
  );

  const handleAssignAndScrollToPodium = useCallback(
    (slotIndex: 0 | 1 | 2, vehicleId: string) => {
      handleChangeSlotVehicle(slotIndex, vehicleId);
      scrollToSection('podium');
    },
    [handleChangeSlotVehicle, scrollToSection],
  );

  return (
    <div className="min-h-screen bg-[#050508] text-zinc-100">
      <Navbar onNavigate={scrollToSection} />

      <main>
        <HeroSection onExplore={() => scrollToSection('podium')} />

        <CharacterShowcase onSelectVehicle={setSelectedVehicle} />

        <LegendaryVehiclesSection
          onSelectVehicle={setSelectedVehicle}
          onAssignToPodium={handleAssignAndScrollToPodium}
        />

        <PodiumExperience
          podiumIds={podiumIds}
          onChangeSlotVehicle={handleChangeSlotVehicle}
          onInspectVehicle={setSelectedVehicle}
        />

        <VehicleCollectionSection
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onSelectVehicle={setSelectedVehicle}
          onAssignToPodium={handleAssignAndScrollToPodium}
        />

        <CinematicGallery />
      </main>

      <AboutAndFooter onNavigate={scrollToSection} />

      <VehicleModal
        vehicle={selectedVehicle}
        isFavorite={selectedVehicle ? favorites.includes(selectedVehicle.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onAssignToPodium={handleAssignAndScrollToPodium}
        onClose={() => setSelectedVehicle(null)}
      />
    </div>
  );
}
