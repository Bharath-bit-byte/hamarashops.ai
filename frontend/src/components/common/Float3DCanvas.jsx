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

export default function Float3DCanvas() {
  const containerRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setWebglSupported(false);
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const motionHandler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', motionHandler);

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c0e12, 0.02);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Create 3D floating wireframe Torus Knot meshes
    const torusGeom = new THREE.TorusKnotGeometry(1.2, 0.3, 100, 16);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x3c475a,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const torusMesh1 = new THREE.Mesh(torusGeom, torusMat);
    torusMesh1.position.set(-3, 1, -2);
    scene.add(torusMesh1);

    const torusMesh2 = new THREE.Mesh(torusGeom, torusMat);
    torusMesh2.position.set(3, -2, -3);
    torusMesh2.scale.setScalar(0.7);
    scene.add(torusMesh2);

    // Sparse background particles
    const particleCount = 60;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 15;
      positions[i + 1] = (Math.random() - 0.5) * 15;
      positions[i + 2] = (Math.random() - 0.5) * 10 - 2;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x4cd6ff,
      size: 0.05,
      transparent: true,
      opacity: 0.4,
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMat);
    scene.add(particleSystem);

    // Ambient Lighting
    const pointLight = new THREE.PointLight(0xff6b6b, 1.5, 12);
    pointLight.position.set(-3, 3, 3);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x4cd6ff, 1.5, 12);
    pointLight2.position.set(3, -3, 3);
    scene.add(pointLight2);

    let mouseX = 0;
    let targetX = 0;
    let mouseY = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) / 200;
      mouseY = (e.clientY - window.innerHeight / 2) / 200;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;

    const render = () => {
      if (!mediaQuery.matches) {
        // Rotate meshes
        torusMesh1.rotation.x += 0.002;
        torusMesh1.rotation.y += 0.003;
        torusMesh2.rotation.x -= 0.003;
        torusMesh2.rotation.y += 0.001;

        // Slow float
        torusMesh1.position.y = 1 + Math.sin(Date.now() * 0.0005) * 0.3;
        torusMesh2.position.y = -2 + Math.cos(Date.now() * 0.0006) * 0.2;

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        camera.position.x = targetX;
        camera.position.y = -targetY;
        camera.lookAt(scene.position);
      }

      renderer.render(scene, camera);

      if (!mediaQuery.matches) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (mediaQuery.matches) {
        renderer.render(scene, camera);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', motionHandler);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      torusGeom.dispose();
      torusMat.dispose();
      particleGeometry.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [reducedMotion]);

  if (!webglSupported) {
    return (
      <div className="absolute inset-0 bg-[#0c0e12] opacity-30 pointer-events-none z-0">
        <div className="absolute inset-0 bg-radial-fallback blur-[120px] rounded-full w-[80%] h-[80%] top-[10%] left-[10%]" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none opacity-40"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
