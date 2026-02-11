"use client";

import { useCallback } from "react";
import { useProject } from "@/context/ProjectContext";
import styles from "./VersionList.module.css";

export default function VersionList() {
  const { state, dispatch, getTokenSet } = useProject();
  const { frames, selection } = state;

  const handleSelect = useCallback(
    (frameId: string) => {
      dispatch({ type: "SELECT_FRAME", frameId, additive: false });
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (frameId: string) => {
      const frame = state.frames.find((f) => f.id === frameId);
      if (!frame || frame.isBase) return;
      const variation = state.variations.find(
        (v) => v.tokenSet.id === frame.tokenSetId
      );
      if (variation) {
        dispatch({ type: "REMOVE_VARIATION", variationId: variation.id });
      }
    },
    [state.frames, state.variations, dispatch]
  );

  if (frames.length === 0) return null;

  return (
    <div className={styles.container}>
      <div className={styles.title}>Versions</div>
      <div className={styles.list}>
        {frames.map((frame) => {
          const isSelected = selection.frameIds.includes(frame.id);
          const tokenSet = getTokenSet(frame.tokenSetId);
          // Sample first few color tokens for swatches
          const colorTokens = tokenSet?.tokens
            .filter((t) => t.category === "color" && t.value.startsWith("#"))
            .slice(0, 4) ?? [];

          return (
            <button
              key={frame.id}
              className={`${styles.item} ${isSelected ? styles.selected : ""}`}
              onClick={() => handleSelect(frame.id)}
            >
              <div className={styles.itemInfo}>
                <span className={styles.itemLabel}>
                  {frame.label}
                  {frame.isBase && (
                    <span className={styles.badge}>Original</span>
                  )}
                </span>
                {colorTokens.length > 0 && (
                  <div className={styles.swatches}>
                    {colorTokens.map((t, i) => (
                      <div
                        key={i}
                        className={styles.swatch}
                        style={{ background: t.value }}
                      />
                    ))}
                  </div>
                )}
              </div>
              {!frame.isBase && (
                <button
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(frame.id);
                  }}
                >
                  x
                </button>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
