export type VehicleCategory =
  | 'Supercars'
  | 'Sports Cars'
  | 'Muscle Cars'
  | 'Luxury Cars'
  | 'Classic Cars'
  | 'Off-Road Vehicles';

export type ChassisSilhouette =
  | 'supercar'
  | 'sports'
  | 'muscle'
  | 'luxury'
  | 'classic'
  | 'offroad';

export interface Vehicle {
  id: string;
  name: string;
  manufacturer: string;
  category: VehicleCategory;
  silhouette: ChassisSilhouette;
  tagline: string;
  description: string;
  image: string;
  topSpeedMph: number;
  zeroToSixty: number;
  horsepower: number;
  drivetrain: string;
  popularity: number;
  price: string;
  defaultPaintHex: string;
  accentHex: string;
  originDistrict: string;
}

export interface Character {
  id: string;
  name: string;
  moniker: string;
  district: string;
  role: string;
  biography: string;
  personality: string;
  quote: string;
  image: string;
  accentColor: string;
  signatureVehicleId: string;
}

export type GalleryCategory = 'All' | 'Streets & Coast' | 'Nightlife' | 'Showroom' | 'Characters';

export interface GalleryItem {
  id: string;
  title: string;
  location: string;
  category: Exclude<GalleryCategory, 'All'>;
  cameraSpec: string;
  image: string;
  featured?: boolean;
}

export interface PaintFinish {
  id: string;
  name: string;
  hex: string;
  metalness: number;
  roughness: number;
}

export const HERO_IMAGE = '/src/assets/images/vice_city_hero_skyline_1795687499940.jpg';

export const PAINT_FINISHES: PaintFinish[] = [
  { id: 'obsidian', name: 'Obsidian Pearl', hex: '#14151c', metalness: 0.88, roughness: 0.16 },
  { id: 'magenta', name: 'Vice Magenta', hex: '#d91b7a', metalness: 0.82, roughness: 0.14 },
  { id: 'cobalt', name: 'Electric Cobalt', hex: '#0ea5e9', metalness: 0.86, roughness: 0.15 },
  { id: 'plum', name: 'Midnight Plum', hex: '#5b21b6', metalness: 0.72, roughness: 0.24 },
  { id: 'coral', name: 'Sunset Coral', hex: '#e85d75', metalness: 0.78, roughness: 0.18 },
  { id: 'silver', name: 'Liquid Silver', hex: '#b8c0cc', metalness: 0.94, roughness: 0.12 },
];

export const VEHICLE_CATEGORIES: VehicleCategory[] = [
  'Supercars',
  'Sports Cars',
  'Muscle Cars',
  'Luxury Cars',
  'Classic Cars',
  'Off-Road Vehicles',
];

