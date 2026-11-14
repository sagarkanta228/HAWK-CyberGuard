'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Converts latitude & longitude degrees to 3D Cartesian coordinates on sphere
function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Global Cyber Defense Hubs covering all continents
const GLOBAL_HUBS = [
  { name: 'North America', lat: 37.77, lon: -122.41, color: 0x2454ff }, // Silicon Valley
  { name: 'US East', lat: 38.9, lon: -77.03, color: 0x2454ff },        // Washington DC
  { name: 'Europe', lat: 50.11, lon: 8.68, color: 0x7c3aed },          // Frankfurt
  { name: 'UK', lat: 51.5, lon: -0.12, color: 0x7c3aed },              // London
  { name: 'India', lat: 12.97, lon: 77.59, color: 0x06b6d4 },          // Bengaluru
  { name: 'East Asia', lat: 35.67, lon: 139.65, color: 0x10b981 },     // Tokyo
  { name: 'SE Asia', lat: 1.35, lon: 103.82, color: 0x10b981 },        // Singapore
  { name: 'Australia', lat: -33.86, lon: 151.2, color: 0xf59e0b },     // Sydney
  { name: 'South America', lat: -23.55, lon: -46.63, color: 0xec4899 }, // São Paulo
  { name: 'Africa', lat: -1.29, lon: 36.82, color: 0x8b5cf6 },         // Nairobi
];

// Arcs connecting all continents in a global neural defense mesh
const DEFENSE_LINKS = [
  [0, 1], // US West - US East
  [1, 3], // US East - London
  [3, 2], // London - Frankfurt
  [2, 4], // Frankfurt - India
  [4, 6], // India - Singapore
  [6, 5], // Singapore - Tokyo
  [5, 0], // Tokyo - US West (Transpacific)
  [6, 7], // Singapore - Sydney
  [1, 8], // US East - São Paulo
  [2, 9], // Frankfurt - Nairobi
  [4, 9], // India - Nairobi
];

