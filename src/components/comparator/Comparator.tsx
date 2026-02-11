"use client";

import { useRef, useCallback, useEffect } from "react";
import { useProject } from "@/context/ProjectContext";
import KitchenSink from "@/components/kitchen-sink/KitchenSink";
import styles from "./Comparator.module.css";

export default function Comparator() {
  const { state, dispatch, getTokenSet } = useProject();
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollingRef = useRef(false);

  const panelCount = state.activePanels.length;
  const gridClass =
    panelCount === 3
      ? styles.panelsThree
      : panelCount === 2
      ? styles.panelsTwo
      : styles.panelsOne;

  // ── Scroll sync ──

  const handleScroll = useCallback(
    (index: number) => {
      if (!state.scrollSync || scrollingRef.current) return;
      scrollingRef.current = true;

      const source = panelRefs.current[index];
      if (!source) return;

      const { scrollTop, scrollLeft } = source;
      panelRefs.current.forEach((el, i) => {
        if (i !== index && el) {
          el.scrollTop = scrollTop;
          el.scrollLeft = scrollLeft;
        }
      });

      requestAnimationFrame(() => {
        scrollingRef.current = false;
      });
    },
    [state.scrollSync]
  );

  // Register scroll listeners
  useEffect(() => {
    const refs = panelRefs.current;
    const handlers = refs.map((_, i) => () => handleScroll(i));
    refs.forEach((el, i) => {
      if (el) el.addEventListener("scroll", handlers[i], { passive: true });
    });
    return () => {
      refs.forEach((el, i) => {
        if (el) el.removeEventListener("scroll", handlers[i]);
      });
    };
  }, [handleScroll, panelCount]);

  if (!state.baseTokens || state.components.length === 0) {
    return null;
  }

  if (state.activePanels.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateTitle}>No panels active</div>
        <div className={styles.emptyStateText}>
          Add a variation to see side-by-side comparison
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <button
            className={`${styles.toolbarButton} ${
              state.scrollSync ? styles.toolbarButtonActive : ""
            }`}
            onClick={() => dispatch({ type: "TOGGLE_SCROLL_SYNC" })}
          >
            {state.scrollSync ? "↕ Sync on" : "↕ Sync off"}
          </button>
          <span style={{ fontSize: 12, color: "var(--app-text-tertiary)" }}>
            {panelCount} panel{panelCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Panels */}
      <div className={`${styles.panels} ${gridClass}`}>
        {state.activePanels.map((tokenSetId, index) => {
          const tokenSet = getTokenSet(tokenSetId);
          if (!tokenSet) return null;

          const isBase = tokenSetId === state.baseTokens?.id;
          const variation = state.variations.find(
            (v) => v.tokenSet.id === tokenSetId
          );

          return (
            <div key={tokenSetId} className={styles.panel}>
              <div className={styles.panelHeader}>
                <span className={styles.panelLabel}>{tokenSet.label}</span>
                <div className={styles.panelMeta}>
                  {isBase && (
                    <span className={styles.panelBadge}>Original</span>
                  )}
                  {variation && (
                    <>
                      <button
                        className={styles.panelInspectButton}
                        onClick={() =>
                          dispatch({
                            type: "SET_INSPECTOR_TARGET",
                            variationId: variation.id,
                          })
                        }
                      >
                        Inspect tokens
                      </button>
                      <button
                        className={styles.panelRemoveButton}
                        onClick={() =>
                          dispatch({
                            type: "REMOVE_VARIATION",
                            variationId: variation.id,
                          })
                        }
                        title="Remove variation"
                      >
                        ×
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div
                className={styles.panelBody}
                ref={(el) => {
                  panelRefs.current[index] = el;
                }}
              >
                <KitchenSink
                  groups={state.components}
                  tokenSet={tokenSet}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
