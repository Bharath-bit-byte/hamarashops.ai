import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Helper to detect WebGL availability
const isWebGLAvailable = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
};

export default function Hero3DCanvas() {
  const containerRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // 1. Check WebGL support
    if (!isWebGLAvailable()) {
      setWebglSupported(false);
      return;
    }

    // 2. Check Reduced Motion settings
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const motionHandler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', motionHandler);

    // 3. Initialize Scene Variables
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c0e12, 0.015);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 4. Create Core 3D Neural Mesh (Wireframe Dodecahedron)
    const coreGeometry = new THREE.IcosahedronGeometry(2, 1);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x3c475a,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // Create glowing neural vertices
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0xff6b6b,
      size: 0.15,
      transparent: true,
      opacity: 0.8,
    });
    const corePoints = new THREE.Points(coreGeometry, pointsMaterial);
    coreMesh.add(corePoints);

    // 5. Create Floating Particle Cloud
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const brandColors = [
      new THREE.Color(0xff6b6b), // Coral-red
      new THREE.Color(0x4cd6ff), // Cyan-blue
      new THREE.Color(0x3c475a), // Deep slate
    ];

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Distribute randomly in a sphere
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 3 + Math.random() * 5; // Radius between 3 and 8

      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);

      // Random brand color selection
      const color = brandColors[Math.floor(Math.random() * brandColors.length)];
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 6. Restrained Ambient & Directional point lighting
    const lightCoral = new THREE.PointLight(0xff6b6b, 2.5, 15);
    lightCoral.position.set(-4, 3, 2);
    scene.add(lightCoral);

    const lightCyan = new THREE.PointLight(0x4cd6ff, 2.5, 15);
    lightCyan.position.set(4, -3, 2);
    scene.add(lightCyan);

    // 7. Interactive Cursor Tracking variables
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) / 100;
      mouseY = (e.clientY - window.innerHeight / 2) / 100;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 8. Animation/Render loop
    let animationFrameId;

    const render = () => {
      if (!mediaQuery.matches) {
        // Smooth Cursor inertia tracking
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        // Apply spatial rotations
        coreMesh.rotation.y += 0.003;
        coreMesh.rotation.x += 0.001;

        particleSystem.rotation.y -= 0.001;
        particleSystem.rotation.x = targetY * 0.15;
        particleSystem.rotation.y += targetX * 0.15;

        // Subtle core floating movement
        coreMesh.position.y = Math.sin(Date.now() * 0.001) * 0.15;
      }

      renderer.render(scene, camera);

      if (!mediaQuery.matches) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Trigger initial frame render
    render();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (mediaQuery.matches) {
        renderer.render(scene, camera); // redraw single static frame on resize
      }
    };

    window.addEventListener('resize', handleResize);

    // 10. Clean-up lifecycle hook
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', motionHandler);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      coreGeometry.dispose();
      coreMaterial.dispose();
      pointsMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, [reducedMotion]);

  // Render CSS radial gradient fallback if WebGL is unsupported
  if (!webglSupported) {
    return (
      <div className="absolute inset-0 bg-[#0c0e12] z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-radial-fallback opacity-40 blur-[130px] rounded-full w-[80%] h-[80%] top-[10%] left-[10%]" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
