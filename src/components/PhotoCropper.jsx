import { useRef, useState, useCallback, useEffect } from "react";
import styles from "./PhotoCropper.module.css";

const CROP_SIZE = 280;
const OUTPUT_SIZE = 400;

export function PhotoCropper({ imageSrc, onConfirm, onCancel }) {
  const imgRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ w: 1, h: 1 });
  const [minScale, setMinScale] = useState(1);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);
  // para pinch-to-zoom
  const pinchRef = useRef(null);

  function clampOffset(ox, oy, sc, nw, nh) {
    const maxX = Math.max(0, (nw * sc - CROP_SIZE) / 2);
    const maxY = Math.max(0, (nh * sc - CROP_SIZE) / 2);
    return {
      x: Math.max(-maxX, Math.min(maxX, ox)),
      y: Math.max(-maxY, Math.min(maxY, oy)),
    };
  }

  function handleImageLoad() {
    const img = imgRef.current;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    const ms = Math.max(CROP_SIZE / nw, CROP_SIZE / nh);
    setNaturalSize({ w: nw, h: nh });
    setMinScale(ms);
    setScale(ms);
    setOffset({ x: 0, y: 0 });
    setImageLoaded(true);
  }

  // Arrastar com mouse/touch
  function handlePointerDown(e) {
    // ignora quando é segundo toque de pinch
    if (e.touches && e.touches.length > 1) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, pointerId: e.pointerId };
  }

  function handlePointerMove(e) {
    if (!dragRef.current || dragRef.current.pointerId !== e.pointerId) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    dragRef.current = { x: e.clientX, y: e.clientY, pointerId: e.pointerId };
    setOffset((prev) => clampOffset(prev.x + dx, prev.y + dy, scale, naturalSize.w, naturalSize.h));
  }

  function handlePointerUp() {
    dragRef.current = null;
  }

  // Scroll para zoom (desktop)
  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      setScale((prev) => {
        const factor = e.deltaY > 0 ? 0.92 : 1.08;
        const next = Math.max(minScale, Math.min(minScale * 4, prev * factor));
        setOffset((o) => clampOffset(o.x, o.y, next, naturalSize.w, naturalSize.h));
        return next;
      });
    },
    [minScale, naturalSize]
  );

  // Registra wheel como non-passive para poder preventDefault
  const cropContainerRef = useRef(null);
  useEffect(() => {
    const el = cropContainerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Pinch-to-zoom em mobile
  function handleTouchStart(e) {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchRef.current = Math.hypot(dx, dy);
    }
  }

  function handleTouchMove(e) {
    if (e.touches.length === 2 && pinchRef.current != null) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / pinchRef.current;
      pinchRef.current = dist;
      setScale((prev) => {
        const next = Math.max(minScale, Math.min(minScale * 4, prev * ratio));
        setOffset((o) => clampOffset(o.x, o.y, next, naturalSize.w, naturalSize.h));
        return next;
      });
    }
  }

  function handleTouchEnd(e) {
    if (e.touches.length < 2) pinchRef.current = null;
  }

  // Slider de zoom
  function handleSlider(e) {
    const next = parseFloat(e.target.value);
    setScale(next);
    setOffset((o) => clampOffset(o.x, o.y, next, naturalSize.w, naturalSize.h));
  }

  // Confirmar: renderiza no canvas e retorna base64
  function handleConfirm() {
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");
    const { w: nw, h: nh } = naturalSize;

    // Posição top-left da imagem no container do crop
    const imgLeft = CROP_SIZE / 2 - (nw * scale) / 2 + offset.x;
    const imgTop = CROP_SIZE / 2 - (nh * scale) / 2 + offset.y;

    // Região da imagem natural que cai dentro do crop
    const srcX = (0 - imgLeft) / scale;
    const srcY = (0 - imgTop) / scale;
    const srcW = CROP_SIZE / scale;
    const srcH = CROP_SIZE / scale;

    ctx.drawImage(imgRef.current, srcX, srcY, srcW, srcH, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    onConfirm(canvas.toDataURL("image/jpeg", 0.85));
  }

  // Imagem renderizada dentro do crop container
  const imgStyle = imageLoaded
    ? {
        width: naturalSize.w * scale,
        height: naturalSize.h * scale,
        left: CROP_SIZE / 2 - (naturalSize.w * scale) / 2 + offset.x,
        top: CROP_SIZE / 2 - (naturalSize.h * scale) / 2 + offset.y,
      }
    : {};

  const sliderMax = minScale * 4;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className={styles.modal}>
        <p className={styles.hint}>Arraste para reposicionar · Scroll ou belisco para zoom · Toque fora para cancelar</p>

        <div
          ref={cropContainerRef}
          className={styles.cropContainer}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img
            ref={imgRef}
            src={imageSrc}
            className={styles.cropImg}
            style={imgStyle}
            onLoad={handleImageLoad}
            draggable={false}
          />
          <div className={styles.circularMask} aria-hidden="true" />
          <div className={styles.cropGuide} aria-hidden="true" />
        </div>

        {imageLoaded && (
          <div className={styles.sliderWrapper}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="11" y1="8" x2="11" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="range"
              className={styles.slider}
              min={minScale}
              max={sliderMax}
              step={minScale * 0.01}
              value={scale}
              onChange={handleSlider}
            />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="11" y1="8" x2="11" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        )}

        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={onCancel}>
            Cancelar
          </button>
          <button className={styles.btnConfirm} onClick={handleConfirm} disabled={!imageLoaded}>
            Usar foto
          </button>
        </div>
      </div>
    </div>
  );
}