export default function RealEarth3D({
  className = '',
  scale = 1,
  cameraDistance = 2.45,
  autoRotate = true,
  autoRotateSpeed = 0.22,
  interactive = true,
  scrollRef, // Ref holding live scroll progress { progress: 0..1 }
  onLoaded,
  lightPreset = 'daylight',
}) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const stateRef = useRef({
    camera: null,
    renderer: null,
    scene: null,
    earthGroup: null,
    earthMesh: null,
    cloudsMesh: null,
    cyberGroup: null,
    cyberMat: null,
    arcLines: [],
    mixer: null,
    scaleTarget: scale,
    camDistTarget: cameraDistance,
    isDragging: false,
    prevX: 0,
    prevY: 0,
    velX: 0,
    velY: 0,
    userRotX: 0,
    userRotY: 0,
    reqId: null,
  });

  useEffect(() => {
    stateRef.current.scaleTarget = scale;
    stateRef.current.camDistTarget = cameraDistance;
  }, [scale, cameraDistance]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return;

    let destroyed = false;
    const st = stateRef.current;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    st.scene = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, cameraDistance);
    st.camera = camera;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = lightPreset === 'daylight' ? 1.25 : 1.05;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);
      st.renderer = renderer;
    } catch (e) {
      console.warn('WebGL init failed:', e);
      setLoadError(true);
      setLoading(false);
      return;
    }

    const earthGroup = new THREE.Group();
    scene.add(earthGroup);
    st.earthGroup = earthGroup;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffef7, 2.4);
    sunLight.position.set(6, 3.5, 5);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x6ca5ff, 1.6);
    rimLight.position.set(-6, -2, -4);
    scene.add(rimLight);

    // Atmospheric Glow Halo Mesh
    const atmosGeo = new THREE.SphereGeometry(1.025, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        glowColor: { value: new THREE.Color(0x2d6eff) },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 glowColor;
        void main() {
          float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.4);
          gl_FragColor = vec4(glowColor, intensity * 0.48);
        }
      `,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    earthGroup.add(atmosMesh);

    // -------------------------------------------------------------
    // Inner Cyber Defense Core: Shows ALL Continents & Cyber Arcs From Inside
    // -------------------------------------------------------------
    const cyberGroup = new THREE.Group();
    cyberGroup.visible = false;
    earthGroup.add(cyberGroup);
    st.cyberGroup = cyberGroup;

    // 1. Inner luminous holographic graticule sphere
    const cyberGeo = new THREE.SphereGeometry(0.985, 36, 20);
    const cyberMat = new THREE.MeshBasicMaterial({
      color: 0x2454ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const cyberMesh = new THREE.Mesh(cyberGeo, cyberMat);
    cyberGroup.add(cyberMesh);
    st.cyberMat = cyberMat;

    // 2. Continental Cyber Hubs (Pins & Pulsing Rings)
    const hubPoints = GLOBAL_HUBS.map((hub) => {
      const pos = latLonToVector3(hub.lat, hub.lon, 0.995);

      // Glowing core beacon dot
      const dotGeo = new THREE.SphereGeometry(0.022, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({
        color: hub.color,
        transparent: true,
        opacity: 0.95,
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(pos);
      cyberGroup.add(dot);

      // Radar ping ring
      const ringGeo = new THREE.RingGeometry(0.025, 0.045, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: hub.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      cyberGroup.add(ring);

      return pos;
    });

    // 3. Curved 3D Arcs connecting continents across the globe
    const arcLines = [];
    DEFENSE_LINKS.forEach(([i1, i2]) => {
      const p1 = hubPoints[i1];
      const p2 = hubPoints[i2];
      if (!p1 || !p2) return;

      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      const dist = p1.distanceTo(p2);
      mid.normalize().multiplyScalar(0.995 + Math.min(0.28, dist * 0.18));

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const curvePts = curve.getPoints(36);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePts);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      cyberGroup.add(line);
      arcLines.push(line);
    });
    st.arcLines = arcLines;

    // -------------------------------------------------------------
    // Load earth.glb Model
    // -------------------------------------------------------------
    const loader = new GLTFLoader();
    loader.load(
      '/models/earth.glb',
      (gltf) => {
        if (destroyed) return;
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const sphere = box.getBoundingSphere(new THREE.Sphere());
        const normFactor = 1.0 / (sphere.radius || 10);

        model.scale.setScalar(normFactor);
        model.position.sub(sphere.center.multiplyScalar(normFactor));

        model.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.transparent = true;
            child.material.depthWrite = true;

            if (
              child.name.toLowerCase().includes('cloud') ||
              (child.material.name &&
                child.material.name.toLowerCase().includes('cloud'))
            ) {
              child.material.opacity = 0.76;
              child.material.depthWrite = false;
              st.cloudsMesh = child;
            } else {
              st.earthMesh = child;
              child.material.side = THREE.DoubleSide; // Allows viewing continents from inside!
            }
          }
        });

        earthGroup.add(model);

        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.timeScale = 0.85;
            action.play();
          });
          st.mixer = mixer;
        }

        setLoading(false);
        if (onLoaded) onLoaded();
      },
      undefined,
      (err) => {
        console.warn('Failed to load earth.glb:', err);
        if (!destroyed) {
          setLoadError(true);
          setLoading(false);
        }
      }
    );

    // Interaction Handlers (drag to spin)
    const onPointerDown = (e) => {
      if (!interactive) return;
      const p = scrollRef?.current?.progress || 0;
      if (p > 0.15) return; // Only allow drag when at resting top position
      st.isDragging = true;
      st.prevX = e.clientX;
      st.prevY = e.clientY;
      st.velX = 0;
      st.velY = 0;
    };

    const onPointerMove = (e) => {
      if (!st.isDragging) return;
      const dx = e.clientX - st.prevX;
      const dy = e.clientY - st.prevY;
      st.prevX = e.clientX;
      st.prevY = e.clientY;

      st.velX = dx * 0.005;
      st.velY = dy * 0.005;

      st.userRotY += st.velX;
      st.userRotX = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, st.userRotX + st.velY)
      );
    };

    const onPointerUp = () => {
      st.isDragging = false;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0 && st.renderer && st.camera) {
          st.camera.aspect = w / h;
          st.camera.updateProjectionMatrix();
          st.renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // Render loop
    const clock = new THREE.Clock();

    const animate = () => {
      if (destroyed) return;
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (st.mixer) st.mixer.update(delta);

      // Read live scroll progress from ref with zero React overhead
      const p = scrollRef?.current?.progress ?? 0;

      if (st.earthGroup) {
        // 1. Dynamic Continental Orbit Sweep:
        // As p goes 0 -> 1, the Earth rotates smoothly by 2.8 * Math.PI (~500°),
        // sweeping EVERY continent past the viewer: Americas -> Europe -> Africa -> India -> Asia -> Australia!
        const scrollSweepY = p * Math.PI * 2.8;
        const autoSpin = autoRotate && !st.isDragging ? elapsed * autoRotateSpeed : 0;
        st.earthGroup.rotation.y = st.userRotY + autoSpin + scrollSweepY;
        st.earthGroup.rotation.x = st.userRotX;

        if (st.cloudsMesh) {
          st.cloudsMesh.rotation.y += delta * 0.08;
        }

        // Inertia damping when user releases drag
        if (!st.isDragging) {
          st.velX *= 0.93;
          st.velY *= 0.93;
          if (Math.abs(st.velX) > 0.0001) st.userRotY += st.velX;
          if (Math.abs(st.velY) > 0.0001) {
            st.userRotX = Math.max(
              -Math.PI / 3,
              Math.min(Math.PI / 3, st.userRotX + st.velY)
            );
          }
        }

        // 2. Camera zoom distance during scroll:
        // Approaching from 2.45 down to 1.12 to view continent details closely
        if (st.camera) {
          const targetCamZ = THREE.MathUtils.lerp(
            st.camDistTarget,
            1.12,
            Math.min(1, p / 0.85)
          );
          st.camera.position.z = THREE.MathUtils.lerp(
            st.camera.position.z,
            targetCamZ,
            0.12
          );
        }

        // 3. Inner Cyber Holographic Transition ("andar se saara continent dikhe")
        // As p reaches 0.35, the outer Earth becomes translucent, revealing the glowing
        // inner defense grid and all 7 continents simultaneously from inside!
        if (st.earthMesh && st.earthMesh.material) {
          if (p < 0.28) {
            st.earthMesh.material.opacity = 1.0;
          } else if (p < 0.72) {
            const t = (p - 0.28) / 0.44;
            // Smoothly becomes holographic translucent (1.0 -> 0.48)
            st.earthMesh.material.opacity = THREE.MathUtils.lerp(1.0, 0.48, t);
          } else {
            const t = (p - 0.72) / 0.28;
            // Plunge through core: 0.48 -> 0.08
            st.earthMesh.material.opacity = THREE.MathUtils.lerp(0.48, 0.08, t);
          }
        }

        if (st.cloudsMesh && st.cloudsMesh.material) {
          if (p > 0.45) {
            const t = (p - 0.45) / 0.4;
            st.cloudsMesh.material.opacity = THREE.MathUtils.lerp(0.76, 0.15, t);
          } else {
            st.cloudsMesh.material.opacity = 0.76;
          }
        }

        // 4. Reveal & Pulse Inner Cyber Core
        if (st.cyberGroup) {
          if (p < 0.22) {
            st.cyberGroup.visible = false;
          } else {
            st.cyberGroup.visible = true;
            const cyberAlpha = THREE.MathUtils.lerp(
              0.2,
              0.85,
              Math.min(1, (p - 0.22) / 0.4)
            );
            if (st.cyberMat) st.cyberMat.opacity = cyberAlpha;

            // Pulse defense arcs
            st.arcLines.forEach((line, idx) => {
              if (line.material) {
                line.material.opacity = 0.5 + Math.sin(elapsed * 4 + idx) * 0.35;
              }
            });
          }
        }
      }

      if (st.renderer && st.scene && st.camera) {
        st.renderer.render(st.scene, st.camera);
      }

      st.reqId = requestAnimationFrame(animate);
    };

    st.reqId = requestAnimationFrame(animate);

    return () => {
      destroyed = true;
      if (st.reqId) cancelAnimationFrame(st.reqId);

      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      resizeObserver.disconnect();

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }

      atmosGeo.dispose();
      atmosMat.dispose();
      cyberGeo.dispose();
      cyberMat.dispose();
    };
  }, [cameraDistance, autoRotate, autoRotateSpeed, interactive, lightPreset, onLoaded]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none ${
        interactive ? 'cursor-grab active:cursor-grabbing' : ''
      } ${className}`}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-full border-2 border-[#2454ff]/20 border-t-[#2454ff] animate-spin" />
        </div>
      )}

      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-[#64748b]">
          3D Earth Preview
        </div>
      )}
    </div>
  );
}
