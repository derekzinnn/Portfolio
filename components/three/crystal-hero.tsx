"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import { BRAND } from "@/lib/constants";
import { getCssColor } from "@/lib/utils";

/**
 * Hero crystal — a literal faceted glass icosahedron (the single "wow").
 * Ported from the locked design engine (crystal.js): blue glass + soft-blue
 * additive core + white facet edges, procedural cube env-map.
 *
 * Interaction: GRAB-TO-ROTATE, no auto-spin. Sits still until dragged; on
 * release it glides to a stop (inertia + friction) and the render loop halts
 * (idle = no work). dpr capped; pauses off-screen; drag enabled for fine
 * pointers only (touch stays scrollable); reduced-motion → static.
 */

function buildEnv(): THREE.CubeTexture {
  const s = 128;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, 0, s);
  g.addColorStop(0, "#18233f");
  g.addColorStop(0.55, "#0b1226");
  g.addColorStop(1, "#05080f");
  x.fillStyle = g;
  x.fillRect(0, 0, s, s);
  const hg = x.createRadialGradient(
    s * 0.32,
    s * 0.26,
    2,
    s * 0.32,
    s * 0.26,
    s * 0.55,
  );
  hg.addColorStop(0, "rgba(214,226,250,0.6)");
  hg.addColorStop(1, "rgba(214,226,250,0)");
  x.fillStyle = hg;
  x.fillRect(0, 0, s, s);
  const ag = x.createRadialGradient(
    s * 0.74,
    s * 0.8,
    2,
    s * 0.74,
    s * 0.8,
    s * 0.46,
  );
  ag.addColorStop(0, "rgba(108,155,245,0.42)");
  ag.addColorStop(1, "rgba(108,155,245,0)");
  x.fillStyle = ag;
  x.fillRect(0, 0, s, s);
  const tex = new THREE.CubeTexture([c, c, c, c, c, c]);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

type CrystalHeroProps = {
  align?: "left" | "center" | "right";
  scale?: number;
  className?: string;
};

export function CrystalHero({
  align = "right",
  scale,
  className,
}: CrystalHeroProps) {
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
    const accent = getCssColor("--accent", BRAND.accent);
    const s = scale ?? (coarse ? 1.06 : 1.14);

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
    renderer.toneMappingExposure = 1.06;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    const env = buildEnv();

    const group = new THREE.Group();
    const baseX = align === "right" ? 1.15 : align === "left" ? -1.15 : 0;
    group.position.x = baseX;
    scene.add(group);

    const geo = new THREE.IcosahedronGeometry(1.4 * s, 0);
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xaebdd6,
      metalness: 0,
      roughness: 0.07,
      clearcoat: 1,
      clearcoatRoughness: 0.18,
      transparent: true,
      opacity: 0.5,
      envMap: env,
      envMapIntensity: 1.5,
      reflectivity: 0.6,
      side: THREE.DoubleSide,
      depthWrite: false,
      flatShading: true,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.renderOrder = 2;
    group.add(mesh);

    const coreGeo = new THREE.IcosahedronGeometry(0.62 * s, 0);
    const coreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accent),
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.renderOrder = 1;
    group.add(core);

    const edgeGeo = new THREE.EdgesGeometry(geo);
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xf5f3ef,
      transparent: true,
      opacity: 0.3,
    });
    const edges = new THREE.LineSegments(edgeGeo, edgeMat);
    edges.renderOrder = 3;
    group.add(edges);

    const hemi = new THREE.HemisphereLight(0xc2d2ff, 0x0a0e1a, 0.65);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(-3, 4, 5);
    scene.add(key);
    const pl = new THREE.PointLight(new THREE.Color(accent), 0.9, 14);
    pl.position.set(2.5, -2, 3);
    scene.add(pl);

    // Resting pose — a flattering three-quarter angle. Stays here until grabbed.
    group.rotation.set(0.32, -0.5, 0);

    const resize = () => {
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
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

    let raf = 0;
    let running = false;
    let dragging = false;
    let last: { x: number; y: number } | null = null;
    const vel = { x: 0, y: 0 };
    const CLAMP = Math.PI * 0.49;
    const canDrag = !coarse;

    const loop = () => {
      if (!dragging) {
        group.rotation.y += vel.y;
        group.rotation.x = Math.max(
          -CLAMP,
          Math.min(CLAMP, group.rotation.x + vel.x),
        );
        vel.x *= 0.93;
        vel.y *= 0.93;
        if (Math.abs(vel.x) < 0.00012 && Math.abs(vel.y) < 0.00012) {
          vel.x = vel.y = 0;
          renderOnce();
          running = false;
          raf = 0;
          return;
        }
      }
      renderOnce();
      raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      if (!running && !reduce) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    const halt = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const down = (e: PointerEvent) => {
      dragging = true;
      last = { x: e.clientX, y: e.clientY };
      vel.x = vel.y = 0;
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
      const k = 0.006;
      group.rotation.y += dx * k;
      group.rotation.x = Math.max(
        -CLAMP,
        Math.min(CLAMP, group.rotation.x + dy * k),
      );
      vel.y = reduce ? 0 : dx * k;
      vel.x = reduce ? 0 : dy * k;
      renderOnce();
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      canvas.style.cursor = "grab";
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {}
      wake();
    };

    if (canDrag) {
      canvas.style.pointerEvents = "auto";
      canvas.style.cursor = "grab";
      canvas.style.touchAction = "none";
      canvas.addEventListener("pointerdown", down);
      canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerup", up);
      canvas.addEventListener("pointercancel", up);
    }

    // Paint the resting frame; it holds still until grabbed.
    renderOnce();
    if (reduce) {
      group.rotation.set(0.2, 0.55, 0);
      renderOnce();
    }

    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (es) => {
              if (!(es[0] && es[0].isIntersecting)) halt();
              else renderOnce();
            },
            { threshold: 0 },
          )
        : null;
    if (io) io.observe(canvas);

    return () => {
      halt();
      ro?.disconnect();
      io?.disconnect();
      if (canDrag) {
        canvas.removeEventListener("pointerdown", down);
        canvas.removeEventListener("pointermove", move);
        canvas.removeEventListener("pointerup", up);
        canvas.removeEventListener("pointercancel", up);
      }
      geo.dispose();
      coreGeo.dispose();
      edgeGeo.dispose();
      mat.dispose();
      coreMat.dispose();
      edgeMat.dispose();
      env.dispose();
      renderer.dispose();
    };
  }, [align, scale]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Interactive 3D crystal — drag to rotate it"
      className={className}
      style={{ pointerEvents: "none" }}
    />
  );
}