export const VEHICLES: Vehicle[] = [
  {
    id: 'grotti-cheetah-r',
    name: 'Cheetah Corsa R',
    manufacturer: 'Grotti',
    category: 'Supercars',
    silhouette: 'supercar',
    tagline: 'Mid-engine carbon-monocoque precision built for Ocean Beach midnight runs.',
    description:
      'Engineered with active underbody aero tunnels and a twin-turbocharged V8 screaming to 9,000 RPM, the Cheetah Corsa R dominates Vice City expressways with surgical cornering balance and razor-sharp Italian silhouette.',
    image: '/src/assets/images/car_cheetah_supercar_1795687502934.jpg',
    topSpeedMph: 218,
    zeroToSixty: 2.5,
    horsepower: 840,
    drivetrain: 'RWD · 7-Speed DCT',
    popularity: 99,
    price: '$2,450,000',
    defaultPaintHex: '#14151c',
    accentHex: '#ff2e93',
    originDistrict: 'Starfish Island',
  },
  {
    id: 'bravado-banshee-gts',
    name: 'Banshee GTS Widebody',
    manufacturer: 'Bravado',
    category: 'Sports Cars',
    silhouette: 'sports',
    tagline: 'Wide-stance V10 predator calibrated for high-speed coastal escapes.',
    description:
      'Reborn for Leonida with sculpted carbon side blades, forged track wheels, and a naturally aspirated 8.4-liter V10. The Banshee GTS pairs brutal straight-line punch with hypnotic high-speed stability across the Venetian causeways.',
    image: '/src/assets/images/car_banshee_sports_1795687503892.jpg',
    topSpeedMph: 204,
    zeroToSixty: 2.8,
    horsepower: 735,
    drivetrain: 'RWD · 8-Speed Paddle',
    popularity: 95,
    price: '$1,380,000',
    defaultPaintHex: '#0f4c9a',
    accentHex: '#00e5ff',
    originDistrict: 'Vice Port',
  },
  {
    id: 'vapid-dominator-gt',
    name: 'Dominator Hellhound GT',
    manufacturer: 'Vapid',
    category: 'Muscle Cars',
    silhouette: 'muscle',
    tagline: 'Supercharged V8 thunder dressed in satin midnight plum and exposed carbon.',
    description:
      'Built for relentless torque and unmistakable presence outside Vice City underground clubs. Twin hood extractors feed an 807-horsepower supercharged Hemi V8 that leaves twin rubber signatures down Ocean Drive.',
    image: '/src/assets/images/car_dominator_muscle_1795687503812.jpg',
    topSpeedMph: 192,
    zeroToSixty: 3.1,
    horsepower: 807,
    drivetrain: 'RWD · 6-Speed Heavy',
    popularity: 92,
    price: '$895,000',
    defaultPaintHex: '#4b1d52',
    accentHex: '#a855f7',
    originDistrict: 'Wynwood Flats',
  },
  {
    id: 'enus-cognoscenti-s',
    name: 'Cognoscenti Sovereign',
    manufacturer: 'Enus',
    category: 'Luxury Cars',
    silhouette: 'luxury',
    tagline: 'Whisper-quiet twin-turbo V12 flagship crafted for Vice City kingpins.',
    description:
      'Hand-finished two-tone liquid silver over obsidian coachwork conceals ballistic-grade acoustic glass, rear executive lounge seating, and effortless V12 thrust suited for rooftop arrivals and high-stakes negotiations.',
    image: '/src/assets/images/car_cognoscenti_luxury_1795687509267.jpg',
    topSpeedMph: 174,
    zeroToSixty: 3.9,
    horsepower: 621,
    drivetrain: 'AWD · Air Suspension',
    popularity: 88,
    price: '$1,650,000',
    defaultPaintHex: '#9aa4b2',
    accentHex: '#00e5ff',
    originDistrict: 'Downtown Biscayne',
  },
  {
    id: 'pegassi-infernus-classic',
    name: 'Infernus Retro V12',
    manufacturer: 'Pegassi',
    category: 'Classic Cars',
    silhouette: 'classic',
    tagline: 'An icon of 1986 Ocean Beach excess, restored in pearlescent coral.',
    description:
      'Pop-up headlamps, dramatic side strakes, and a high-wing silhouette define the ultimate Vice City legend. Completely re-engineered underneath with modern carbon ceramics while preserving its raw gated-manual soul.',
    image: '/src/assets/images/car_infernus_classic_1795687507456.jpg',
    topSpeedMph: 189,
    zeroToSixty: 3.5,
    horsepower: 540,
    drivetrain: 'RWD · 5-Speed Gated',
    popularity: 96,
    price: '$1,920,000',
    defaultPaintHex: '#e06377',
    accentHex: '#ff2e93',
    originDistrict: 'Ocean Beach',
  },
  {
    id: 'vapid-caracara-4x4',
    name: 'Caracara Trophy 4x4',
    manufacturer: 'Vapid',
    category: 'Off-Road Vehicles',
    silhouette: 'offroad',
    tagline: 'Long-travel desert and Grassrivers dominator with bronze beadlocks.',
    description:
      'Engineered to conquer Leonida’s flooded marshlands, coastal dunes, and urban barricades without slowing down. Features 14 inches of bypass suspension travel, roof-mounted LED optics, and reinforced skid plating.',
    image: '/src/assets/images/car_caracara_offroad_1795687505015.jpg',
    topSpeedMph: 148,
    zeroToSixty: 4.4,
    horsepower: 710,
    drivetrain: '4WD · Locking Diffs',
    popularity: 86,
    price: '$740,000',
    defaultPaintHex: '#2e333c',
    accentHex: '#00e5ff',
    originDistrict: 'Grassrivers Basin',
  },
];

