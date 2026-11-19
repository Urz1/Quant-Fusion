"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Robot3DCanvasProps {
  size?: "sm" | "md" | "lg" | "xl" | "mascot";
  isStreaming?: boolean;
  interactive?: boolean;
  forceWave?: boolean;
  trackCursor?: boolean;
  onClick?: () => void;
  onReady?: () => void;
}

export function Robot3DCanvas({
  isStreaming = false,
  forceWave = false,
  trackCursor = true,
  onClick,
  onReady,
}: Robot3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  const [isHovered, setIsHovered] = useState(false);

  // Initialize and run Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container || typeof window === "undefined") return;

    // Disposables tracker for clean memory management
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];

    const trackGeom = <T extends THREE.BufferGeometry>(g: T): T => {
      geometries.push(g);
      return g;
    };
    const trackMat = <T extends THREE.Material>(m: T): T => {
      materials.push(m);
      return m;
    };
    const trackTex = <T extends THREE.Texture>(t: T): T => {
      textures.push(t);
      return t;
    };

    // 1. Scene, Camera, Renderer
    const width = container.clientWidth || 120;
    const height = container.clientHeight || 120;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0, 4.9);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 2. Studio Lighting for Volumetric PBR Highlights (Warm Editorial + Signature Emerald)
    const keyLight = new THREE.DirectionalLight(0xfffcf7, 2.5);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const ambientLight = new THREE.AmbientLight(0x2a303a, 1.25);
    scene.add(ambientLight);

    // Quant Fusion signature emerald bounce rim light (No blue!)
    const rimLight = new THREE.DirectionalLight(0x10b981, 1.6);
    rimLight.position.set(-3, -2, -2);
    scene.add(rimLight);

    // Top specular glare light (clean platinum highlight)
    const topLight = new THREE.DirectionalLight(0xf8fafc, 1.1);
    topLight.position.set(0, 5, 1);
    scene.add(topLight);

    // 3. Materials
    // Executive Obsidian Titanium (Warm Graphite Metal matching #1A1714 platform ink)
    const titaniumMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1c1f26,
        metalness: 0.85,
        roughness: 0.28,
      })
    );

    // Platinum Silver Bevel & Trims (matching #D5D0C5 platform rules)
    const chromeMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xc8d2de,
        metalness: 0.92,
        roughness: 0.15,
      })
    );

    // Deep Smoked Obsidian Visor Frame
    const bezelMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0a0c10,
        metalness: 0.6,
        roughness: 0.35,
      })
    );

    // Visor Deep Cavity Glass Dome with High Specular Clarity
    const visorGlassMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x0a0e14,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.72,
        transparent: true,
        opacity: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        reflectivity: 0.85,
      })
    );

    // Quant Fusion British Racing Emerald (#0F663E with #10B981 core emission)
    const emeraldEmissiveMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0f663e,
        emissive: 0x10b981,
        emissiveIntensity: 3.6,
        roughness: 0.15,
      })
    );

    // Pupil White Core Specular
    const pupilMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
      })
    );

    // Signature Emerald / Mint Aurora Plasma Flame (No dark blue!)
    const emeraldPlasmaMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.88,
      })
    );

    const whiteCorePlasmaMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
      })
    );

    // 4. Procedural 3D Robot Assembly
    const robotRoot = new THREE.Group();
    scene.add(robotRoot);

    // ================= HEAD & HELMET =================
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.5, 0);
    robotRoot.add(headGroup);

    // Volumetric Helmet Shell (Spherical Rounded Capsule - High poly for crisp zoom)
    const helmetGeom = trackGeom(new THREE.SphereGeometry(0.72, 48, 36));
    helmetGeom.scale(1.16, 0.9, 0.96);
    const helmetMesh = new THREE.Mesh(helmetGeom, titaniumMat);
    headGroup.add(helmetMesh);

    // Visor Outer Bezel Ring (Front, +Z)
    const visorBezelGeom = trackGeom(new THREE.TorusGeometry(0.46, 0.052, 24, 48));
    visorBezelGeom.scale(1.18, 0.72, 1);
    const visorBezelMesh = new THREE.Mesh(visorBezelGeom, bezelMat);
    visorBezelMesh.position.set(0, 0.02, 0.62);
    headGroup.add(visorBezelMesh);

    // Convex Visor Glass Dome
    const visorDomeGeom = trackGeom(new THREE.SphereGeometry(0.48, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.48));
    visorDomeGeom.scale(1.14, 0.68, 0.75);
    const visorDomeMesh = new THREE.Mesh(visorDomeGeom, visorGlassMat);
    visorDomeMesh.rotation.x = Math.PI / 2;
    visorDomeMesh.position.set(0, 0.02, 0.38);
    headGroup.add(visorDomeMesh);

    // Holographic Digital LED Eyes (Vibrantly Recessed with Specular Pupils)
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(0, 0.03, 0.62);
    headGroup.add(eyeGroup);

    const eyeGeom = trackGeom(new THREE.CapsuleGeometry(0.09, 0.11, 16, 24));
    const leftEye = new THREE.Mesh(eyeGeom, emeraldEmissiveMat);
    leftEye.position.set(-0.24, 0, 0);
    eyeGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeom, emeraldEmissiveMat);
    rightEye.position.set(0.24, 0, 0);
    eyeGroup.add(rightEye);

    // Specular White Pupils (Spherical and round without faceting)
    const pupilGeom = trackGeom(new THREE.SphereGeometry(0.034, 24, 20));
    const leftPupil = new THREE.Mesh(pupilGeom, pupilMat);
    leftPupil.position.set(-0.21, 0.05, 0.08);
    eyeGroup.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeom, pupilMat);
    rightPupil.position.set(0.27, 0.05, 0.08);
    eyeGroup.add(rightPupil);

    // LED Smile Line (Positioned cleanly on the visor plane, in front of the cavity, glowing without helmet clipping)
    const smileGeom = trackGeom(new THREE.TorusGeometry(0.12, 0.018, 16, 32, Math.PI * 0.72));
    const smileMesh = new THREE.Mesh(smileGeom, emeraldEmissiveMat);
    smileMesh.position.set(0, -0.09, 0.672);
    smileMesh.rotation.z = Math.PI * 1.14;
    headGroup.add(smileMesh);

    // ================= BACK OF HELMET (-Z) =================
    // Titanium backplate with cooling grilles
    const backplateGeom = trackGeom(new THREE.BoxGeometry(0.68, 0.38, 0.08));
    const backplateMesh = new THREE.Mesh(backplateGeom, chromeMat);
    backplateMesh.position.set(0, 0.02, -0.66);
    headGroup.add(backplateMesh);

    // Slotted heat vents with subtle cyan backlight
    for (let i = -1; i <= 1; i++) {
      const ventGeom = trackGeom(new THREE.BoxGeometry(0.5, 0.04, 0.02));
      const ventMesh = new THREE.Mesh(ventGeom, bezelMat);
      ventMesh.position.set(0, 0.02 + i * 0.1, -0.71);
      headGroup.add(ventMesh);
    }

    // ================= ANTENNA =================
    // Base Turret
    const antennaBaseGeom = trackGeom(new THREE.CylinderGeometry(0.08, 0.11, 0.08, 32));
    const antennaBase = new THREE.Mesh(antennaBaseGeom, chromeMat);
    antennaBase.position.set(0, 0.68, 0);
    headGroup.add(antennaBase);

    // Chrome Stem
    const stemGeom = trackGeom(new THREE.CylinderGeometry(0.018, 0.024, 0.38, 24));
    const stem = new THREE.Mesh(stemGeom, chromeMat);
    stem.position.set(0, 0.88, 0);
    headGroup.add(stem);

    // Glowing Emerald Beacon Tip
    const beaconGeom = trackGeom(new THREE.SphereGeometry(0.12, 32, 24));
    const beacon = new THREE.Mesh(beaconGeom, emeraldEmissiveMat);
    beacon.position.set(0, 1.1, 0);
    headGroup.add(beacon);

    // ================= 3D CYLINDRICAL EAR DIALS =================
    const earGeom = trackGeom(new THREE.CylinderGeometry(0.18, 0.18, 0.16, 36));

    // Left Ear
    const leftEar = new THREE.Mesh(earGeom, titaniumMat);
    leftEar.rotation.z = Math.PI / 2;
    leftEar.position.set(-0.84, 0, 0);
    headGroup.add(leftEar);

    const leftEarCap = new THREE.Mesh(trackGeom(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 36)), chromeMat);
    leftEarCap.rotation.z = Math.PI / 2;
    leftEarCap.position.set(-0.93, 0, 0);
    headGroup.add(leftEarCap);

    // Right Ear
    const rightEar = new THREE.Mesh(earGeom, titaniumMat);
    rightEar.rotation.z = Math.PI / 2;
    rightEar.position.set(0.84, 0, 0);
    headGroup.add(rightEar);

    const rightEarCap = new THREE.Mesh(trackGeom(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 36)), chromeMat);
    rightEarCap.rotation.z = Math.PI / 2;
    rightEarCap.position.set(0.93, 0, 0);
    headGroup.add(rightEarCap);

    // ================= NECK JOINT =================
    const neckGeom = trackGeom(new THREE.CylinderGeometry(0.24, 0.24, 0.14, 32));
    const neck = new THREE.Mesh(neckGeom, bezelMat);
    neck.position.set(0, 0.05, 0);
    robotRoot.add(neck);

    // ================= TORSO =================
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, -0.48, 0);
    robotRoot.add(torsoGroup);

    // Torso Capsule (High-poly)
    const torsoGeom = trackGeom(new THREE.SphereGeometry(0.66, 48, 36));
    torsoGeom.scale(1.08, 0.92, 0.88);
    const torsoMesh = new THREE.Mesh(torsoGeom, titaniumMat);
    torsoGroup.add(torsoMesh);

    // Recessed Chest Telemetry Console (Front, +Z)
    // 1. Sleek Platinum Silver Bezel Frame (Provides crisp contrast against dark titanium torso)
    const chestFrameGeom = trackGeom(new THREE.BoxGeometry(0.62, 0.34, 0.04));
    const chestFrame = new THREE.Mesh(chestFrameGeom, chromeMat);
    chestFrame.position.set(0, 0.04, 0.575);
    torsoGroup.add(chestFrame);

    // 2. Inset Glossy Obsidian OLED Display Panel
    const chestScreenGeom = trackGeom(new THREE.BoxGeometry(0.55, 0.27, 0.02));
    const chestScreen = new THREE.Mesh(chestScreenGeom, bezelMat);
    chestScreen.position.set(0, 0.04, 0.592);
    torsoGroup.add(chestScreen);

    // 3. Integrated Telemetry Readout & Segmented Battery/Status Bars
    // Three discrete energy level pips
    for (let p = 0; p < 3; p++) {
      const pipGeom = trackGeom(new THREE.BoxGeometry(0.065, 0.03, 0.012));
      const pipMesh = new THREE.Mesh(pipGeom, emeraldEmissiveMat);
      pipMesh.position.set(-0.16 + p * 0.085, 0.08, 0.605);
      torsoGroup.add(pipMesh);
    }

    // Live Heartbeat / Audit Status LED Indicator Node
    const waveDotGeom = trackGeom(new THREE.SphereGeometry(0.038, 16, 16));
    const waveDot = new THREE.Mesh(waveDotGeom, emeraldEmissiveMat);
    waveDot.position.set(0.18, 0.08, 0.605);
    torsoGroup.add(waveDot);

    // Central Data Bus Throughput Bar
    const busBarGeom = trackGeom(new THREE.BoxGeometry(0.42, 0.032, 0.012));
    const busBar = new THREE.Mesh(busBarGeom, emeraldPlasmaMat);
    busBar.position.set(-0.02, 0.00, 0.605);
    torsoGroup.add(busBar);

    // Secondary Telemetry Clock Line
    const clockBarGeom = trackGeom(new THREE.BoxGeometry(0.24, 0.022, 0.012));
    const clockBar = new THREE.Mesh(clockBarGeom, emeraldEmissiveMat);
    clockBar.position.set(0.07, -0.07, 0.605);
    torsoGroup.add(clockBar);

    // ================= BACK OF TORSO (-Z): CYBERNETIC POWER CELL =================
    const powerCellGeom = trackGeom(new THREE.CylinderGeometry(0.24, 0.24, 0.52, 32));
    const powerCell = new THREE.Mesh(powerCellGeom, titaniumMat);
    powerCell.position.set(0, 0.02, -0.54);
    torsoGroup.add(powerCell);

    // Power Cell Chrome Caps
    const topCap = new THREE.Mesh(trackGeom(new THREE.CylinderGeometry(0.26, 0.26, 0.06, 32)), chromeMat);
    topCap.position.set(0, 0.28, -0.54);
    torsoGroup.add(topCap);

    const btmCap = new THREE.Mesh(trackGeom(new THREE.CylinderGeometry(0.26, 0.26, 0.06, 32)), chromeMat);
    btmCap.position.set(0, -0.24, -0.54);
    torsoGroup.add(btmCap);

    // Glowing Power Core Level Bar
    const powerLevelGeom = trackGeom(new THREE.BoxGeometry(0.05, 0.38, 0.03));
    const powerLevel = new THREE.Mesh(powerLevelGeom, emeraldEmissiveMat);
    powerLevel.position.set(0, 0.02, -0.67);
    torsoGroup.add(powerLevel);

    // ================= ARMS & SHOULDERS =================
    const shoulderGeom = trackGeom(new THREE.SphereGeometry(0.13, 24, 24));
    const handGeom = trackGeom(new THREE.SphereGeometry(0.12, 24, 24));

    // Left Arm
    const leftShoulder = new THREE.Mesh(shoulderGeom, chromeMat);
    leftShoulder.position.set(-0.76, 0.18, 0);
    torsoGroup.add(leftShoulder);

    const leftArmGeom = trackGeom(new THREE.CylinderGeometry(0.065, 0.065, 0.42, 24));
    const leftArm = new THREE.Mesh(leftArmGeom, titaniumMat);
    leftArm.position.set(-0.84, -0.06, 0.06);
    leftArm.rotation.z = 0.32;
    torsoGroup.add(leftArm);

    const leftHand = new THREE.Mesh(handGeom, chromeMat);
    leftHand.position.set(-0.91, -0.3, 0.12);
    torsoGroup.add(leftHand);

    // Right Arm (Articulated Waving Arm)
    const rightShoulder = new THREE.Mesh(shoulderGeom, chromeMat);
    rightShoulder.position.set(0.76, 0.18, 0);
    torsoGroup.add(rightShoulder);

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.76, 0.18, 0);
    torsoGroup.add(rightArmGroup);

    const rightArm = new THREE.Mesh(leftArmGeom, titaniumMat);
    rightArm.position.set(0.12, 0.12, 0.08);
    rightArm.rotation.z = -0.7;
    rightArmGroup.add(rightArm);

    // Right hand: Matching chrome hand with integrated emerald palm beacon
    const rightHand = new THREE.Mesh(handGeom, chromeMat);
    rightHand.position.set(0.24, 0.28, 0.14);
    rightArmGroup.add(rightHand);

    const palmBeaconGeom = trackGeom(new THREE.SphereGeometry(0.06, 20, 20));
    const palmBeacon = new THREE.Mesh(palmBeaconGeom, emeraldEmissiveMat);
    palmBeacon.position.set(0.24, 0.31, 0.18);
    rightArmGroup.add(palmBeacon);

    // ================= HOVER THRUSTERS & PLASMA =================
    const thrusterBellGeom = trackGeom(new THREE.CylinderGeometry(0.12, 0.18, 0.18, 32, 1));

    // Left Thruster Nozzle
    const leftNozzle = new THREE.Mesh(thrusterBellGeom, chromeMat);
    leftNozzle.position.set(-0.3, -0.58, 0);
    torsoGroup.add(leftNozzle);

    const leftNozzleInner = new THREE.Mesh(trackGeom(new THREE.CylinderGeometry(0.10, 0.10, 0.04, 32)), bezelMat);
    leftNozzleInner.position.set(-0.3, -0.66, 0);
    torsoGroup.add(leftNozzleInner);

    // Right Thruster Nozzle
    const rightNozzle = new THREE.Mesh(thrusterBellGeom, chromeMat);
    rightNozzle.position.set(0.3, -0.58, 0);
    torsoGroup.add(rightNozzle);

    const rightNozzleInner = new THREE.Mesh(trackGeom(new THREE.CylinderGeometry(0.10, 0.10, 0.04, 32)), bezelMat);
    rightNozzleInner.position.set(0.3, -0.66, 0);
    torsoGroup.add(rightNozzleInner);

    // Soft Anti-Gravity Plasma Rings & Compact Core Jet (No sharp vampire fangs!)
    const leftRingGeom = trackGeom(new THREE.TorusGeometry(0.10, 0.024, 16, 32));
    const leftPlasmaRing = new THREE.Mesh(leftRingGeom, emeraldPlasmaMat);
    leftPlasmaRing.rotation.x = Math.PI / 2;
    leftPlasmaRing.position.set(-0.3, -0.70, 0);
    torsoGroup.add(leftPlasmaRing);

    const rightPlasmaRing = new THREE.Mesh(leftRingGeom, emeraldPlasmaMat);
    rightPlasmaRing.rotation.x = Math.PI / 2;
    rightPlasmaRing.position.set(0.3, -0.70, 0);
    torsoGroup.add(rightPlasmaRing);

    const flameGeom = trackGeom(new THREE.ConeGeometry(0.10, 0.22, 32));
    const leftFlame = new THREE.Mesh(flameGeom, emeraldPlasmaMat);
    leftFlame.position.set(-0.3, -0.74, 0);
    leftFlame.rotation.x = Math.PI;
    torsoGroup.add(leftFlame);

    const rightFlame = new THREE.Mesh(flameGeom, emeraldPlasmaMat);
    rightFlame.position.set(0.3, -0.74, 0);
    rightFlame.rotation.x = Math.PI;
    torsoGroup.add(rightFlame);

    // White Core Jet
    const coreFlameGeom = trackGeom(new THREE.ConeGeometry(0.05, 0.14, 20));
    const leftCore = new THREE.Mesh(coreFlameGeom, whiteCorePlasmaMat);
    leftCore.position.set(-0.3, -0.70, 0);
    leftCore.rotation.x = Math.PI;
    torsoGroup.add(leftCore);

    const rightCore = new THREE.Mesh(coreFlameGeom, whiteCorePlasmaMat);
    rightCore.position.set(0.3, -0.70, 0);
    rightCore.rotation.x = Math.PI;
    torsoGroup.add(rightCore);

    // ================= SOFT CONTACT FLOOR SHADOW (512x512 HIGH-RES) =================
    // Procedural dynamic radial gradient shadow texture
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 512;
    shadowCanvas.height = 512;
    const sCtx = shadowCanvas.getContext("2d");
    if (sCtx) {
      const grad = sCtx.createRadialGradient(256, 256, 0, 256, 256, 256);
      grad.addColorStop(0, "rgba(2, 6, 23, 0.65)");
      grad.addColorStop(0.25, "rgba(2, 6, 23, 0.42)");
      grad.addColorStop(0.55, "rgba(2, 6, 23, 0.16)");
      grad.addColorStop(0.85, "rgba(2, 6, 23, 0.04)");
      grad.addColorStop(1, "rgba(2, 6, 23, 0)");
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 512, 512);
    }
    const shadowTexture = trackTex(new THREE.CanvasTexture(shadowCanvas));
    const shadowGeom = trackGeom(new THREE.PlaneGeometry(1.9, 1.9));
    const shadowMat = trackMat(
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
      })
    );
    const floorShadow = new THREE.Mesh(shadowGeom, shadowMat);
    floorShadow.rotation.x = -Math.PI / 2;
    floorShadow.position.set(0, -1.42, 0);
    scene.add(floorShadow);

    // 5. Interactive Cursor, Touch Drag & Dynamic 4K/Retina Resolution Engine
    let cachedCenterX = 0;
    let cachedCenterY = 0;

    const handleResize = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      cachedCenterX = rect.left + rect.width / 2;
      cachedCenterY = rect.top + rect.height / 2;

      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      // Recalculate device pixel ratio on browser zoom up to 3x for razor-sharp fidelity
      const pr = Math.min(window.devicePixelRatio || 1, 3);
      renderer.setPixelRatio(pr);
      renderer.setSize(w, h, false);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // Subtle tactile haptic response on supported mobile devices
    const triggerHaptic = (ms = 12) => {
      if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
        try {
          navigator.vibrate(ms);
        } catch {}
      }
    };

    // Mobile Gyroscope / Device Orientation tracking
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (isDraggingRef.current) return;
      if (e.gamma === null || e.beta === null) return;
      // Gamma is left-to-right tilt in degrees [-90 to 90]
      // Beta is front-to-back tilt in degrees [-180 to 180], typical holding angle is ~45deg
      const normGamma = Math.max(-45, Math.min(45, e.gamma)) / 45;
      const normBeta = Math.max(-30, Math.min(30, e.beta - 45)) / 30;

      targetRotationRef.current = {
        x: -normBeta * 0.35,
        y: normGamma * 0.7,
      };
    };

    const requestGyroPermission = () => {
      if (
        typeof window !== "undefined" &&
        typeof (window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })?.requestPermission === "function"
      ) {
        (window.DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> })
          .requestPermission()
          .then((state) => {
            if (state === "granted") {
              window.addEventListener("deviceorientation", handleOrientation, { passive: true });
            }
          })
          .catch(() => {});
      }
    };

    // Auto-attach orientation on devices that do not require explicit iOS prompt (Android / Chrome)
    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", handleOrientation, { passive: true });
    }

    // Scroll Velocity Flare (Mobile reacts dynamically during page browsing)
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let lastScrollTime = performance.now();
    const handleScroll = () => {
      handleResize();
      if (isDraggingRef.current) return;
      const currentScrollY = window.scrollY;
      const now = performance.now();
      const dt = Math.max(1, now - lastScrollTime);
      const speed = (currentScrollY - lastScrollY) / dt;
      lastScrollY = currentScrollY;
      lastScrollTime = now;

      if (Math.abs(speed) > 0.15) {
        const tilt = Math.max(-0.35, Math.min(0.35, speed * 0.18));
        targetRotationRef.current.x = tilt;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handlePointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      hasMovedRef.current = false;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      rotationVelocityRef.current = { x: 0, y: 0 };
      triggerHaptic(8);
      requestGyroPermission();
      try {
        (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
      } catch {}
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isDraggingRef.current) {
        const deltaX = e.clientX - lastMousePosRef.current.x;
        const deltaY = e.clientY - lastMousePosRef.current.y;

        if (Math.hypot(e.clientX - dragStartRef.current.x, e.clientY - dragStartRef.current.y) > 4) {
          hasMovedRef.current = true;
        }

        targetRotationRef.current.y += deltaX * 0.024;
        targetRotationRef.current.x = Math.max(
          -0.55,
          Math.min(0.55, targetRotationRef.current.x + deltaY * 0.018)
        );

        rotationVelocityRef.current = {
          x: deltaY * 0.014,
          y: deltaX * 0.020,
        };

        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      } else if (trackCursor) {
        // Continuous 360° Circular Gaze Tracking across viewport (Zero layout thrashing)
        if (!cachedCenterX) handleResize();
        const deltaX = e.clientX - cachedCenterX;
        const deltaY = e.clientY - cachedCenterY;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance > 8) {
          const angle = Math.atan2(deltaX, 400);
          const verticalAngle = Math.max(-0.45, Math.min(0.45, -deltaY / 400));
          targetRotationRef.current = {
            x: verticalAngle,
            y: angle * 1.4,
          };
        }
      }
    };

    const handlePointerUp = (e?: PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      if (e && e.pointerId) {
        try {
          (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
        } catch {}
      }
      setTimeout(() => {
        hasMovedRef.current = false;
      }, 100);
    };

    const handlePointerCancel = () => {
      isDraggingRef.current = false;
      hasMovedRef.current = false;
    };

    const handleCanvasClick = (e: MouseEvent) => {
      if (hasMovedRef.current) {
        e.stopPropagation();
        return;
      }
      targetRotationRef.current.y += Math.PI * 2;
      triggerHaptic(16);
      if (onClick) onClick();
    };

    // Attach pointer listeners to window for fluid drag across elements with touch-action isolation
    const domEl = renderer.domElement;
    domEl.style.touchAction = "none";
    domEl.style.userSelect = "none";
    domEl.style.webkitUserSelect = "none";

    domEl.addEventListener("pointerdown", handlePointerDown);
    domEl.addEventListener("click", handleCanvasClick);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);

    // 6. Intelligent Render Loop (Energy & Battery Saver)
    let animationFrameId: number;
    let isVisible = true;
    let clock = new THREE.Clock();
    let blinkTimer = 0;
    let isBlinking = false;
    let blinkProgress = 0;

    // Pause rendering when tab is hidden
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Pause rendering when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      // Inertia and physics damping when released
      if (!isDraggingRef.current) {
        targetRotationRef.current.y += rotationVelocityRef.current.y;
        targetRotationRef.current.x += rotationVelocityRef.current.x;

        rotationVelocityRef.current.x *= 0.92;
        rotationVelocityRef.current.y *= 0.92;
      }

      // Smooth lerp towards target rotation
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.14;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.14;

      robotRoot.rotation.x = currentRotationRef.current.x;
      robotRoot.rotation.y = currentRotationRef.current.y;

      // Subtle anti-gravity hovering bob
      const hoverOffset = Math.sin(time * 2.6) * 0.06;
      robotRoot.position.y = hoverOffset;
      robotRoot.rotation.z = Math.sin(time * 1.3) * 0.02;

      // Floor shadow breathes with hover height
      const shadowScale = 1 - hoverOffset * 1.2;
      floorShadow.scale.set(shadowScale, shadowScale, 1);
      shadowMat.opacity = 0.5 - hoverOffset * 1.5;

      // Thruster flame dynamic flicker and plasma ring pulse
      const thrusterPulse = 1 + Math.sin(time * 12) * 0.16;
      leftFlame.scale.set(1, thrusterPulse, 1);
      rightFlame.scale.set(1, thrusterPulse, 1);
      leftPlasmaRing.scale.set(thrusterPulse, thrusterPulse, 1);
      rightPlasmaRing.scale.set(thrusterPulse, thrusterPulse, 1);

      // Waving arm animation (idle wave or active waving when streaming/hovered)
      const waveFreq = isStreaming || forceWave || isHovered ? 7 : 1.2;
      const waveAmp = isStreaming || forceWave || isHovered ? 0.35 : 0.08;
      rightArmGroup.rotation.z = Math.sin(time * waveFreq) * waveAmp;

      // Natural eye blink physics
      blinkTimer += delta;
      if (!isBlinking && blinkTimer > 4.2) {
        isBlinking = true;
        blinkProgress = 0;
        blinkTimer = 0;
      }

      if (isBlinking) {
        blinkProgress += delta * 12;
        if (blinkProgress < Math.PI) {
          const eyeScaleY = Math.max(0.08, Math.cos(blinkProgress));
          leftEye.scale.y = eyeScaleY;
          rightEye.scale.y = eyeScaleY;
        } else {
          isBlinking = false;
          leftEye.scale.y = 1;
          rightEye.scale.y = 1;
        }
      }

      // Antenna beacon pulse
      const beaconPulse = 2.4 + Math.sin(time * 3) * 0.8;
      emeraldEmissiveMat.emissiveIntensity = beaconPulse;

      renderer.render(scene, camera);
    };

    animate();

    // Notify parent component that WebGL 3D is active
    if (onReady) onReady();

    // 7. Cleanup & WebGL context disposal
    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
      resizeObserver.disconnect();

      domEl.removeEventListener("pointerdown", handlePointerDown);
      domEl.removeEventListener("click", handleCanvasClick);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);

      if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
        window.removeEventListener("deviceorientation", handleOrientation);
      }

      // Dispose all GPU geometries, materials, and textures
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());

      renderer.dispose();
      if (domEl.parentNode) {
        domEl.parentNode.removeChild(domEl);
      }
    };
  }, [trackCursor, isStreaming, forceWave, isHovered, onClick, onReady]);

  return (
    <div
      ref={mountRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none touch-none flex items-center justify-center overflow-visible"
      style={{ touchAction: "none", userSelect: "none", WebkitUserSelect: "none" }}
      title="Quant Fusion 3D Assistant (Drag to spin 360°)"
    />
  );
}
