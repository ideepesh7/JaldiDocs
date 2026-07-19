import { useEffect, useRef } from 'react';
import type * as ThreeModule from 'three';

type SceneRefs = {
  frameId: number;
  renderer: ThreeModule.WebGLRenderer;
  scene: ThreeModule.Scene;
  camera: ThreeModule.PerspectiveCamera;
  group: ThreeModule.Group;
  particles: ThreeModule.Points;
  resize: () => void;
  pointer: (event: PointerEvent) => void;
};

const toolLabels = ['PDF', '50KB', 'Invoice', 'HRA', 'Photo', 'Sign'];

function makeLabelTexture(THREE: typeof ThreeModule, text: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  roundRect(ctx, 18, 18, 220, 60, 30);
  ctx.fill();
  ctx.strokeStyle = 'rgba(37,99,235,0.20)';
  ctx.lineWidth = 3;
  roundRect(ctx, 18, 18, 220, 60, 30);
  ctx.stroke();
  ctx.fillStyle = '#111827';
  ctx.font = '700 28px DM Sans, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 49);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export default function Hero3DScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const refs = useRef<SceneRefs | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || refs.current) return;

    let cancelled = false;

    const setup = async () => {
      const THREE = await import('three');
      if (cancelled || !mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.35, 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const ambient = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(3, 5, 4);
    scene.add(key);

    const blue = new THREE.PointLight(0x2563eb, 12, 12);
    blue.position.set(-3.2, 1.8, 3);
    scene.add(blue);

    const green = new THREE.PointLight(0x10b981, 8, 10);
    green.position.set(3, -1.5, 2.8);
    scene.add(green);

    const docMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.34,
      metalness: 0.03,
      clearcoat: 0.3,
      side: THREE.DoubleSide,
    });
    const edgeMaterial = new THREE.MeshBasicMaterial({ color: 0x2563eb, transparent: true, opacity: 0.18 });
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x111827, transparent: true, opacity: 0.16 });

    const docGeometry = new THREE.BoxGeometry(2.3, 3.05, 0.055);
    const barGeometry = new THREE.BoxGeometry(1.45, 0.035, 0.012);
    const shortBarGeometry = new THREE.BoxGeometry(0.94, 0.035, 0.012);

    for (let i = 0; i < 6; i += 1) {
      const doc = new THREE.Mesh(docGeometry, docMaterial);
      doc.position.set((i - 2.5) * 0.24, (i - 2.5) * 0.09, -i * 0.14);
      doc.rotation.set(-0.18 + i * 0.018, -0.54 + i * 0.07, 0.18 - i * 0.035);
      doc.userData.float = i * 0.55;
      group.add(doc);

      const ribbon = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.12, 0.014), edgeMaterial);
      ribbon.position.set(doc.position.x, doc.position.y + 1.12, doc.position.z + 0.04);
      ribbon.rotation.copy(doc.rotation);
      ribbon.userData.float = i * 0.55;
      group.add(ribbon);

      for (let j = 0; j < 4; j += 1) {
        const line = new THREE.Mesh(j % 2 ? shortBarGeometry : barGeometry, lineMaterial);
        line.position.set(doc.position.x - 0.12, doc.position.y + 0.55 - j * 0.28, doc.position.z + 0.06);
        line.rotation.copy(doc.rotation);
        line.userData.float = i * 0.55 + j * 0.12;
        group.add(line);
      }
    }

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.65, 0.01, 12, 128),
      new THREE.MeshBasicMaterial({ color: 0x2563eb, transparent: true, opacity: 0.34 })
    );
    ring.rotation.x = Math.PI / 2.7;
    group.add(ring);

    const labelGroup = new THREE.Group();
    group.add(labelGroup);
    toolLabels.forEach((label, index) => {
      const texture = makeLabelTexture(THREE, label);
      if (!texture) return;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
      sprite.scale.set(1.18, 0.44, 1);
      sprite.userData.angle = (index / toolLabels.length) * Math.PI * 2;
      sprite.userData.radius = index % 2 ? 2.95 : 2.58;
      labelGroup.add(sprite);
    });

    const particleCount = 180;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const radius = 2.2 + Math.random() * 2.6;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3.6;
      positions[i * 3 + 2] = Math.sin(angle) * radius * 0.42;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({ color: 0x2563eb, size: 0.035, transparent: true, opacity: 0.38 })
    );
    scene.add(particles);

    const pointerState = { x: 0, y: 0 };
    const pointer = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointerState.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerState.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      camera.aspect = width / height;
      camera.position.z = width < 640 ? 8.2 : 7.5;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      group.rotation.y = Math.sin(t * 0.36) * 0.18 + pointerState.x * 0.12;
      group.rotation.x = -0.08 + Math.sin(t * 0.42) * 0.06 - pointerState.y * 0.06;
      group.position.y = Math.sin(t * 0.55) * 0.08;
      ring.rotation.z = t * 0.28;
      labelGroup.children.forEach((child) => {
        const angle = child.userData.angle + t * 0.42;
        const radius = child.userData.radius;
        child.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.2) * 0.82, Math.sin(angle) * 0.62);
      });
      group.children.forEach((child) => {
        if (child.userData.float !== undefined) {
          child.position.y += Math.sin(t * 1.2 + child.userData.float) * 0.0009;
        }
      });
      particles.rotation.y = t * 0.08;
      renderer.render(scene, camera);
      refs.current!.frameId = window.requestAnimationFrame(animate);
    };

    refs.current = { frameId: 0, renderer, scene, camera, group, particles, resize, pointer };
    resize();
    mount.addEventListener('pointermove', pointer);
    window.addEventListener('resize', resize);
    renderer.render(scene, camera);
    if (!reduced) refs.current.frameId = window.requestAnimationFrame(animate);

    };

    setup();

    return () => {
      cancelled = true;
      const current = refs.current;
      if (!current) return;
      window.cancelAnimationFrame(current.frameId);
      window.removeEventListener('resize', current.resize);
      mount.removeEventListener('pointermove', current.pointer);
      current.renderer.dispose();
      current.scene.traverse((object) => {
        const anyObject = object as {
          geometry?: { dispose?: () => void };
          material?: { dispose?: () => void } | Array<{ dispose?: () => void }>;
        };
        anyObject.geometry?.dispose?.();
        if (Array.isArray(anyObject.material)) {
          anyObject.material.forEach((m) => m.dispose?.());
        } else {
          anyObject.material?.dispose?.();
        }
      });
      current.renderer.domElement.remove();
      refs.current = null;
    };
  }, []);

  return (
    <div className="hero-3d-scene" ref={mountRef} aria-hidden="true">
      <div className="hero-3d-fallback">
        <div className="fallback-doc fallback-doc-a" />
        <div className="fallback-doc fallback-doc-b" />
        <div className="fallback-doc fallback-doc-c" />
      </div>
    </div>
  );
}