export const CHARACTERS: Character[] = [
  {
    id: 'lucia-caminos',
    name: 'Lucia Caminos',
    moniker: '01 · Protagonist',
    district: 'Vice City · Leonida',
    role: 'Calculated Strategist & Driver',
    biography:
      'Taught to fight before she could walk in Liberty City, Lucia survived Leonida Penitentiary with one lesson carved deep: trust is a currency spent sparingly. Freshly released, she is determined to seize the high life her mother always promised.',
    personality:
      'Fierce, hyper-observant, and unshakeable under pressure. Lucia reads a room—or a heist blueprint—within seconds and refuses to leave anything to chance.',
    quote: '“The only thing that matters is who you know and what you’re willing to take.”',
    image: '/src/assets/images/char_lucia_caminos_1795687499531.jpg',
    accentColor: '#ff2e93',
    signatureVehicleId: 'grotti-cheetah-r',
  },
  {
    id: 'jason-duval',
    name: 'Jason Duval',
    moniker: '02 · Protagonist',
    district: 'Leonida Keys',
    role: 'Ex-Military Wheelman & Enforcer',
    biography:
      'After a turbulent youth and a stint in the Army trying to outrun his past, Jason ended up running errands for local smugglers in the Leonida Keys. Meeting Lucia turned survival into ambition—and raised every stake on the board.',
    personality:
      'Calm, tactile, and lethal behind the wheel. Jason keeps a low profile until the moment everything goes sideways, where his instincts take over.',
    quote: '“Trust? Down here, you keep one hand on the wheel and one eye on the mirror.”',
    image: '/src/assets/images/char_jason_duval_1795687499892.jpg',
    accentColor: '#00e5ff',
    signatureVehicleId: 'vapid-dominator-gt',
  },
  {
    id: 'boobie-ike',
    name: 'Boobie Ike',
    moniker: '03 · Nightlife Mogul',
    district: 'Downtown Vice City',
    role: 'Club Owner, Real Estate & Label Executive',
    biography:
      'A homegrown Vice City legend who transformed street dominance into a glistening empire of penthouse nightclubs, waterfront real estate, and Only Raw Records. Everyone smiles in Boobie’s lounge—until the music stops.',
    personality:
      'Charismatic, flamboyant, and razor-sharp in business. Boobie treats the city’s neon skyline like his personal chessboard.',
    quote: '“In Vice City, you either own the velvet rope or you wait outside in the rain.”',
    image: '/src/assets/images/char_boobie_ike_1795687501493.jpg',
    accentColor: '#a855f7',
    signatureVehicleId: 'enus-cognoscenti-s',
  },
  {
    id: 'raul-bautista',
    name: 'Raul Bautista',
    moniker: '04 · Veteran Tactician',
    district: 'Vice Port & Starfish',
    role: 'Seasoned Bank Robber & Crew Broker',
    biography:
      'Suave, ruthless, and endlessly composed, Raul has orchestrated high-value armored scores across Leonida for two decades. He constantly scouts hungry new talent willing to risk everything for the biggest payout of their lives.',
    personality:
      'Measured, charming, and dangerously patient. Raul never raises his voice because his contingency plans are already three moves ahead.',
    quote: '“Life is full of surprises. Better to bring a fast car and an exit nobody else knows.”',
    image: '/src/assets/images/char_raul_bautista_1795687503242.jpg',
    accentColor: '#38bdf8',
    signatureVehicleId: 'bravado-banshee-gts',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-ocean-drive',
    title: 'Ocean Beach After Midnight',
    location: 'Ocean Drive, Vice City',
    category: 'Streets & Coast',
    cameraSpec: '35mm Anamorphic · f/1.8 · 1/120s',
    image: '/src/assets/images/gallery_ocean_beach_night_1795687507517.jpg',
    featured: true,
  },
  {
    id: 'gal-keys-bridge',
    title: 'Leonida Keys Overseas Crossing',
    location: 'Bahia Honda Span, Leonida',
    category: 'Streets & Coast',
    cameraSpec: '24mm Aerial · f/2.8 · Twilight',
    image: '/src/assets/images/gallery_leonida_keys_sunset_1795687508344.jpg',
  },
  {
    id: 'gal-rooftop-club',
    title: 'The Velvet Rope Penthouse',
    location: 'Biscayne Tower, Downtown',
    category: 'Nightlife',
    cameraSpec: '28mm Wide · f/2.0 · ISO 800',
    image: '/src/assets/images/gallery_nightclub_lounge_1795687567851.jpg',
  },
  {
    id: 'gal-vice-port-rain',
    title: 'Vice Port Rain Express',
    location: 'Interstate 95 Overpass',
    category: 'Streets & Coast',
    cameraSpec: '50mm Anamorphic · f/1.4 · Rain',
    image: '/src/assets/images/gallery_vice_port_rain_1795687568185.jpg',
    featured: true,
  },
  {
    id: 'gal-cheetah-showroom',
    title: 'Obsidian Vault · Cheetah Corsa R',
    location: 'Underground Pavilion 01',
    category: 'Showroom',
    cameraSpec: '50mm Studio · f/4.0 · Softbox Rig',
    image: '/src/assets/images/car_cheetah_supercar_1795687502934.jpg',
  },
  {
    id: 'gal-infernus-retro',
    title: 'Coral Sunset · Infernus Retro',
    location: 'Ocean Beach Vault',
    category: 'Showroom',
    cameraSpec: '35mm Studio · f/2.8 · Neon Rim',
    image: '/src/assets/images/car_infernus_classic_1795687507456.jpg',
  },
  {
    id: 'gal-lucia-portrait',
    title: 'Lucia — Downtown Overlook',
    location: 'Vice City Bayfront',
    category: 'Characters',
    cameraSpec: '85mm Portrait · f/1.4 · Neon Rim',
    image: '/src/assets/images/char_lucia_caminos_1795687499531.jpg',
  },
  {
    id: 'gal-jason-portrait',
    title: 'Jason — Palms Motel Dusk',
    location: 'Leonida Keys Strip',
    category: 'Characters',
    cameraSpec: '85mm Portrait · f/1.8 · Golden Hour',
    image: '/src/assets/images/char_jason_duval_1795687499892.jpg',
  },
];
