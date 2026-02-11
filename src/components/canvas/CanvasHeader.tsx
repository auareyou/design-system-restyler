"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useProject } from "@/context/ProjectContext";
import styles from "./CanvasHeader.module.css";

export default function CanvasHeader() {
  const { state, dispatch } = useProject();
  const { viewport, storybookUrl } = state;

  const zoomPercent = Math.round(viewport.zoom * 100);

  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(viewport.zoom * 1.25, 3.0);
    dispatch({ type: "SET_VIEWPORT", viewport: { zoom: newZoom } });
  }, [viewport.zoom, dispatch]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(viewport.zoom / 1.25, 0.1);
    dispatch({ type: "SET_VIEWPORT", viewport: { zoom: newZoom } });
  }, [viewport.zoom, dispatch]);

  const handleZoomReset = useCallback(() => {
    dispatch({ type: "SET_VIEWPORT", viewport: { zoom: 1 } });
  }, [dispatch]);

  const hostname = storybookUrl ? (() => {
    try { return new URL(storybookUrl).hostname; }
    catch { return storybookUrl; }
  })() : null;

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href="/" className={styles.backLink}>
          <div className={styles.logoMark}>R</div>
        </Link>
        {hostname && <span className={styles.sourceTag}>{hostname}</span>}
      </div>
      <div className={styles.zoomControls}>
        <button className={styles.zoomButton} onClick={handleZoomOut}>-</button>
        <button className={styles.zoomLabel} onClick={handleZoomReset}>
          {zoomPercent}%
        </button>
        <button className={styles.zoomButton} onClick={handleZoomIn}>+</button>
      </div>
    </header>
  );
}
