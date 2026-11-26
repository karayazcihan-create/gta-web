import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Info,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  PAINT_FINISHES,
  VEHICLES,
  Vehicle,
} from '../data/viceCityData';
import {
  buildProceduralCar,
  ProceduralCarHandle,
} from '../three/proceduralCarBuilder';

interface PodiumExperienceProps {
  podiumIds: [string, string, string];
  onChangeSlotVehicle: (slotIndex: 0 | 1 | 2, vehicleId: string) => void;
  onInspectVehicle: (vehicle: Vehicle) => void;
}

type CameraPreset = 'overview' | 0 | 1 | 2;

interface PlatformSpec {
  slot: 0 | 1 | 2;
  rankLabel: string;
  position: [number, number, number];
  height: number;
  radius: number;
  carScale: number;
  neonHex: number;
  neonCss: string;
  initialYaw: number;
}

const PLATFORM_SPECS: PlatformSpec[] = [
  {
    slot: 0,
    rankLabel: '01 — ELITE',
    position: [0, 0, 0.75],
    height: 1.12,
    radius: 2.68,
    carScale: 1.18,
    neonHex: 0xff2e93,
    neonCss: '#ff2e93',
    initialYaw: Math.PI * 0.22,
  },
  {
    slot: 1,
    rankLabel: '02 — PREMIUM',
    position: [-4.45, 0, -0.85],
    height: 0.62,
    radius: 2.02,
    carScale: 0.9,
    neonHex: 0x00e5ff,
    neonCss: '#00e5ff',
    initialYaw: Math.PI * 0.34,
  },
  {
    slot: 2,
    rankLabel: '03 — LEGENDARY',
    position: [4.45, 0, -0.85],
    height: 0.38,
    radius: 2.02,
    carScale: 0.9,
    neonHex: 0xa855f7,
    neonCss: '#a855f7',
    initialYaw: -Math.PI * 0.28,
  },
];

const CAMERA_TARGETS: Record<
  CameraPreset,
  { pos: [number, number, number]; look: [number, number, number] }
> = {
  overview: { pos: [0, 4.75, 11.4], look: [0, 1.35, -0.1] },
  0: { pos: [3.2, 2.85, 5.2], look: [0, 1.55, 0.75] },
  1: { pos: [-6.8, 2.35, 3.3], look: [-4.45, 1.1, -0.85] },
  2: { pos: [6.8, 2.25, 3.3], look: [4.45, 0.9, -0.85] },
};

// Reusable math helpers outside render loop (zero GC)
const _camGoalPos = new THREE.Vector3();
const _camGoalLook = new THREE.Vector3();
const _pointer = new THREE.Vector2();

function createShowroomFloorTexture(anisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#07070c';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle architectural tile seams
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.045)';
  ctx.lineWidth = 2;
  const step = 128;
  for (let i = 0; i <= 1024; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 1024);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(1024, i);
    ctx.stroke();
  }

  // Subtle radial sheen variation
  const grad = ctx.createRadialGradient(512, 512, 40, 512, 512, 512);
  grad.addColorStop(0, 'rgba(255, 46, 147, 0.05)');
  grad.addColorStop(0.55, 'rgba(0, 229, 255, 0.03)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(5, 5);
  tex.anisotropy = anisotropy;
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 126);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.45)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

