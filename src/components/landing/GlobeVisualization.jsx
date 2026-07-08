import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function GlobeVisualization() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Globe
    const geo = new THREE.SphereGeometry(1, 64, 64);
    const mat = new THREE.MeshPhongMaterial({
      color: 0x18181a,
      emissive: 0x0a0a0a,
      specular: 0x2DDDA8,
      shininess: 20,
      wireframe: false,
      transparent: true,
      opacity: 0.9,
    });
    const globe = new THREE.Mesh(geo, mat);
    scene.add(globe);

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x2DDDA8,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const wireGlobe = new THREE.Mesh(new THREE.SphereGeometry(1.002, 32, 32), wireMat);
    scene.add(wireGlobe);

    // Route points (oil supply nodes)
    const nodes = [
      { lat: 26.2, lon: 56.3, color: 0xFF6B6B }, // Hormuz
      { lat: 12.6, lon: 43.1, color: 0xFF6B6B }, // Red Sea
      { lat: 19.0, lon: 72.8, color: 0x2DDDA8 }, // Mumbai
      { lat: 13.0, lon: 80.2, color: 0x2DDDA8 }, // Chennai
      { lat: 22.3, lon: 70.0, color: 0x2DDDA8 }, // Jamnagar
      { lat: 25.3, lon: 55.3, color: 0xA78BFA }, // UAE
      { lat: 26.3, lon: 50.2, color: 0xA78BFA }, // Saudi
      { lat: 29.3, lon: 48.0, color: 0xA78BFA }, // Kuwait
      { lat: -6.1, lon: 106.8, color: 0x2DDDA8 }, // Indonesia
      { lat: 1.3, lon: 103.8, color: 0xA78BFA }, // Singapore
    ];

    const toSphere = (lat, lon, r) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    };

    nodes.forEach(n => {
      const pos = toSphere(n.lat, n.lon, 1.01);
      const dotGeo = new THREE.SphereGeometry(0.015, 8, 8);
      const dotMat = new THREE.MeshBasicMaterial({ color: n.color });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(pos);
      scene.add(dot);

      // Glow ring
      const ringGeo = new THREE.RingGeometry(0.02, 0.035, 16);
      const ringMat = new THREE.MeshBasicMaterial({ color: n.color, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(0, 0, 0);
      scene.add(ring);
    });

    // Atmospheric glow
    const glowGeo = new THREE.SphereGeometry(1.15, 32, 32);
    const glowMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.18, 0.87, 0.66, 1.0) * intensity * 0.4;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    scene.add(new THREE.Mesh(glowGeo, glowMat));

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0x2DDDA8, 0.5);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);
    const pointLight = new THREE.PointLight(0xA78BFA, 0.3, 10);
    pointLight.position.set(-3, 2, 2);
    scene.add(pointLight);

    let frame;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      globe.rotation.y += 0.002;
      wireGlobe.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}