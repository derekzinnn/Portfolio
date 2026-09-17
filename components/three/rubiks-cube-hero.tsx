"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Hero "cubo mágico" - a real 3×3×3 Rubik's cube that ASSEMBLES itself on
 * mount (cubies fly in) and then keeps turning random layers forever, like it's
 * being solved/scrambled. Drag to rotate the whole cube.
 *
 * Budget: dpr capped, paused off-screen (IntersectionObserver). Under
 * prefers-reduced-motion it still animates but calmly (slower turns, a gentle
 * scale-in instead of the exploded fly-in) - the cube is the hero, so it stays
 * alive rather than going fully static.
 */

const AXES = ["x", "y", "z"] as const;
type Axis = (typeof AXES)[number];

// Sticker palette - a valid Rubik scheme (opposite pairs), tuned a touch calmer.
const FACE = {
  R: "#e5484d", // right  (red)
  L: "#e8913c", // left   (orange)
  U: "#eef2f7", // up     (white)
  D: "#e9c750", // down   (yellow)
  F: "#6c9bf5", // front  (our accent blue)
  B: "#3fb980", // back   (green)
} as const;

const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

type RubiksCubeHeroProps = {
  align?: "left" | "center" | "right";
  scale?: number;
  className?: string;
};

export function RubiksCubeHero({
  align = "right",
  scale = 1,
  className,
}: RubiksCubeHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarse =
      window.matchMedia?.("(pointer:coarse)").matches ||
      window.innerWidth < 720;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2),
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 8.6);

    const cube = new THREE.Group();
    cube.position.x = 0; // real x is set in resize(), relative to the viewport edge
    cube.rotation.set(-0.45, -0.6, 0);
    scene.add(cube);

    // --- Geometry / materials (shared) ---
    const SIZE = 0.64 * scale;
    const STEP = 0.68 * scale;
    const STICKER = SIZE * 0.86;
    const EPS = 0.002;

    const disposables: { dispose: () => void }[] = [];
    const boxGeo = new THREE.BoxGeometry(SIZE, SIZE, SIZE);
    const stickerGeo = new THREE.PlaneGeometry(STICKER, STICKER);
    disposables.push(boxGeo, stickerGeo);

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0a0d13,
      roughness: 0.62,
      metalness: 0.1,
    });
    disposables.push(bodyMat);
    const faceMat: Record<keyof typeof FACE, THREE.MeshStandardMaterial> = {
      R: new THREE.MeshStandardMaterial({ color: FACE.R, roughness: 0.34 }),
      L: new THREE.MeshStandardMaterial({ color: FACE.L, roughness: 0.34 }),
      U: new THREE.MeshStandardMaterial({ color: FACE.U, roughness: 0.34 }),
      D: new THREE.MeshStandardMaterial({ color: FACE.D, roughness: 0.34 }),
      F: new THREE.MeshStandardMaterial({ color: FACE.F, roughness: 0.34 }),
      B: new THREE.MeshStandardMaterial({ color: FACE.B, roughness: 0.34 }),
    };
    Object.values(faceMat).forEach((m) => disposables.push(m));

    // Add a colored sticker plane on one exterior face of a cubie.
    const addSticker = (
      cubie: THREE.Mesh,
      key: keyof typeof FACE,
      dir: Axis,
      sign: 1 | -1,
    ) => {
      const s = new THREE.Mesh(stickerGeo, faceMat[key]);
      const off = SIZE / 2 + EPS;
      if (dir === "x") {
        s.position.x = sign * off;
        s.rotation.y = (sign * Math.PI) / 2;
      } else if (dir === "y") {
        s.position.y = sign * off;
        s.rotation.x = (-sign * Math.PI) / 2;
      } else {
        s.position.z = sign * off;
        if (sign < 0) s.rotation.y = Math.PI;
      }
      cubie.add(s);
    };

    const cubies: THREE.Mesh[] = [];
    for (let ix = -1; ix <= 1; ix++) {
      for (let iy = -1; iy <= 1; iy++) {
        for (let iz = -1; iz <= 1; iz++) {
          const c = new THREE.Mesh(boxGeo, bodyMat);
          c.position.set(ix * STEP, iy * STEP, iz * STEP);
          if (ix === 1) addSticker(c, "R", "x", 1);
          if (ix === -1) addSticker(c, "L", "x", -1);
          if (iy === 1) addSticker(c, "U", "y", 1);
          if (iy === -1) addSticker(c, "D", "y", -1);
          if (iz === 1) addSticker(c, "F", "z", 1);
          if (iz === -1) addSticker(c, "B", "z", -1);
          cube.add(c);
          cubies.push(c);
        }
      }
    }

    // --- Lights ---
    scene.add(new THREE.HemisphereLight(0x8fa5d6, 0x0a0f1a, 0.7));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(-4, 6, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xbcd0ff, 0.5);
    fill.position.set(5, -1, 3);
    scene.add(fill);

    const resize = () => {
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // Keep the cube hugging the right wall regardless of viewport width:
      // place it at a fixed fraction of the half-view-width (0 = center, 1 = edge).
      const halfW =
        Math.tan((camera.fov * Math.PI) / 360) *
        camera.position.z *
        camera.aspect;
      const f = align === "right" ? 0.48 : align === "left" ? -0.48 : 0;
      cube.position.x = f * halfW;
    };
    const renderOnce = () => renderer.render(scene, camera);
    const ro =
      "ResizeObserver" in window
        ? new ResizeObserver(() => {
            resize();
            renderOnce();
          })
        : null;
    if (ro) ro.observe(canvas);
    resize();

    // --- Assemble intro: cubies fly in from a scattered explosion ---
    const home = new Map<THREE.Mesh, THREE.Vector3>();
    const from = new Map<THREE.Mesh, THREE.Vector3>();
    for (const c of cubies) {
      home.set(c, c.position.clone());
      // Reduced motion → calm scale-in from home; otherwise fly in from scatter.
      const scattered = c.position
        .clone()
        .multiplyScalar(2.6)
        .add(
          new THREE.Vector3(
            (Math.random() - 0.5) * 3.2,
            (Math.random() - 0.5) * 3.2,
            (Math.random() - 0.5) * 3.2,
          ),
        );
      from.set(c, reduce ? c.position.clone() : scattered);
    }

    let assembling = true;
    for (const c of cubies) {
      c.position.copy(from.get(c)!);
      c.scale.setScalar(0.001);
    }

    // --- Layer-turn state machine ---
    type Turn = {
      pivot: THREE.Object3D;
      members: THREE.Mesh[];
      axis: Axis;
      target: number;
      t: number;
      dur: number;
    };
    let turn: Turn | null = null;
    let pauseUntil = 0;
    let assembleT = 0;
    // Reduced motion keeps the cube alive, just calmer/slower.
    const ASSEMBLE_MS = reduce ? 1200 : 950;
    const TURN_MS = reduce ? 640 : 380;
    const PAUSE_MS = reduce ? 520 : 150;
    const HOLD_MS = reduce ? 2600 : 1700; // linger on the solved cube
    const SCRAMBLE_LEN = 12;
    // Whole-cube tumble: faster, around a DIAGONAL world axis so a face is
    // almost never dead-on flat to the camera.
    const SPIN = reduce ? 0.00046 : 0.00062; // rad/ms
    const SPIN_AXIS = new THREE.Vector3(0.42, 1, 0.24).normalize();
    const WORLD_Y = new THREE.Vector3(0, 1, 0);
    const WORLD_X = new THREE.Vector3(1, 0, 0);

    // Self-solving cycle: scramble N recorded moves → replay them in reverse
    // (inverse direction) to return to a perfectly solved cube → hold → repeat.
    type Move = { axis: Axis; layer: number; dir: number };
    const history: Move[] = [];
    let phase: "scramble" | "solve" | "hold" = "scramble";
    let scrambleLeft = SCRAMBLE_LEN;
    let holdUntil = 0;

    const startTurn = (axis: Axis, layer: number, dir: number) => {
      cube.updateMatrixWorld(true);
      const members = cubies.filter(
        (c) => Math.round(c.position[axis] / STEP) === layer,
      );
      const pivot = new THREE.Object3D();
      cube.add(pivot);
      for (const m of members) pivot.attach(m);
      turn = {
        pivot,
        members,
        axis,
        target: (dir * Math.PI) / 2,
        t: 0,
        dur: TURN_MS,
      };
    };

    const randomMove = (): Move => {
      const last = history[history.length - 1];
      let axis: Axis;
      let layer: number;
      do {
        axis = AXES[Math.floor(Math.random() * 3)];
        layer = Math.floor(Math.random() * 3) - 1;
      } while (last && last.axis === axis && last.layer === layer);
      return { axis, layer, dir: Math.random() < 0.5 ? 1 : -1 };
    };

    const scheduleNext = (now: number) => {
      if (phase === "hold") {
        if (now >= holdUntil) {
          phase = "scramble";
          scrambleLeft = SCRAMBLE_LEN;
        }
        return;
      }
      if (phase === "scramble") {
        if (scrambleLeft > 0) {
          const mv = randomMove();
          scrambleLeft--;
          history.push(mv);
          startTurn(mv.axis, mv.layer, mv.dir);
          return;
        }
        phase = "solve";
      }
      // solve: undo the recorded moves in reverse, with inverted direction
      const mv = history.pop();
      if (mv) startTurn(mv.axis, mv.layer, -mv.dir);
      else {
        phase = "hold";
        holdUntil = now + HOLD_MS;
      }
    };

    const finishTurn = () => {
      if (!turn) return;
      turn.pivot.rotation[turn.axis] = turn.target;
      turn.pivot.updateMatrixWorld(true);
      for (const m of turn.members) {
        cube.attach(m);
        m.position.set(
          Math.round(m.position.x / STEP) * STEP,
          Math.round(m.position.y / STEP) * STEP,
          Math.round(m.position.z / STEP) * STEP,
        );
      }
      cube.remove(turn.pivot);
      turn = null;
      pauseUntil = performance.now() + PAUSE_MS;
    };

    let raf = 0;
    let running = false;
    let prev = performance.now();
    let dragging = false;
    let last: { x: number; y: number } | null = null;

    const loop = () => {
      const now = performance.now();
      const dt = now - prev;
      prev = now;

      // Idle diagonal tumble of the whole cube (paused while dragging).
      if (!dragging) cube.rotateOnWorldAxis(SPIN_AXIS, SPIN * dt);

      if (assembling) {
        assembleT += dt;
        const p = Math.min(1, assembleT / ASSEMBLE_MS);
        const e = easeOutCubic(p);
        for (const c of cubies) {
          c.position.lerpVectors(from.get(c)!, home.get(c)!, e);
          c.scale.setScalar(e);
        }
        if (p >= 1) {
          for (const c of cubies) {
            c.position.copy(home.get(c)!);
            c.scale.setScalar(1);
          }
          assembling = false;
          pauseUntil = now + 320;
        }
      } else if (turn) {
        turn.t += dt;
        const p = Math.min(1, turn.t / turn.dur);
        turn.pivot.rotation[turn.axis] = turn.target * easeInOut(p);
        if (p >= 1) finishTurn();
      } else if (now >= pauseUntil) {
        scheduleNext(now);
      }

      renderOnce();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!running) {
        running = true;
        prev = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    const halt = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    // --- Drag to rotate the whole cube (view orientation) ---
    const down = (e: PointerEvent) => {
      dragging = true;
      last = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = "grabbing";
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {}
      e.preventDefault();
    };
    const move = (e: PointerEvent) => {
      if (!dragging || !last) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      last = { x: e.clientX, y: e.clientY };
      cube.rotateOnWorldAxis(WORLD_Y, dx * 0.006);
      cube.rotateOnWorldAxis(WORLD_X, dy * 0.006);
      if (reduce || !running) renderOnce();
    };
    const up = (e: PointerEvent) => {
      dragging = false;
      canvas.style.cursor = "grab";
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {}
    };
    if (!coarse) {
      canvas.style.pointerEvents = "auto";
      canvas.style.cursor = "grab";
      canvas.style.touchAction = "none";
      canvas.addEventListener("pointerdown", down);
      canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerup", up);
      canvas.addEventListener("pointercancel", up);
    }

    renderOnce();

    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (es) => {
              if (es[0] && es[0].isIntersecting) start();
              else halt();
            },
            { threshold: 0 },
          )
        : null;
    if (io) io.observe(canvas);
    else start();

    return () => {
      halt();
      ro?.disconnect();
      io?.disconnect();
      if (!coarse) {
        canvas.removeEventListener("pointerdown", down);
        canvas.removeEventListener("pointermove", move);
        canvas.removeEventListener("pointerup", up);
        canvas.removeEventListener("pointercancel", up);
      }
      for (const d of disposables) d.dispose();
      renderer.dispose();
    };
  }, [align, scale]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Interactive 3D Rubik's cube - drag to rotate it"
      className={className}
      style={{ pointerEvents: "none" }}
    />
  );
}
