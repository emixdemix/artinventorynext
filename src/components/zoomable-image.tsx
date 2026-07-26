"use client";

import { useEffect, useRef, useState } from "react";

const MIN_SCALE = 1;
const MAX_SCALE = 8;
const ZOOM_STEP = 1.25;

type Props = {
  src: string;
  alt: string;
};

export const ZoomableImage = ({ src, alt }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);

  const dragRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(
    null,
  );
  const pinchRef = useRef<{
    d0: number;
    scale0: number;
    cx: number;
    cy: number;
    tx0: number;
    ty0: number;
  } | null>(null);
  const lastTapRef = useRef<number>(0);

  const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v));

  const reset = () => {
    setScale(1);
    setTx(0);
    setTy(0);
  };

  const zoomAtPoint = (nextScale: number, cx: number, cy: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const px = cx - rect.left - rect.width / 2;
    const py = cy - rect.top - rect.height / 2;
    const clamped = clamp(nextScale, MIN_SCALE, MAX_SCALE);
    const ratio = clamped / scale;
    setScale(clamped);
    if (clamped === 1) {
      setTx(0);
      setTy(0);
    } else {
      setTx((tx - px) * ratio + px);
      setTy((ty - py) * ratio + py);
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dir = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
      zoomAtPoint(scale * dir, e.clientX, e.clientY);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [scale, tx, ty]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (scale <= 1) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, tx, ty };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    setTx(dragRef.current.tx + (e.clientX - dragRef.current.x));
    setTy(dragRef.current.ty + (e.clientY - dragRef.current.y));
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const onDoubleClick = (e: React.MouseEvent) => {
    if (scale > 1) reset();
    else zoomAtPoint(2.5, e.clientX, e.clientY);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const [a, b] = [e.touches[0], e.touches[1]];
      pinchRef.current = {
        d0: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
        scale0: scale,
        cx: (a.clientX + b.clientX) / 2,
        cy: (a.clientY + b.clientY) / 2,
        tx0: tx,
        ty0: ty,
      };
    } else if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        const t = e.touches[0];
        if (scale > 1) reset();
        else zoomAtPoint(2.5, t.clientX, t.clientY);
        lastTapRef.current = 0;
      } else {
        lastTapRef.current = now;
      }
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      e.preventDefault();
      const [a, b] = [e.touches[0], e.touches[1]];
      const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const next = clamp(
        pinchRef.current.scale0 * (d / pinchRef.current.d0),
        MIN_SCALE,
        MAX_SCALE,
      );
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const px = pinchRef.current.cx - rect.left - rect.width / 2;
      const py = pinchRef.current.cy - rect.top - rect.height / 2;
      const ratio = next / pinchRef.current.scale0;
      setScale(next);
      setTx((pinchRef.current.tx0 - px) * ratio + px);
      setTy((pinchRef.current.ty0 - py) * ratio + py);
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) pinchRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={onDoubleClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        position: "fixed",
        inset: 0,
        background: "#111",
        overflow: "hidden",
        touchAction: "none",
        cursor: scale > 1 ? (dragRef.current ? "grabbing" : "grab") : "zoom-in",
      }}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(${scale})`,
          transformOrigin: "center center",
          maxWidth: "100vw",
          maxHeight: "100vh",
          objectFit: "contain",
          userSelect: "none",
          willChange: "transform",
          transition: dragRef.current || pinchRef.current
            ? "none"
            : "transform 120ms ease-out",
        }}
      />
      <div
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          display: "flex",
          gap: 8,
          zIndex: 10,
        }}
      >
        <button
          type="button"
          aria-label="Zoom out"
          onClick={() => {
            const el = containerRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            zoomAtPoint(scale / ZOOM_STEP, r.left + r.width / 2, r.top + r.height / 2);
          }}
          style={btnStyle}
        >
          −
        </button>
        <button type="button" aria-label="Reset" onClick={reset} style={btnStyle}>
          ⤾
        </button>
        <button
          type="button"
          aria-label="Zoom in"
          onClick={() => {
            const el = containerRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            zoomAtPoint(scale * ZOOM_STEP, r.left + r.width / 2, r.top + r.height / 2);
          }}
          style={btnStyle}
        >
          +
        </button>
      </div>
    </div>
  );
};

const btnStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 20,
  border: "none",
  background: "rgba(255,255,255,0.85)",
  color: "#111",
  fontSize: 20,
  lineHeight: "40px",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
};
