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

export default function Pipeline3DCanvas() {
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

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Node Definition Setup
    const nodesData = [
      { name: 'Channel', x: -4, color: 0xff6b6b },
      { name: 'AI Agent', x: -2, color: 0x4cd6ff },
      { name: 'Search', x: 0, color: 0xffb3b0 },
      { name: 'AI Model', x: 2, color: 0xff6b6b },
      { name: 'Business System', x: 4, color: 0x4cd6ff },
    ];

    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);

    const sphereGeom = new THREE.SphereGeometry(0.35, 32, 32);
    const ringGeom = new THREE.RingGeometry(0.45, 0.48, 32);

    const nodes = [];
    const rings = [];

    // Build 3D Nodes & Orbiting Rings
    nodesData.forEach((data) => {
      const nodeMat = new THREE.MeshBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.9,
      });
      const nodeMesh = new THREE.Mesh(sphereGeom, nodeMat);
      nodeMesh.position.set(data.x, 0, 0);
      nodeGroup.add(nodeMesh);
      nodes.push(nodeMesh);

      // Orbital tech ring
      const ringMat = new THREE.MeshBasicMaterial({
        color: data.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.position.set(data.x, 0, 0);
      ringMesh.rotation.x = Math.PI / 3;
      nodeGroup.add(ringMesh);
      rings.push(ringMesh);
    });

    // Create Connection Path Lines
    const connectionsMat = new THREE.LineBasicMaterial({
      color: 0x3c475a,
      transparent: true,
      opacity: 0.4,
    });

    const pathPoints = [];
    for (let i = 0; i < nodesData.length - 1; i++) {
      const start = new THREE.Vector3(nodesData[i].x, 0, 0);
      const end = new THREE.Vector3(nodesData[i + 1].x, 0, 0);
      const lineGeom = new THREE.BufferGeometry().setFromPoints([start, end]);
      const connectionLine = new THREE.Line(lineGeom, connectionsMat);
      scene.add(connectionLine);
    }

    // 3D Laser/Energy Pulse geometry
    const pulseGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
    });
    const pulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
    scene.add(pulseMesh);

    let pulseProgress = 0;

    // Interactive Cursor Tilting
    let mouseX = 0;
    let targetX = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      mouseX = (x / rect.width) * 2 - 1; // range -1 to 1
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Ambient Point Lights
    const light = new THREE.PointLight(0xff6b6b, 2, 10);
    light.position.set(-2, 2, 2);
    scene.add(light);

    const light2 = new THREE.PointLight(0x4cd6ff, 2, 10);
    light2.position.set(2, -2, 2);
    scene.add(light2);

    let animationFrameId;

    const render = () => {
      if (!mediaQuery.matches) {
        // Rotate outer technical rings
        rings.forEach((ring, idx) => {
          ring.rotation.z += 0.01 * (idx % 2 === 0 ? 1 : -1);
        });

        // Pulsing node glow scales
        nodes.forEach((node, idx) => {
          node.scale.setScalar(1 + Math.sin(Date.now() * 0.003 + idx) * 0.08);
        });

        // Animate Laser Energy Pulse along pipeline
        pulseProgress += 0.008;
        if (pulseProgress > 1) {
          pulseProgress = 0;
        }

        // Interpolate horizontal position
        const startX = nodesData[0].x;
        const endX = nodesData[nodesData.length - 1].x;
        pulseMesh.position.x = startX + (endX - startX) * pulseProgress;
        pulseMesh.position.y = Math.sin(pulseProgress * Math.PI * 4) * 0.15; // wave motion

        // Smooth spatial tilt on mouse coordinate
        targetX += (mouseX - targetX) * 0.08;
        nodeGroup.rotation.y = targetX * 0.35;
        nodeGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.08; // auto pitch
      } else {
        // Draw static frame for reduced motion
        pulseMesh.position.x = 0;
        pulseMesh.position.y = 0;
      }

      renderer.render(scene, camera);

      if (!mediaQuery.matches) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 280;
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
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', motionHandler);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sphereGeom.dispose();
      ringGeom.dispose();
      pulseGeom.dispose();
      pulseMat.dispose();
      connectionsMat.dispose();
      renderer.dispose();
    };
  }, [reducedMotion]);

  if (!webglSupported) {
    return (
      <div className="w-full flex items-center justify-between p-4 bg-[#0a1628]/40 border border-[#3c475a]/50 rounded-2xl font-mono text-[10px] text-slate-300">
        <div>Channel</div>
        <div className="text-[#ff6b6b]">➔</div>
        <div>AI Agent</div>
        <div className="text-[#4cd6ff]">➔</div>
        <div>Search & Vector</div>
        <div className="text-[#ff6b6b]">➔</div>
        <div>AI Model</div>
        <div className="text-[#4cd6ff]">➔</div>
        <div>Business System</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-[280px] relative overflow-hidden pointer-events-auto"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
