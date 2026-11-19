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

    // Volumetric Helmet Shell (Spherical Rounded Capsule)
    const helmetGeom = trackGeom(new THREE.SphereGeometry(0.72, 32, 24));
    helmetGeom.scale(1.16, 0.9, 0.96);
    const helmetMesh = new THREE.Mesh(helmetGeom, titaniumMat);
    headGroup.add(helmetMesh);

    // Visor Outer Bezel Ring (Front, +Z)
    const visorBezelGeom = trackGeom(new THREE.TorusGeometry(0.46, 0.055, 16, 32));
    visorBezelGeom.scale(1.18, 0.72, 1);
    const visorBezelMesh = new THREE.Mesh(visorBezelGeom, bezelMat);
    visorBezelMesh.position.set(0, 0.02, 0.62);
    headGroup.add(visorBezelMesh);

    // Convex Visor Glass Dome
    const visorDomeGeom = trackGeom(new THREE.SphereGeometry(0.48, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.48));
    visorDomeGeom.scale(1.14, 0.68, 0.75);
    const visorDomeMesh = new THREE.Mesh(visorDomeGeom, visorGlassMat);
    visorDomeMesh.rotation.x = Math.PI / 2;
    visorDomeMesh.position.set(0, 0.02, 0.38);
    headGroup.add(visorDomeMesh);

    // Holographic Digital LED Eyes (Vibrantly Recessed with Specular Pupils)
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(0, 0.03, 0.61);
    headGroup.add(eyeGroup);

    const eyeGeom = trackGeom(new THREE.CapsuleGeometry(0.09, 0.11, 8, 16));
    const leftEye = new THREE.Mesh(eyeGeom, emeraldEmissiveMat);
    leftEye.position.set(-0.24, 0, 0);
    eyeGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeom, emeraldEmissiveMat);
    rightEye.position.set(0.24, 0, 0);
    eyeGroup.add(rightEye);

    // Specular White Pupils
    const pupilGeom = trackGeom(new THREE.SphereGeometry(0.032, 10, 10));
    const leftPupil = new THREE.Mesh(pupilGeom, pupilMat);
    leftPupil.position.set(-0.21, 0.05, 0.08);
    eyeGroup.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeom, pupilMat);
    rightPupil.position.set(0.27, 0.05, 0.08);
    eyeGroup.add(rightPupil);

    // LED Smile Line
    const smileGeom = trackGeom(new THREE.TorusGeometry(0.15, 0.024, 8, 20, Math.PI * 0.75));
    const smileMesh = new THREE.Mesh(smileGeom, emeraldEmissiveMat);
    smileMesh.position.set(0, -0.15, 0.61);
    smileMesh.rotation.z = Math.PI * 1.125;
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
    const antennaBaseGeom = trackGeom(new THREE.CylinderGeometry(0.08, 0.11, 0.08, 16));
    const antennaBase = new THREE.Mesh(antennaBaseGeom, chromeMat);
    antennaBase.position.set(0, 0.68, 0);
    headGroup.add(antennaBase);

    // Chrome Stem
    const stemGeom = trackGeom(new THREE.CylinderGeometry(0.018, 0.024, 0.38, 12));
    const stem = new THREE.Mesh(stemGeom, chromeMat);
    stem.position.set(0, 0.88, 0);
    headGroup.add(stem);

    // Glowing Emerald Beacon Tip
    const beaconGeom = trackGeom(new THREE.SphereGeometry(0.12, 20, 16));
    const beacon = new THREE.Mesh(beaconGeom, emeraldEmissiveMat);
    beacon.position.set(0, 1.1, 0);
    headGroup.add(beacon);

    // ================= 3D CYLINDRICAL EAR DIALS =================
    const earGeom = trackGeom(new THREE.CylinderGeometry(0.18, 0.18, 0.16, 20));

    // Left Ear
    const leftEar = new THREE.Mesh(earGeom, titaniumMat);
    leftEar.rotation.z = Math.PI / 2;
    leftEar.position.set(-0.84, 0, 0);
    headGroup.add(leftEar);

    const leftEarCap = new THREE.Mesh(trackGeom(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 20)), chromeMat);
    leftEarCap.rotation.z = Math.PI / 2;
    leftEarCap.position.set(-0.93, 0, 0);
    headGroup.add(leftEarCap);

    // Right Ear
    const rightEar = new THREE.Mesh(earGeom, titaniumMat);
    rightEar.rotation.z = Math.PI / 2;
    rightEar.position.set(0.84, 0, 0);
    headGroup.add(rightEar);

    const rightEarCap = new THREE.Mesh(trackGeom(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 20)), chromeMat);
    rightEarCap.rotation.z = Math.PI / 2;
    rightEarCap.position.set(0.93, 0, 0);
    headGroup.add(rightEarCap);

    // ================= NECK JOINT =================
    const neckGeom = trackGeom(new THREE.CylinderGeometry(0.24, 0.24, 0.14, 16));
    const neck = new THREE.Mesh(neckGeom, bezelMat);
    neck.position.set(0, 0.05, 0);
    robotRoot.add(neck);

    // ================= TORSO =================
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, -0.48, 0);
    robotRoot.add(torsoGroup);

    // Torso Capsule
    const torsoGeom = trackGeom(new THREE.SphereGeometry(0.66, 32, 24));
    torsoGeom.scale(1.08, 0.92, 0.88);
    const torsoMesh = new THREE.Mesh(torsoGeom, titaniumMat);
    torsoGroup.add(torsoMesh);

    // Recessed Chest Telemetry Console (Front, +Z)
    const chestConsoleGeom = trackGeom(new THREE.BoxGeometry(0.62, 0.36, 0.06));
    const chestConsole = new THREE.Mesh(chestConsoleGeom, bezelMat);
    chestConsole.position.set(0, 0.04, 0.56);
    torsoGroup.add(chestConsole);

    // Chest Status Bars
    const barGeom = trackGeom(new THREE.BoxGeometry(0.24, 0.04, 0.02));
    const greenBar = new THREE.Mesh(barGeom, emeraldEmissiveMat);
    greenBar.position.set(-0.12, 0.1, 0.6);
    torsoGroup.add(greenBar);

    const emeraldBar = new THREE.Mesh(trackGeom(new THREE.BoxGeometry(0.38, 0.04, 0.02)), emeraldPlasmaMat);
    emeraldBar.position.set(-0.05, 0.02, 0.6);
    torsoGroup.add(emeraldBar);

    // Live Heartbeat Waveform Indicator
    const waveDotGeom = trackGeom(new THREE.SphereGeometry(0.045, 12, 12));
    const waveDot = new THREE.Mesh(waveDotGeom, emeraldEmissiveMat);
    waveDot.position.set(0.2, 0.1, 0.6);
    torsoGroup.add(waveDot);

    // ================= BACK OF TORSO (-Z): CYBERNETIC POWER CELL =================
    const powerCellGeom = trackGeom(new THREE.CylinderGeometry(0.24, 0.24, 0.52, 20));
    const powerCell = new THREE.Mesh(powerCellGeom, titaniumMat);
    powerCell.position.set(0, 0.02, -0.54);
    torsoGroup.add(powerCell);

    // Power Cell Chrome Caps
    const topCap = new THREE.Mesh(trackGeom(new THREE.CylinderGeometry(0.26, 0.26, 0.06, 20)), chromeMat);
    topCap.position.set(0, 0.28, -0.54);
    torsoGroup.add(topCap);

    const btmCap = new THREE.Mesh(trackGeom(new THREE.CylinderGeometry(0.26, 0.26, 0.06, 20)), chromeMat);
    btmCap.position.set(0, -0.24, -0.54);
    torsoGroup.add(btmCap);

    // Glowing Power Core Level Bar
    const powerLevelGeom = trackGeom(new THREE.BoxGeometry(0.05, 0.38, 0.03));
    const powerLevel = new THREE.Mesh(powerLevelGeom, emeraldEmissiveMat);
    powerLevel.position.set(0, 0.02, -0.67);
    torsoGroup.add(powerLevel);

    // ================= ARMS & SHOULDERS =================
    const shoulderGeom = trackGeom(new THREE.SphereGeometry(0.13, 16, 16));

    // Left Arm
    const leftShoulder = new THREE.Mesh(shoulderGeom, chromeMat);
    leftShoulder.position.set(-0.76, 0.18, 0);
    torsoGroup.add(leftShoulder);

    const leftArmGeom = trackGeom(new THREE.CylinderGeometry(0.065, 0.065, 0.42, 12));
    const leftArm = new THREE.Mesh(leftArmGeom, titaniumMat);
    leftArm.position.set(-0.84, -0.06, 0.06);
    leftArm.rotation.z = 0.32;
    torsoGroup.add(leftArm);

    const leftHand = new THREE.Mesh(shoulderGeom, chromeMat);
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

    const rightHand = new THREE.Mesh(shoulderGeom, emeraldEmissiveMat);
    rightHand.position.set(0.24, 0.28, 0.14);
    rightArmGroup.add(rightHand);

    // ================= HOVER THRUSTERS & PLASMA =================
    const thrusterBellGeom = trackGeom(new THREE.CylinderGeometry(0.11, 0.16, 0.16, 16, 1, true));

    // Left Thruster Nozzle
    const leftNozzle = new THREE.Mesh(thrusterBellGeom, chromeMat);
    leftNozzle.position.set(-0.3, -0.58, 0);
    torsoGroup.add(leftNozzle);

    // Right Thruster Nozzle
    const rightNozzle = new THREE.Mesh(thrusterBellGeom, chromeMat);
    rightNozzle.position.set(0.3, -0.58, 0);
    torsoGroup.add(rightNozzle);

    // Plasma Exhaust Flames (British Racing Emerald / Mint Plasma)
    const flameGeom = trackGeom(new THREE.ConeGeometry(0.12, 0.32, 16));
    const leftFlame = new THREE.Mesh(flameGeom, emeraldPlasmaMat);
    leftFlame.position.set(-0.3, -0.78, 0);
    leftFlame.rotation.x = Math.PI;
    torsoGroup.add(leftFlame);

    const rightFlame = new THREE.Mesh(flameGeom, emeraldPlasmaMat);
    rightFlame.position.set(0.3, -0.78, 0);
    rightFlame.rotation.x = Math.PI;
    torsoGroup.add(rightFlame);

    // White Core Jet
    const coreFlameGeom = trackGeom(new THREE.ConeGeometry(0.06, 0.2, 12));
    const leftCore = new THREE.Mesh(coreFlameGeom, whiteCorePlasmaMat);
    leftCore.position.set(-0.3, -0.72, 0);
    leftCore.rotation.x = Math.PI;
    torsoGroup.add(leftCore);

    const rightCore = new THREE.Mesh(coreFlameGeom, whiteCorePlasmaMat);
    rightCore.position.set(0.3, -0.72, 0);
    rightCore.rotation.x = Math.PI;
    torsoGroup.add(rightCore);

    // ================= SOFT CONTACT FLOOR SHADOW =================
    // Procedural dynamic radial gradient shadow texture
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext("2d");
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(2, 6, 23, 0.65)");
      grad.addColorStop(0.35, "rgba(2, 6, 23, 0.35)");
      grad.addColorStop(0.7, "rgba(2, 6, 23, 0.12)");
      grad.addColorStop(1, "rgba(2, 6, 23, 0)");
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
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

    // 5. Interactive Cursor & Drag Orbit Physics
    const handlePointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      hasMovedRef.current = false;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      rotationVelocityRef.current = { x: 0, y: 0 };
      (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isDraggingRef.current) {
        const deltaX = e.clientX - lastMousePosRef.current.x;
        const deltaY = e.clientY - lastMousePosRef.current.y;

        if (Math.hypot(e.clientX - dragStartRef.current.x, e.clientY - dragStartRef.current.y) > 4) {
          hasMovedRef.current = true;
        }

        targetRotationRef.current.y += deltaX * 0.022;
        targetRotationRef.current.x = Math.max(
          -0.55,
          Math.min(0.55, targetRotationRef.current.x + deltaY * 0.016)
        );

        rotationVelocityRef.current = {
          x: deltaY * 0.012,
          y: deltaX * 0.016,
        };

        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      } else if (trackCursor) {
        // Continuous 360° Circular Gaze Tracking across viewport
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance > 10) {
          // Circular angle around the mascot (-PI to PI)
          const angle = Math.atan2(deltaX, 400);
          const verticalAngle = Math.max(-0.45, Math.min(0.45, -deltaY / 400));
          targetRotationRef.current = {
            x: verticalAngle,
            y: angle * 1.4,
          };
        }
      }
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      if (!hasMovedRef.current) {
        targetRotationRef.current.y += Math.PI * 2;
        if (onClick) onClick();
      }
    };

    const handleCanvasClick = (e: MouseEvent) => {
      e.stopPropagation();
      if (!hasMovedRef.current) {
        targetRotationRef.current.y += Math.PI * 2;
        if (onClick) onClick();
      }
    };

    // Attach pointer listeners to window for fluid drag across elements
    const domEl = renderer.domElement;
    domEl.addEventListener("pointerdown", handlePointerDown);
    domEl.addEventListener("click", handleCanvasClick);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp);

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

      // Thruster flame dynamic flicker
      const thrusterPulse = 1 + Math.sin(time * 12) * 0.18;
      leftFlame.scale.set(1, thrusterPulse, 1);
      rightFlame.scale.set(1, thrusterPulse, 1);

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

      domEl.removeEventListener("pointerdown", handlePointerDown);
      domEl.removeEventListener("click", handleCanvasClick);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

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

  // Click handler (preserves click vs drag distinction)
  const handleClick = () => {
    if (hasMovedRef.current) return;
    // Perform celebratory 360° spin flip
    targetRotationRef.current.y += Math.PI * 2;
    if (onClick) onClick();
  };

  return (
    <div
      ref={mountRef}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none flex items-center justify-center overflow-visible"
      title="Quant Fusion 3D Assistant (Drag to spin 360°)"
    />
  );
}
