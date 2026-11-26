import * as THREE from 'three';
import { ChassisSilhouette } from '../data/viceCityData';

export interface ProceduralCarHandle {
  group: THREE.Group;
  bodyMaterial: THREE.MeshPhysicalMaterial;
  accentMaterial: THREE.MeshStandardMaterial;
  dispose: () => void;
}

interface SilhouetteProfile {
  halfLen: number;
  width: number;
  clearance: number;
  wheelRadius: number;
  tireWidth: number;
  frontAxle: number;
  rearAxle: number;
  bodyPoints: Array<[number, number]>;
  cabinPoints: Array<[number, number]>;
  hasWing: boolean;
  wingHeight: number;
  hasRoofBar: boolean;
  hasHoodScoop: boolean;
  hasPopupLights: boolean;
  isLuxuryTrim: boolean;
}

const PROFILES: Record<ChassisSilhouette, SilhouetteProfile> = {
  supercar: {
    halfLen: 2.15,
    width: 1.88,
    clearance: 0.16,
    wheelRadius: 0.34,
    tireWidth: 0.28,
    frontAxle: 1.32,
    rearAxle: -1.32,
    bodyPoints: [
      [-2.12, 0.22],
      [-2.15, 0.72],
      [-1.55, 0.84],
      [-0.7, 0.88],
      [0.45, 0.84],
      [1.45, 0.68],
      [2.12, 0.44],
      [2.15, 0.2],
      [1.65, 0.16],
      [-1.7, 0.16],
    ],
    cabinPoints: [
      [-1.08, 0.82],
      [-0.55, 1.17],
      [0.32, 1.15],
      [1.08, 0.72],
    ],
    hasWing: true,
    wingHeight: 0.28,
    hasRoofBar: false,
    hasHoodScoop: false,
    hasPopupLights: false,
    isLuxuryTrim: false,
  },
  sports: {
    halfLen: 2.18,
    width: 1.86,
    clearance: 0.18,
    wheelRadius: 0.34,
    tireWidth: 0.27,
    frontAxle: 1.35,
    rearAxle: -1.3,
    bodyPoints: [
      [-2.14, 0.24],
      [-2.16, 0.78],
      [-1.4, 0.88],
      [-0.5, 0.88],
      [0.6, 0.86],
      [1.55, 0.74],
      [2.15, 0.48],
      [2.18, 0.22],
      [1.65, 0.18],
      [-1.65, 0.18],
    ],
    cabinPoints: [
      [-1.32, 0.84],
      [-0.65, 1.24],
      [0.18, 1.23],
      [0.82, 0.83],
    ],
    hasWing: true,
    wingHeight: 0.2,
    hasRoofBar: false,
    hasHoodScoop: false,
    hasPopupLights: false,
    isLuxuryTrim: false,
  },
  muscle: {
    halfLen: 2.24,
    width: 1.92,
    clearance: 0.2,
    wheelRadius: 0.36,
    tireWidth: 0.3,
    frontAxle: 1.36,
    rearAxle: -1.32,
    bodyPoints: [
      [-2.2, 0.28],
      [-2.22, 0.88],
      [-1.3, 0.94],
      [-0.3, 0.94],
      [0.75, 0.95],
      [1.8, 0.88],
      [2.22, 0.76],
      [2.24, 0.26],
      [1.7, 0.2],
      [-1.7, 0.2],
    ],
    cabinPoints: [
      [-1.35, 0.91],
      [-0.68, 1.32],
      [0.24, 1.31],
      [0.78, 0.92],
    ],
    hasWing: false,
    wingHeight: 0.1,
    hasRoofBar: false,
    hasHoodScoop: true,
    hasPopupLights: false,
    isLuxuryTrim: false,
  },
  luxury: {
    halfLen: 2.38,
    width: 1.9,
    clearance: 0.21,
    wheelRadius: 0.36,
    tireWidth: 0.25,
    frontAxle: 1.48,
    rearAxle: -1.45,
    bodyPoints: [
      [-2.35, 0.28],
      [-2.36, 0.88],
      [-1.65, 0.94],
      [-0.8, 0.95],
      [0.8, 0.95],
      [1.85, 0.9],
      [2.35, 0.74],
      [2.38, 0.26],
      [1.8, 0.21],
      [-1.8, 0.21],
    ],
    cabinPoints: [
      [-1.48, 0.92],
      [-0.95, 1.38],
      [0.45, 1.38],
      [1.08, 0.92],
    ],
    hasWing: false,
    wingHeight: 0,
    hasRoofBar: false,
    hasHoodScoop: false,
    hasPopupLights: false,
    isLuxuryTrim: true,
  },
  classic: {
    halfLen: 2.1,
    width: 1.92,
    clearance: 0.17,
    wheelRadius: 0.34,
    tireWidth: 0.29,
    frontAxle: 1.28,
    rearAxle: -1.26,
    bodyPoints: [
      [-2.08, 0.24],
      [-2.1, 0.82],
      [-1.2, 0.86],
      [-0.2, 0.86],
      [0.95, 0.68],
      [2.08, 0.38],
      [2.1, 0.2],
      [1.6, 0.17],
      [-1.6, 0.17],
    ],
    cabinPoints: [
      [-1.02, 0.83],
      [-0.48, 1.13],
      [0.28, 1.11],
      [1.05, 0.69],
    ],
    hasWing: true,
    wingHeight: 0.32,
    hasRoofBar: false,
    hasHoodScoop: false,
    hasPopupLights: true,
    isLuxuryTrim: false,
  },
  offroad: {
    halfLen: 2.34,
    width: 2.02,
    clearance: 0.38,
    wheelRadius: 0.45,
    tireWidth: 0.34,
    frontAxle: 1.44,
    rearAxle: -1.36,
    bodyPoints: [
      [-2.32, 0.5],
      [-2.32, 1.18],
      [-1.15, 1.18],
      [-0.85, 1.18],
      [0.75, 1.18],
      [1.85, 1.12],
      [2.32, 0.96],
      [2.34, 0.46],
      [1.8, 0.38],
      [-1.8, 0.38],
    ],
    cabinPoints: [
      [-0.85, 1.16],
      [-0.7, 1.72],
      [0.52, 1.72],
      [0.96, 1.16],
    ],
    hasWing: false,
    wingHeight: 0,
    hasRoofBar: true,
    hasHoodScoop: true,
    hasPopupLights: false,
    isLuxuryTrim: false,
  },
};

