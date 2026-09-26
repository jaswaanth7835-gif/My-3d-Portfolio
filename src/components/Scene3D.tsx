"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

const state = { scroll: 0, x: 0, y: 0 };

function useInput() {
  useEffect(() => {
    const move = (e: MouseEvent) => {
      state.x = (e.clientX / window.innerWidth) * 2 - 1;
      state.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      state.scroll = max > 0 ? THREE.MathUtils.clamp(window.scrollY / max, 0, 1) : 0;
    };
    onScroll();
    window.addEventListener("mousemove", move);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
}

const COLOR_START = new THREE.Color("#2dd4bf");
const COLOR_END = new THREE.Color("#5b8def");

function FloatingKnot() {
  const meshRef = useRef<THREE.Mesh>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialRef = useRef<any>(null);
  const rot = useRef({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });
  const smooth = useRef(0);

  const prevScroll = useRef(0);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    const material = materialRef.current;
    if (!mesh || !material) return;

    smooth.current = THREE.MathUtils.lerp(smooth.current, state.scroll, 0.06);
    const scroll = smooth.current;
    const velocity = Math.abs(scroll - prevScroll.current) / Math.max(delta, 0.001);
    prevScroll.current = scroll;

    // spin faster while scrolling, and drift along an S-curve down the page
    rot.current.x += delta * (0.15 + velocity * 6);
    rot.current.y += delta * (0.2 + velocity * 8);
    offset.current.x = THREE.MathUtils.lerp(offset.current.x, state.y * 0.6, 0.05);
    offset.current.y = THREE.MathUtils.lerp(offset.current.y, state.x * 0.6, 0.05);
    mesh.rotation.x = rot.current.x + offset.current.x;
    mesh.rotation.y = rot.current.y + offset.current.y;

    const px = Math.sin(scroll * Math.PI * 4) * 2.2 + state.x * 0.4;
    const py = -scroll * 1.5 + state.y * 0.3;
    mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, px, 0.08);
    mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, py, 0.08);
    const target = 1 + Math.sin(scroll * Math.PI * 3) * 0.25 - scroll * 0.3;
    mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, target, 0.08));

    material.distort = THREE.MathUtils.lerp(
      material.distort,
      0.3 + Math.hypot(state.x, state.y) * 0.25 + Math.min(velocity * 8, 0.5),
      0.08
    );
    material.color.lerpColors(COLOR_START, COLOR_END, Math.min(1, scroll * 1.5));
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1.2, 0.4, 256, 32]} />
      <MeshDistortMaterial ref={materialRef} color="#2dd4bf" metalness={1} roughness={0.15} distort={0.3} speed={1.5} />
    </mesh>
  );
}

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float t = uTime;
    float amp = 0.7 + uScroll * 1.3;
    float h = sin(p.x * 0.45 + t * 0.6 + uMouse.x * 1.5) * 0.7
            + cos(p.z * 0.35 + t * 0.5) * 0.7
            + sin((p.x + p.z) * 0.25 + t * 0.3) * 0.9
            + sin(p.x * 1.3 + p.z * 0.9 + t) * 0.12;
    p.y = h * amp;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float k = smoothstep(-1.6, 2.2, h);
    vec3 teal = vec3(0.176, 0.831, 0.749);
    vec3 blue = vec3(0.357, 0.553, 0.937);
    vec3 violet = vec3(0.55, 0.45, 0.95);
    vColor = mix(mix(teal, blue, k), violet, smoothstep(0.75, 1.0, k) * 0.6);
    vColor += smoothstep(0.85, 1.0, k) * 0.35;

    float depth = -mv.z;
    vAlpha = smoothstep(70.0, 8.0, depth) * smoothstep(0.5, 3.0, depth);
    gl_PointSize = clamp(38.0 / depth, 1.0, 6.0) * (1.0 + k * 0.6);
  }
`;

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.05, d) * vAlpha;
    gl_FragColor = vec4(vColor, a);
  }
`;

const COLS = 260;
const ROWS = 200;

function Waves() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const pos = new Float32Array(COLS * ROWS * 3);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = (r * COLS + c) * 3;
        pos[i] = (c / (COLS - 1) - 0.5) * 44;
        pos[i + 2] = 12 - (r / (ROWS - 1)) * 100;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uScroll: { value: 0 }, uMouse: { value: new THREE.Vector2() } }),
    []
  );
  const smooth = useRef(0);

  useFrame(({ clock, camera }) => {
    const m = material.current;
    if (!m) return;
    smooth.current = THREE.MathUtils.lerp(smooth.current, state.scroll, 0.06);
    const s = smooth.current;
    m.uniforms.uTime.value = clock.elapsedTime;
    m.uniforms.uScroll.value = s;
    m.uniforms.uMouse.value.set(state.x, state.y);

    // fly forward over the field as the page scrolls
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, state.x * 1.5, 0.05);
    camera.position.y = 3.2 - s * 1.6;
    camera.position.z = 9 - s * 55;
    camera.lookAt(camera.position.x * 0.5, -0.4, camera.position.z - 16);
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export type SceneMode = "waves" | "knot";

export default function Scene3D({ mode }: { mode: SceneMode }) {
  const wrap = useRef<HTMLDivElement>(null);
  useInput();

  useEffect(() => {
    const top = mode === "waves" ? 0.75 : 1;
    const floor = 0.45;
    const fade = () => {
      if (wrap.current)
        wrap.current.style.opacity = String(top - (top - floor) * Math.min(1, window.scrollY / window.innerHeight));
    };
    fade();
    window.addEventListener("scroll", fade, { passive: true });
    return () => window.removeEventListener("scroll", fade);
  }, [mode]);

  return (
    <div ref={wrap} className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas key={mode} camera={{ position: [0, 3.2, 9], fov: 55 }} dpr={[1, 2]}>
        {mode === "waves" ? (
          <Waves />
        ) : (
          <>
            <ambientLight intensity={0.4} />
            <pointLight position={[5, 5, 5]} intensity={1.2} />
            <Environment preset="city" />
            <group position={[0, 0, 3]}>
              <FloatingKnot />
            </group>
          </>
        )}
      </Canvas>
      {mode !== "knot" && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_30%_45%,rgba(10,10,10,0.8),transparent_75%)]" />
      )}
    </div>
  );
}
