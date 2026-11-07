import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SpaceSceneProps {
  planet: 'MOON' | 'MARS';
  cinematicMode?: boolean;
}

export const SpaceScene: React.FC<SpaceSceneProps> = ({ planet, cinematicMode = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene, Camera, Renderer
    const width = mountRef.current.clientWidth || window.innerWidth;
    const height = mountRef.current.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.001);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 24);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    mountRef.current.appendChild(renderer.domElement);

    // 2. Starfield (3,500 procedurally generated stars)
    const starCount = 3500;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const starColorPalette = [
      new THREE.Color(0xffffff), // White
      new THREE.Color(0x93c5fd), // Blue-white
      new THREE.Color(0xfde047), // Yellow-white
      new THREE.Color(0xfca5a5), // Reddish
    ];

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      starPositions[idx] = (Math.random() - 0.5) * 600;
      starPositions[idx + 1] = (Math.random() - 0.5) * 600;
      starPositions[idx + 2] = (Math.random() - 0.5) * 600;

      const col = starColorPalette[Math.floor(Math.random() * starColorPalette.length)];
      starColors[idx] = col.r;
      starColors[idx + 1] = col.g;
      starColors[idx + 2] = col.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 3. Main Celestial Body (Moon or Mars)
    const planetGeometry = new THREE.SphereGeometry(7, 64, 64);
    let planetMaterial: THREE.MeshStandardMaterial;

    // Procedural canvas textures for Moon & Mars so no network asset loads can ever fail
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    if (planet === 'MOON') {
      // Procedural Lunar surface texture (craters, mare basalt basins)
      ctx.fillStyle = '#64748b';
      ctx.fillRect(0, 0, 1024, 512);

      // Dark basalt maria
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.ellipse(350, 220, 180, 110, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(650, 280, 140, 90, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Impact crater dots
      for (let i = 0; i < 400; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const r = Math.random() * 8 + 1;
        ctx.fillStyle = Math.random() > 0.4 ? '#94a3b8' : '#1e293b';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      const texture = new THREE.CanvasTexture(canvas);
      planetMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.9,
        metalness: 0.1,
      });
    } else {
      // Procedural Mars surface (rust red hematite, dark valleys, white polar caps)
      ctx.fillStyle = '#c2410c';
      ctx.fillRect(0, 0, 1024, 512);

      // Dark volcanic regions (Syrtis Major)
      ctx.fillStyle = '#7c2d12';
      ctx.beginPath();
      ctx.ellipse(450, 240, 200, 100, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Northern and southern ice caps
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.ellipse(512, 20, 260, 25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(512, 495, 200, 20, 0, 0, Math.PI * 2);
      ctx.fill();

      // Surface dust storms and features
      for (let i = 0; i < 250; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(x, y, Math.random() * 30 + 10, Math.random() * 10 + 2);
      }

      const texture = new THREE.CanvasTexture(canvas);
      planetMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.85,
        metalness: 0.15,
      });
    }

    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    planetMesh.position.set(0, -1, 0);
    scene.add(planetMesh);

    // 4. Earth in the background (distant sphere)
    const earthGeometry = new THREE.SphereGeometry(3, 32, 32);
    const earthCanvas = document.createElement('canvas');
    earthCanvas.width = 512;
    earthCanvas.height = 256;
    const eCtx = earthCanvas.getContext('2d')!;
    eCtx.fillStyle = '#0284c7'; // Oceans
    eCtx.fillRect(0, 0, 512, 256);
    eCtx.fillStyle = '#16a34a'; // Continents
    eCtx.beginPath();
    eCtx.ellipse(180, 120, 70, 45, 0.3, 0, Math.PI * 2);
    eCtx.fill();
    eCtx.beginPath();
    eCtx.ellipse(360, 140, 80, 50, -0.2, 0, Math.PI * 2);
    eCtx.fill();
    // Swirling white clouds
    eCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let c = 0; c < 20; c++) {
      eCtx.beginPath();
      eCtx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 35 + 10, 0, Math.PI * 2);
      eCtx.fill();
    }

    const earthTexture = new THREE.CanvasTexture(earthCanvas);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.6,
      metalness: 0.1,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMesh.position.set(planet === 'MOON' ? 35 : 45, 12, -45);
    scene.add(earthMesh);

    // 5. Spacecraft / Satellite in Orbit
    const shipGroup = new THREE.Group();
    // Capsule
    const podGeo = new THREE.ConeGeometry(0.5, 1.2, 8);
    const podMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.2 });
    const pod = new THREE.Mesh(podGeo, podMat);
    pod.rotation.x = Math.PI / 2;
    shipGroup.add(pod);

    // Solar Wings
    const wingGeo = new THREE.BoxGeometry(2.4, 0.05, 0.6);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5, roughness: 0.3 });
    const wings = new THREE.Mesh(wingGeo, wingMat);
    shipGroup.add(wings);

    scene.add(shipGroup);

    // 6. Lighting
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(30, 20, 20);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x1e293b, 0.4);
    scene.add(ambientLight);

    // 7. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slowly rotate planets
      planetMesh.rotation.y = elapsedTime * 0.03;
      earthMesh.rotation.y = elapsedTime * 0.015;

      // Orbit spacecraft
      const orbitRadius = 10.5;
      const orbitSpeed = elapsedTime * 0.4;
      shipGroup.position.x = Math.cos(orbitSpeed) * orbitRadius;
      shipGroup.position.z = Math.sin(orbitSpeed) * orbitRadius;
      shipGroup.position.y = Math.sin(orbitSpeed * 2) * 1.5;
      shipGroup.rotation.y = -orbitSpeed - Math.PI / 2;

      // Slight camera drift for cinematic feeling
      if (cinematicMode) {
        camera.position.x = Math.sin(elapsedTime * 0.1) * 3;
        camera.position.y = 5 + Math.cos(elapsedTime * 0.08) * 1.5;
        camera.lookAt(planetMesh.position);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [planet, cinematicMode]);

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden" />;
};

