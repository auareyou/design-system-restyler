"use client";

import { useRef, useCallback, useEffect } from "react";
import { useProject } from "@/context/ProjectContext";
import CanvasFrame from "./CanvasFrame";
import styles from "./Canvas.module.css";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export default function Canvas() {
  const { state, dispatch } = useProject();
  const { frames, viewport } = state;
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      if (e.ctrlKey || e.metaKey) {
        // Zoom centered on cursor
        const scaleFactor = 1 - e.deltaY * 0.005;
        const newZoom = clamp(viewport.zoom * scaleFactor, 0.1, 3.0);

        const rect = viewportRef.current?.getBoundingClientRect();
        if (!rect) return;

        const cursorX = e.clientX - rect.left;
        const cursorY = e.clientY - rect.top;
        const newPanX = cursorX - (cursorX - viewport.panX) * (newZoom / viewport.zoom);
        const newPanY = cursorY - (cursorY - viewport.panY) * (newZoom / viewport.zoom);

        dispatch({
          type: "SET_VIEWPORT",
          viewport: { panX: newPanX, panY: newPanY, zoom: newZoom },
        });
      } else {
        // Pan
        dispatch({
          type: "SET_VIEWPORT",
          viewport: {
            panX: viewport.panX - e.deltaX,
            panY: viewport.panY - e.deltaY,
          },
        });
      }
    },
    [viewport, dispatch]
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      // Only clear selection if clicking directly on the canvas world (not a frame)
      if ((e.target as HTMLElement).closest(`.${styles.frame}`)) return;
      dispatch({ type: "CLEAR_SELECTION" });
    },
    [dispatch]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      // Escape: clear selection / exit combine mode
      if (e.key === "Escape") {
        dispatch({ type: "CLEAR_SELECTION" });
      }

      // Delete/Backspace: remove selected frame
      if (e.key === "Delete" || e.key === "Backspace") {
        const selectedId = state.selection.frameIds[0];
        if (!selectedId) return;
        const frame = state.frames.find((f) => f.id === selectedId);
        if (!frame || frame.isBase) return;
        const variation = state.variations.find(
          (v) => v.tokenSet.id === frame.tokenSetId
        );
        if (variation) {
          dispatch({ type: "REMOVE_VARIATION", variationId: variation.id });
        }
      }

      // Cmd/Ctrl+0: reset zoom
      if ((e.metaKey || e.ctrlKey) && e.key === "0") {
        e.preventDefault();
        dispatch({ type: "SET_VIEWPORT", viewport: { zoom: 1, panX: 0, panY: 0 } });
      }

      // Cmd/Ctrl+1: zoom to 100%
      if ((e.metaKey || e.ctrlKey) && e.key === "1") {
        e.preventDefault();
        dispatch({ type: "SET_VIEWPORT", viewport: { zoom: 1 } });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, state.selection.frameIds, state.frames, state.variations]);

  return (
    <div className={styles.viewport} ref={viewportRef} tabIndex={0}>
      <div
        className={styles.world}
        style={{
          transform: `translate(${viewport.panX}px, ${viewport.panY}px) scale(${viewport.zoom})`,
        }}
        onClick={handleCanvasClick}
      >
        {frames.map((frame) => (
          <CanvasFrame key={frame.id} frame={frame} />
        ))}
      </div>
    </div>
  );
}