export function PodiumExperience({
  podiumIds,
  onChangeSlotVehicle,
  onInspectVehicle,
}: PodiumExperienceProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activeSlot, setActiveSlot] = useState<0 | 1 | 2>(0);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('overview');
  const [autoRotate, setAutoRotate] = useState(true);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [webglError, setWebglError] = useState(false);

  // Per-slot paint selection (defaults to vehicle's default paint)
  const [slotPaints, setSlotPaints] = useState<[string, string, string]>([
    VEHICLES[0].defaultPaintHex,
    VEHICLES[1].defaultPaintHex,
    VEHICLES[4].defaultPaintHex,
  ]);

  // Mutable refs for Three.js scene loop without tearing down renderer
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  const cameraGlideRef = useRef<{ active: boolean; preset: CameraPreset }>({
    active: false,
    preset: 'overview',
  });

  const turntablesRef = useRef<THREE.Group[]>([]);
  const carHandlesRef = useRef<Array<ProceduralCarHandle | null>>([null, null, null]);
  const slotPaintsRef = useRef(slotPaints);
  slotPaintsRef.current = slotPaints;

  const podiumVehicles = podiumIds.map(
    (id) => VEHICLES.find((v) => v.id === id) ?? VEHICLES[0],
  ) as [Vehicle, Vehicle, Vehicle];

  const activeVehicle = podiumVehicles[activeSlot];

  // Sync default paint when user switches vehicle in a slot
  const handleVehicleSwitch = (slot: 0 | 1 | 2, vehicleId: string) => {
    const chosen = VEHICLES.find((v) => v.id === vehicleId);
    if (chosen) {
      setSlotPaints((prev) => {
        const next = [...prev] as [string, string, string];
        next[slot] = chosen.defaultPaintHex;
        return next;
      });
    }
    onChangeSlotVehicle(slot, vehicleId);
  };

  const handleCameraPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    if (preset !== 'overview') {
      setActiveSlot(preset);
    }
    cameraGlideRef.current = { active: true, preset };
  };

  // Initialize Three.js WebGL Showroom ONCE
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglError(true);
      return;
    }

    const width = container.clientWidth || 1280;
    const height = container.clientHeight || 680;
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglError(true);
    };
    const onContextRestored = () => {
      setWebglError(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040407);
    scene.fog = new THREE.FogExp2(0x040407, 0.032);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(...CAMERA_TARGETS.overview.pos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...CAMERA_TARGETS.overview.look);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 4.2;
    controls.maxDistance = 17.5;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI / 2 - 0.06;
    controls.update();

    controls.addEventListener('start', () => {
      cameraGlideRef.current.active = false;
    });

    // Studio Environment Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0x9ec5ff, 0x1a0b1f, 0.65);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4ea, 1.35);
    keyLight.position.set(5, 11, 7);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.camera.left = -9;
    keyLight.shadow.camera.right = 9;
    keyLight.shadow.camera.top = 9;
    keyLight.shadow.camera.bottom = -9;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    // Overhead Softboxes (skip RectAreaLight on Software WebGL)
    if (!isSoftwareGl) {
      RectAreaLightUniformsLib.init();
      const softboxPink = new THREE.RectAreaLight(0xff2e93, 3.2, 6, 1.4);
      softboxPink.position.set(-3.5, 5.8, 1.2);
      softboxPink.lookAt(0, 1, 0);
      scene.add(softboxPink);

      const softboxCyan = new THREE.RectAreaLight(0x00e5ff, 3.2, 6, 1.4);
      softboxCyan.position.set(3.5, 5.8, 1.2);
      softboxCyan.lookAt(0, 1, 0);
      scene.add(softboxCyan);
    }

    // Track disposable scene resources
    const disposables: Array<{ dispose: () => void }> = [envRT];
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    // Dark Reflective Showroom Floor
    const floorTex = createShowroomFloorTexture(maxAnisotropy);
    disposables.push(floorTex);
    const floorGeo = new THREE.CircleGeometry(28, 64);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      color: 0x0d0e14,
      metalness: 0.78,
      roughness: 0.16,
      envMapIntensity: 1.15,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.receiveShadow = true;
    scene.add(floor);
    disposables.push(floorGeo, floorMat);

    // Architectural Showroom Backdrop Arc & Neon Vertical Light Blades
    const wallGeo = new THREE.CylinderGeometry(14.5, 14.5, 8.5, 48, 1, true, Math.PI * 0.72, Math.PI * 0.56);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x090910,
      metalness: 0.4,
      roughness: 0.7,
      side: THREE.BackSide,
    });
    const backWall = new THREE.Mesh(wallGeo, wallMat);
    backWall.position.y = 4.25;
    scene.add(backWall);
    disposables.push(wallGeo, wallMat);

    const bladeColors = [0xff2e93, 0x00e5ff, 0xa855f7, 0x00e5ff, 0xff2e93];
    bladeColors.forEach((hex, idx) => {
      const angle = Math.PI + (idx - 2) * 0.24;
      const bladeGeo = new THREE.BoxGeometry(0.08, 6.2, 0.08);
      const bladeMat = new THREE.MeshBasicMaterial({ color: hex });
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.set(Math.sin(angle) * 13.8, 3.2, Math.cos(angle) * 13.8);
      scene.add(blade);
      disposables.push(bladeGeo, bladeMat);
    });

    // Contact shadow texture shared across platforms
    const shadowTex = createContactShadowTexture();
    disposables.push(shadowTex);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.7,
    });
    disposables.push(shadowMat);

    // Three-Level Geometric Podium Platforms + Spotlights + Turntables
    const turntables: THREE.Group[] = [];
    const neonRings: THREE.MeshBasicMaterial[] = [];
    const clickTargets: THREE.Object3D[] = [];
    const animLights: THREE.PointLight[] = [];

    PLATFORM_SPECS.forEach((spec) => {
      const platformRoot = new THREE.Group();
      platformRoot.position.set(spec.position[0], 0, spec.position[2]);
      platformRoot.userData.slotIndex = spec.slot;

      // Ground contact shadow
      const contactGeo = new THREE.PlaneGeometry(spec.radius * 2.55, spec.radius * 2.55);
      contactGeo.rotateX(-Math.PI / 2);
      const contactPlane = new THREE.Mesh(contactGeo, shadowMat);
      contactPlane.position.y = 0.015;
      platformRoot.add(contactPlane);
      disposables.push(contactGeo);

      // Lower octagonal stepped plinth base
      const lowerH = spec.height * 0.56;
      const lowerGeo = new THREE.CylinderGeometry(spec.radius * 0.96, spec.radius * 1.06, lowerH, 8);
      const plinthMat = new THREE.MeshStandardMaterial({
        color: 0x10111a,
        metalness: 0.65,
        roughness: 0.28,
      });
      const lowerMesh = new THREE.Mesh(lowerGeo, plinthMat);
      lowerMesh.position.y = lowerH / 2;
      lowerMesh.castShadow = true;
      lowerMesh.receiveShadow = true;
      lowerMesh.userData.slotIndex = spec.slot;
      platformRoot.add(lowerMesh);
      disposables.push(lowerGeo, plinthMat);

      // Lower neon perimeter LED strip
      const lowerLedGeo = new THREE.TorusGeometry(spec.radius * 0.97, 0.025, 10, 8);
      lowerLedGeo.rotateX(Math.PI / 2);
      lowerLedGeo.rotateY(Math.PI / 8);
      const ledMat = new THREE.MeshBasicMaterial({ color: spec.neonHex });
      neonRings.push(ledMat);
      const lowerLed = new THREE.Mesh(lowerLedGeo, ledMat);
      lowerLed.position.y = lowerH + 0.01;
      platformRoot.add(lowerLed);
      disposables.push(lowerLedGeo, ledMat);

      // Upper stepped geometric deck
      const upperH = spec.height - lowerH;
      const upperGeo = new THREE.CylinderGeometry(spec.radius * 0.88, spec.radius * 0.92, upperH, 32);
      const upperMat = new THREE.MeshStandardMaterial({
        color: 0x161722,
        metalness: 0.82,
        roughness: 0.16,
      });
      const upperMesh = new THREE.Mesh(upperGeo, upperMat);
      upperMesh.position.y = lowerH + upperH / 2;
      upperMesh.castShadow = true;
      upperMesh.receiveShadow = true;
      upperMesh.userData.slotIndex = spec.slot;
      platformRoot.add(upperMesh);
      disposables.push(upperGeo, upperMat);

      // Top glowing neon ring around turntable edge
      const topLedGeo = new THREE.TorusGeometry(spec.radius * 0.87, 0.028, 12, 64);
      topLedGeo.rotateX(Math.PI / 2);
      const topLed = new THREE.Mesh(topLedGeo, ledMat);
      topLed.position.y = spec.height + 0.015;
      platformRoot.add(topLed);
      disposables.push(topLedGeo);

      // Turntable Group sitting flush at spec.height
      const turntable = new THREE.Group();
      turntable.position.y = spec.height;
      turntable.rotation.y = spec.initialYaw;
      platformRoot.add(turntable);
      turntables.push(turntable);

      // Invisible click-proxy cylinder over car+platform for super fast raycasting
      const proxyGeo = new THREE.CylinderGeometry(spec.radius * 0.95, spec.radius * 0.95, spec.height + 1.8, 12);
      const proxyMat = new THREE.MeshBasicMaterial({ visible: false });
      const proxy = new THREE.Mesh(proxyGeo, proxyMat);
      proxy.position.y = (spec.height + 1.8) / 2;
      proxy.userData.slotIndex = spec.slot;
      platformRoot.add(proxy);
      clickTargets.push(proxy);
      disposables.push(proxyGeo, proxyMat);

      // Overhead Dedicated Spotlight + Volumetric Light Cone
      const spot = new THREE.SpotLight(
        0xffffff,
        spec.slot === 0 ? 58 : 38,
        18,
        Math.PI / 6.5,
        0.55,
        1.5,
      );
      spot.position.set(spec.position[0], 7.4, spec.position[2] + 0.8);
      spot.target.position.set(spec.position[0], spec.height + 0.5, spec.position[2]);
      if (!isSoftwareGl && spec.slot === 0) {
        spot.castShadow = true;
        spot.shadow.mapSize.set(1024, 1024);
        spot.shadow.bias = -0.0004;
      }
      scene.add(spot);
      scene.add(spot.target);

      // Subtle atmospheric spotlight beam cone
      const coneHeight = 7.4 - spec.height;
      const coneGeo = new THREE.ConeGeometry(spec.radius * 0.92, coneHeight, 32, 1, true);
      const coneMat = new THREE.MeshBasicMaterial({
        color: spec.neonHex,
        transparent: true,
        opacity: spec.slot === 0 ? 0.055 : 0.032,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(spec.position[0], spec.height + coneHeight / 2, spec.position[2]);
      scene.add(cone);
      disposables.push(coneGeo, coneMat);

      // Neon under-rim point light for platform glow
      const rimLight = new THREE.PointLight(spec.neonHex, spec.slot === 0 ? 3.5 : 2.2, 6.5, 2);
      rimLight.position.set(spec.position[0], spec.height + 0.35, spec.position[2] + spec.radius * 0.95);
      scene.add(rimLight);
      animLights.push(rimLight);

      scene.add(platformRoot);
    });

    turntablesRef.current = turntables;

    // Initial procedural cars on all 3 platforms
    podiumIds.forEach((carId, idx) => {
      const spec = PLATFORM_SPECS[idx];
      const vehicle = VEHICLES.find((v) => v.id === carId) ?? VEHICLES[idx];
      const handle = buildProceduralCar(
        vehicle.silhouette,
        slotPaintsRef.current[idx] || vehicle.defaultPaintHex,
        spec.neonCss,
      );
      handle.group.scale.setScalar(spec.carScale);
      turntables[idx].add(handle.group);
      carHandlesRef.current[idx] = handle;
    });

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Raycast click to select platform directly in 3D
    const raycaster = new THREE.Raycaster();
    let pointerDownPos = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      const dx = e.clientX - pointerDownPos.x;
      const dy = e.clientY - pointerDownPos.y;
      if (dx * dx + dy * dy > 36) return; // Ignore orbit drags

      const rect = renderer.domElement.getBoundingClientRect();
      _pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(_pointer, camera);
      const hits = raycaster.intersectObjects(clickTargets, false);
      if (hits.length > 0) {
        const slotIndex = hits[0].object.userData.slotIndex as 0 | 1 | 2 | undefined;
        if (slotIndex !== undefined) {
          setActiveSlot(slotIndex);
          setCameraPreset(slotIndex);
          cameraGlideRef.current = { active: true, preset: slotIndex };
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Animation loop with Software-WebGL pacing
    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Smooth turntable rotation
      if (autoRotateRef.current) {
        turntables[0].rotation.y += delta * 0.26;
        turntables[1].rotation.y += delta * 0.18;
        turntables[2].rotation.y -= delta * 0.18;
      }

      // Subtle animated ambient showroom lighting
      animLights.forEach((light, i) => {
        const base = i === 0 ? 3.5 : 2.2;
        light.intensity = base + Math.sin(elapsed * 1.4 + i * 1.8) * 0.45;
      });

      // Smooth exponential camera preset glide
      if (cameraGlideRef.current.active) {
        const target = CAMERA_TARGETS[cameraGlideRef.current.preset];
        _camGoalPos.set(...target.pos);
        _camGoalLook.set(...target.look);

        camera.position.x = THREE.MathUtils.damp(camera.position.x, _camGoalPos.x, 5.5, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _camGoalPos.y, 5.5, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _camGoalPos.z, 5.5, delta);

        controls.target.x = THREE.MathUtils.damp(controls.target.x, _camGoalLook.x, 6.0, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, _camGoalLook.y, 6.0, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, _camGoalLook.z, 6.0, delta);

        if (
          camera.position.distanceTo(_camGoalPos) < 0.04 &&
          controls.target.distanceTo(_camGoalLook) < 0.04
        ) {
          cameraGlideRef.current.active = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);

      carHandlesRef.current.forEach((h) => h?.dispose());
      carHandlesRef.current = [null, null, null];
      disposables.forEach((d) => d.dispose());
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Swap 3D car meshes dynamically whenever podiumIds or slotPaints change
  useEffect(() => {
    const turntables = turntablesRef.current;
    if (turntables.length !== 3) return;

    podiumIds.forEach((carId, idx) => {
      const spec = PLATFORM_SPECS[idx];
      const vehicle = VEHICLES.find((v) => v.id === carId) ?? VEHICLES[idx];
      const paintHex = slotPaints[idx] || vehicle.defaultPaintHex;
      const paintMeta = PAINT_FINISHES.find((p) => p.hex === paintHex);

      const prevHandle = carHandlesRef.current[idx];
      if (prevHandle) {
        turntables[idx].remove(prevHandle.group);
        prevHandle.dispose();
      }

      const nextHandle = buildProceduralCar(
        vehicle.silhouette,
        paintHex,
        spec.neonCss,
        paintMeta?.metalness ?? 0.85,
        paintMeta?.roughness ?? 0.16,
      );
      nextHandle.group.scale.setScalar(spec.carScale);
      turntables[idx].add(nextHandle.group);
      carHandlesRef.current[idx] = nextHandle;
    });
  }, [podiumIds, slotPaints]);

  return (
    <section
      id="podium"
      className="relative border-t border-white/5 bg-[#040407] py-16 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section Editorial Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-[#ff2e93]">
              03 · Signature Three-Level Showroom
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              The Vice City Tri-Podium
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-zinc-400">
            Drag to orbit the three-tier luxury pavilion, click any platform in 3D to inspect, or curate your own top-three lineup below.
          </p>
        </div>

        {/* 3D Podium Viewport Stage */}
        <div className="relative h-[640px] w-full overflow-hidden rounded-2xl border border-white/15 bg-[#040407] shadow-[0_32px_90px_-20px_rgba(0,0,0,0.95)] lg:h-[740px]">
          {/* Dedicated empty Three.js WebGL Mount */}
          <div
            ref={mountRef}
            className="h-full w-full cursor-grab active:cursor-grabbing"
            aria-label="Interactive Three.js Three-Level Luxury Car Podium"
          />

          {/* WebGL Unavailable Fallback */}
          {webglError && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#06060b] p-8 text-center">
              <p className="font-display text-3xl font-bold text-white">
                3D Showroom Unavailable
              </p>
              <p className="mt-2 max-w-md text-sm text-zinc-400">
                Hardware graphics acceleration is unavailable in this browser session. You can still inspect all podium vehicles below.
              </p>
            </div>
          )}

          {/* Top-Left Minimal Rank HUD (No backdrop-filter over WebGL!) */}
          <div className="pointer-events-none absolute top-4 left-4 right-4 z-10 flex flex-wrap items-start justify-between gap-3">
            <div className="pointer-events-auto flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-[#08080e]/90 p-1.5">
              {PLATFORM_SPECS.map((spec, idx) => {
                const isSelected = activeSlot === spec.slot;
                const car = podiumVehicles[idx];
                return (
                  <button
                    key={spec.rankLabel}
                    type="button"
                    onClick={() => handleCameraPreset(spec.slot)}
                    className={`flex flex-col items-start rounded-lg px-3.5 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00e5ff] ${
                      isSelected
                        ? 'bg-white/[0.1] text-white'
                        : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                    }`}
                  >
                    <span
                      className="font-mono text-[11px] font-medium tracking-wider"
                      style={{ color: spec.neonCss }}
                    >
                      {spec.rankLabel}
                    </span>
                    <span className="mt-0.5 font-display text-base font-bold leading-tight text-white whitespace-nowrap">
                      {car.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pointer-events-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => onInspectVehicle(activeVehicle)}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/15 bg-[#08080e]/90 px-3.5 text-xs font-semibold text-white transition-colors hover:border-[#ff2e93] whitespace-nowrap"
              >
                <Info className="h-3.5 w-3.5 text-[#ff2e93]" />
                <span>{activeVehicle.name} Specs</span>
              </button>
            </div>
          </div>

          {/* Collapsible Bottom Control Dock (Zero Viewport Occlusion) */}
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 flex w-[min(940px,94%)] -translate-x-1/2 flex-col items-center">
            <button
              type="button"
              onClick={() => setDockCollapsed((prev) => !prev)}
              className="pointer-events-auto mb-1.5 inline-flex items-center gap-1.5 rounded-t-lg border border-b-0 border-white/15 bg-[#08080e]/95 px-4 py-1 text-[11px] font-medium text-zinc-300 transition-colors hover:text-white"
            >
              {dockCollapsed ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" />
                  <span>Show Podium Controls</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" />
                  <span>Hide Controls</span>
                </>
              )}
            </button>

            {!dockCollapsed && (
              <div className="pointer-events-auto w-full rounded-2xl border border-white/15 bg-[#08080e]/95 p-3.5 shadow-2xl">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  {/* Switch Vehicle for Focused Platform */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-zinc-400 whitespace-nowrap">
                      {PLATFORM_SPECS[activeSlot].rankLabel}:
                    </span>
                    <select
                      aria-label="Select vehicle for active podium platform"
                      value={activeVehicle.id}
                      onChange={(e) => handleVehicleSwitch(activeSlot, e.target.value)}
                      className="h-9 rounded-lg border border-white/15 bg-[#040407] px-3 text-xs font-medium text-white focus:border-[#00e5ff] focus:outline-none"
                    >
                      {VEHICLES.map((v) => (
                        <option key={v.id} value={v.id} className="bg-[#08080e]">
                          {v.manufacturer} {v.name} ({v.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Paint Finish Swatches */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 whitespace-nowrap">Finish:</span>
                    <div className="flex items-center gap-1.5">
                      {PAINT_FINISHES.map((finish) => {
                        const selected = slotPaints[activeSlot] === finish.hex;
                        return (
                          <button
                            key={finish.id}
                            type="button"
                            title={finish.name}
                            aria-label={`Apply ${finish.name} finish`}
                            onClick={() =>
                              setSlotPaints((prev) => {
                                const next = [...prev] as [string, string, string];
                                next[activeSlot] = finish.hex;
                                return next;
                              })
                            }
                            className={`h-6 w-6 rounded-full border-2 transition-transform ${
                              selected
                                ? 'scale-110 border-white'
                                : 'border-white/20 hover:scale-105'
                            }`}
                            style={{ backgroundColor: finish.hex }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Camera Presets & Turntable Rotation */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCameraPreset('overview')}
                      className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors whitespace-nowrap ${
                        cameraPreset === 'overview'
                          ? 'bg-[#ff2e93] text-white'
                          : 'bg-white/[0.06] text-zinc-300 hover:text-white'
                      }`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Overview</span>
                    </button>

                    {([0, 1, 2] as const).map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleCameraPreset(slot)}
                        className={`h-9 rounded-lg px-2.5 font-mono text-xs font-medium transition-colors whitespace-nowrap ${
                          cameraPreset === slot
                            ? 'bg-[#00e5ff] text-[#050508] font-semibold'
                            : 'bg-white/[0.06] text-zinc-300 hover:text-white'
                        }`}
                      >
                        0{slot + 1}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setAutoRotate((prev) => !prev)}
                      aria-label={autoRotate ? 'Pause podium rotation' : 'Resume podium rotation'}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-3 text-xs font-medium text-zinc-200 transition-colors hover:border-white/35 whitespace-nowrap"
                    >
                      {autoRotate ? (
                        <>
                          <Pause className="h-3.5 w-3.5" />
                          <span>Spin</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5" />
                          <span>Paused</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCameraPreset('overview')}
                      aria-label="Reset camera view"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-zinc-300 transition-colors hover:text-white"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