function createShapeFromPoints(points: Array<[number, number]>): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i][0], points[i][1]);
  }
  shape.closePath();
  return shape;
}

export function buildProceduralCar(
  silhouette: ChassisSilhouette,
  paintHex: string,
  accentHex: string,
  paintMetalness = 0.85,
  paintRoughness = 0.16,
): ProceduralCarHandle {
  const profile = PROFILES[silhouette];
  const group = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  // 1. Primary sculpted clearcoat body paint
  const bodyMaterial = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(paintHex),
      metalness: paintMetalness,
      roughness: paintRoughness,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.45,
    }),
  );

  // 2. Carbon / matte satin aero trim
  const carbonMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x111218,
      metalness: 0.35,
      roughness: 0.45,
    }),
  );

  // 3. Tinted dark automotive glass
  const glassMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x090b12,
      metalness: 0.15,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      envMapIntensity: 1.9,
    }),
  );

  // 4. Machined metallic alloy & chrome
  const alloyMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: profile.isLuxuryTrim ? 0xd9dee8 : 0x9aa3b2,
      metalness: 0.94,
      roughness: 0.18,
    }),
  );

  // 5. Tire rubber
  const tireMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x101116,
      metalness: 0.05,
      roughness: 0.86,
    }),
  );

  // 6. Emissive headlights (crisp cool xenon)
  const headlightMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xeaf6ff,
      emissive: 0xcbeeff,
      emissiveIntensity: 2.2,
      roughness: 0.1,
    }),
  );

  // 7. Emissive taillights (ruby crimson + Vice pink glow)
  const taillightMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xff1e56,
      emissive: 0xff1e56,
      emissiveIntensity: 2.4,
      roughness: 0.15,
    }),
  );

  // 8. Neon accent caliper / underglow trim
  const accentMaterial = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentHex),
      emissive: new THREE.Color(accentHex),
      emissiveIntensity: 1.6,
      roughness: 0.2,
      metalness: 0.4,
    }),
  );

  // --- Primary Body Hull (ExtrudeGeometry with bevels) ---
  const bodyShape = createShapeFromPoints(profile.bodyPoints);
  const bodyDepth = profile.width - 0.16;
  const bodyGeo = trackGeo(
    new THREE.ExtrudeGeometry(bodyShape, {
      depth: bodyDepth,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.05,
      bevelSegments: 3,
      steps: 1,
    }),
  );
  bodyGeo.translate(0, 0, -bodyDepth / 2);
  bodyGeo.computeVertexNormals();
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMaterial);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  // --- Greenhouse / Cabin (ExtrudeGeometry) ---
  const cabinShape = createShapeFromPoints(profile.cabinPoints);
  const cabinWidth = profile.width * 0.76;
  const cabinGeo = trackGeo(
    new THREE.ExtrudeGeometry(cabinShape, {
      depth: cabinWidth,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.04,
      bevelSegments: 2,
      steps: 1,
    }),
  );
  cabinGeo.translate(0, 0, -cabinWidth / 2);
  const cabinMesh = new THREE.Mesh(cabinGeo, glassMat);
  cabinMesh.castShadow = true;
  group.add(cabinMesh);

  // Painted Roof Cap
  const roofCapGeo = trackGeo(
    new THREE.BoxGeometry(
      (profile.cabinPoints[2][0] - profile.cabinPoints[1][0]) * 0.92,
      0.045,
      cabinWidth * 0.92,
    ),
  );
  const roofY = Math.max(profile.cabinPoints[1][1], profile.cabinPoints[2][1]);
  const roofX = (profile.cabinPoints[1][0] + profile.cabinPoints[2][0]) / 2;
  const roofCap = new THREE.Mesh(roofCapGeo, bodyMaterial);
  roofCap.position.set(roofX, roofY + 0.03, 0);
  roofCap.castShadow = true;
  group.add(roofCap);

  // --- Front Splitter & Rear Diffuser (Carbon) ---
  const splitterGeo = trackGeo(
    new THREE.BoxGeometry(0.45, 0.055, profile.width + 0.04),
  );
  const splitter = new THREE.Mesh(splitterGeo, carbonMat);
  splitter.position.set(profile.halfLen - 0.14, profile.clearance + 0.02, 0);
  splitter.castShadow = true;
  group.add(splitter);

  const diffuserGeo = trackGeo(
    new THREE.BoxGeometry(0.42, 0.14, profile.width * 0.88),
  );
  const diffuser = new THREE.Mesh(diffuserGeo, carbonMat);
  diffuser.position.set(-profile.halfLen + 0.14, profile.clearance + 0.08, 0);
  group.add(diffuser);

  // Side Skirts
  const skirtGeo = trackGeo(
    new THREE.BoxGeometry(profile.frontAxle - profile.rearAxle - 0.75, 0.06, profile.width + 0.06),
  );
  const skirt = new THREE.Mesh(skirtGeo, carbonMat);
  skirt.position.set((profile.frontAxle + profile.rearAxle) / 2, profile.clearance + 0.02, 0);
  group.add(skirt);

  // --- Headlights & Taillights ---
  const headY = profile.bodyPoints[6][1] * 0.72 + profile.clearance * 0.4;
  if (profile.hasPopupLights) {
    const podGeo = trackGeo(new THREE.BoxGeometry(0.22, 0.1, 0.34));
    [-0.58, 0.58].forEach((zPos) => {
      const pod = new THREE.Mesh(podGeo, bodyMaterial);
      pod.position.set(profile.halfLen - 0.35, headY + 0.12, zPos);
      group.add(pod);
      const lens = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.03, 0.07, 0.28)),
        headlightMat,
      );
      lens.position.set(profile.halfLen - 0.24, headY + 0.12, zPos);
      group.add(lens);
    });
  } else {
    const hlGeo = trackGeo(new THREE.BoxGeometry(0.06, 0.075, 0.38));
    [-0.64, 0.64].forEach((zPos) => {
      const hl = new THREE.Mesh(hlGeo, headlightMat);
      hl.position.set(profile.halfLen + 0.01, headY + 0.08, zPos);
      group.add(hl);
    });
  }

  // Front Grille (Luxury / Muscle / Offroad)
  const grilleGeo = trackGeo(
    new THREE.BoxGeometry(0.05, profile.isLuxuryTrim ? 0.3 : 0.18, profile.width * 0.52),
  );
  const grille = new THREE.Mesh(grilleGeo, profile.isLuxuryTrim ? alloyMat : carbonMat);
  grille.position.set(profile.halfLen + 0.01, headY - 0.02, 0);
  group.add(grille);

  // Full-width LED Taillight Blade
  const tlY = profile.bodyPoints[1][1] - 0.14;
  const tlGeo = trackGeo(new THREE.BoxGeometry(0.05, 0.065, profile.width * 0.84));
  const tl = new THREE.Mesh(tlGeo, taillightMat);
  tl.position.set(-profile.halfLen - 0.01, tlY, 0);
  group.add(tl);

  // Quad Exhaust Pipes
  const exhaustGeo = trackGeo(new THREE.CylinderGeometry(0.045, 0.045, 0.18, 12));
  exhaustGeo.rotateZ(Math.PI / 2);
  [-0.54, -0.4, 0.4, 0.54].forEach((zPos) => {
    const pipe = new THREE.Mesh(exhaustGeo, alloyMat);
    pipe.position.set(-profile.halfLen + 0.02, profile.clearance + 0.09, zPos);
    group.add(pipe);
  });

  // --- Side Mirrors ---
  const mirrorArmGeo = trackGeo(new THREE.BoxGeometry(0.08, 0.05, 0.16));
  [-1, 1].forEach((side) => {
    const mirror = new THREE.Mesh(mirrorArmGeo, carbonMat);
    mirror.position.set(0.55, profile.cabinPoints[3][1] + 0.05, side * (profile.width * 0.49));
    group.add(mirror);
  });

  // --- Conditional Aero Wing / Hood Scoop / Off-Road Lightbar ---
  if (profile.hasWing) {
    const wingY = profile.bodyPoints[1][1] + profile.wingHeight;
    const bladeGeo = trackGeo(new THREE.BoxGeometry(0.28, 0.035, profile.width * 0.96));
    const blade = new THREE.Mesh(bladeGeo, silhouette === 'classic' ? bodyMaterial : carbonMat);
    blade.position.set(-profile.halfLen + 0.18, wingY, 0);
    blade.castShadow = true;
    group.add(blade);

    const strutGeo = trackGeo(new THREE.BoxGeometry(0.16, profile.wingHeight + 0.04, 0.035));
    [-0.56, 0.56].forEach((zPos) => {
      const strut = new THREE.Mesh(strutGeo, carbonMat);
      strut.position.set(-profile.halfLen + 0.16, profile.bodyPoints[1][1] + profile.wingHeight / 2, zPos);
      group.add(strut);
    });
  }

  if (profile.hasHoodScoop) {
    const scoopGeo = trackGeo(new THREE.BoxGeometry(0.65, 0.09, 0.54));
    const scoop = new THREE.Mesh(scoopGeo, carbonMat);
    scoop.position.set(1.25, profile.bodyPoints[5][1] + 0.04, 0);
    group.add(scoop);
  }

  if (profile.hasRoofBar) {
    const rackGeo = trackGeo(new THREE.BoxGeometry(1.15, 0.06, profile.width * 0.72));
    const rack = new THREE.Mesh(rackGeo, carbonMat);
    rack.position.set(-0.1, roofY + 0.08, 0);
    group.add(rack);

    const ledBar = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.08, 0.07, profile.width * 0.66)),
      headlightMat,
    );
    ledBar.position.set(0.45, roofY + 0.11, 0);
    group.add(ledBar);
  }

  // --- 4 Multi-Part Wheels (Tire + Machined Rim + Brake Caliper) ---
  const wheelZ = profile.width * 0.46;
  const tireGeo = trackGeo(
    new THREE.CylinderGeometry(profile.wheelRadius, profile.wheelRadius, profile.tireWidth, 28),
  );
  tireGeo.rotateX(Math.PI / 2);

  const rimGeo = trackGeo(
    new THREE.CylinderGeometry(profile.wheelRadius * 0.68, profile.wheelRadius * 0.68, profile.tireWidth + 0.018, 20),
  );
  rimGeo.rotateX(Math.PI / 2);

  const hubGeo = trackGeo(
    new THREE.CylinderGeometry(profile.wheelRadius * 0.22, profile.wheelRadius * 0.22, profile.tireWidth + 0.035, 12),
  );
  hubGeo.rotateX(Math.PI / 2);

  const spokeGeo = trackGeo(
    new THREE.BoxGeometry(profile.wheelRadius * 1.28, 0.038, profile.tireWidth + 0.024),
  );

  const caliperGeo = trackGeo(new THREE.BoxGeometry(0.14, 0.18, 0.08));

  const wheelPositions: Array<[number, number]> = [
    [profile.frontAxle, wheelZ],
    [profile.frontAxle, -wheelZ],
    [profile.rearAxle, wheelZ],
    [profile.rearAxle, -wheelZ],
  ];

  wheelPositions.forEach(([wx, wz]) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(wx, profile.wheelRadius, wz);

    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.castShadow = true;
    wheelGroup.add(tire);

    const rim = new THREE.Mesh(rimGeo, alloyMat);
    wheelGroup.add(rim);

    const hub = new THREE.Mesh(hubGeo, accentMaterial);
    wheelGroup.add(hub);

    // 5-spoke star pattern
    for (let s = 0; s < 3; s++) {
      const spoke = new THREE.Mesh(spokeGeo, carbonMat);
      spoke.rotation.z = (s * Math.PI) / 3;
      wheelGroup.add(spoke);
    }

    const caliper = new THREE.Mesh(caliperGeo, accentMaterial);
    caliper.position.set(-profile.wheelRadius * 0.25, 0.04, wz > 0 ? 0.06 : -0.06);
    wheelGroup.add(caliper);

    group.add(wheelGroup);
  });

  // Underglow subtle neon strip beneath rocker
  const underGlowGeo = trackGeo(
    new THREE.BoxGeometry(profile.halfLen * 1.45, 0.015, profile.width * 0.72),
  );
  const underGlow = new THREE.Mesh(underGlowGeo, accentMaterial);
  underGlow.position.set(0, profile.clearance * 0.45, 0);
  group.add(underGlow);

  return {
    group,
    bodyMaterial,
    accentMaterial,
    dispose: () => {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
