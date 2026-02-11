"use client";

import { useMemo, useCallback } from "react";
import { useProject } from "@/context/ProjectContext";
import { diffTokenSets, TokenDiffEntry } from "@/lib/tokens/differ";
import { tokenSetToCss } from "@/lib/tokens/serializer";
import styles from "./TokenInspector.module.css";

const CATEGORY_ORDER = [
  "color",
  "typography",
  "spacing",
  "radius",
  "shadow",
  "border",
  "opacity",
  "transition",
];

function isColor(value: string): boolean {
  return (
    value.startsWith("#") ||
    value.startsWith("rgb") ||
    value.startsWith("hsl") ||
    value.startsWith("oklch")
  );
}

function Swatch({ color }: { color: string }) {
  if (!isColor(color)) return null;
  return <span className={styles.swatch} style={{ backgroundColor: color }} />;
}

function ChangedToken({ entry }: { entry: TokenDiffEntry }) {
  return (
    <div className={styles.tokenRow}>
      <div className={styles.tokenName}>{entry.name}</div>
      <div className={styles.tokenValues}>
        <Swatch color={entry.oldValue} />
        <span className={styles.tokenOld}>{entry.oldValue}</span>
        <span className={styles.tokenArrow}>→</span>
        <Swatch color={entry.newValue} />
        <span className={styles.tokenNew}>{entry.newValue}</span>
      </div>
    </div>
  );
}

export default function TokenInspector() {
  const { state, dispatch } = useProject();

  const variation = useMemo(
    () => state.variations.find((v) => v.id === state.inspectorTarget),
    [state.variations, state.inspectorTarget]
  );

  const diff = useMemo(() => {
    if (!state.baseTokens || !variation) return null;
    return diffTokenSets(state.baseTokens, variation.tokenSet);
  }, [state.baseTokens, variation]);

  const handleExportCss = useCallback(() => {
    if (!variation) return;
    const css = tokenSetToCss(variation.tokenSet);
    navigator.clipboard.writeText(css);
  }, [variation]);

  const handleExportJson = useCallback(() => {
    if (!variation) return;
    const json = JSON.stringify(variation.tokenSet.tokens, null, 2);
    navigator.clipboard.writeText(json);
  }, [variation]);

  if (!state.inspectorTarget || !variation || !diff) return null;

  const sortedCategories = Object.keys(diff.byCategory).sort(
    (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
  );

  return (
    <div className={styles.overlay}>
      <div className={styles.header}>
        <span className={styles.title}>Token Inspector</span>
        <button
          className={styles.closeButton}
          onClick={() =>
            dispatch({ type: "SET_INSPECTOR_TARGET", variationId: null })
          }
        >
          ×
        </button>
      </div>

      {variation.direction && (
        <div style={{ padding: "16px 20px 0" }}>
          <div className={styles.direction}>
            &ldquo;{variation.direction}&rdquo;
          </div>
        </div>
      )}

      <div className={styles.body}>
        <div className={styles.summary}>
          <span className={styles.summaryCount}>{diff.totalChanged}</span>{" "}
          token{diff.totalChanged !== 1 ? "s" : ""} changed out of{" "}
          {state.baseTokens?.tokens.length ?? 0}
        </div>

        {sortedCategories.map((category) => {
          const { changed } = diff.byCategory[category];
          if (changed.length === 0) return null;

          return (
            <div key={category} className={styles.categorySection}>
              <div className={styles.categoryHeader}>
                <span className={styles.categoryTitle}>{category}</span>
                <span className={styles.categoryCount}>
                  {changed.length} changed
                </span>
              </div>
              {changed.map((entry) => (
                <ChangedToken key={entry.name} entry={entry} />
              ))}
            </div>
          );
        })}
      </div>

      <div className={styles.exportArea}>
        <button className={styles.exportButton} onClick={handleExportCss}>
          Copy as CSS
        </button>
        <button className={styles.exportButton} onClick={handleExportJson}>
          Copy as JSON
        </button>
      </div>
    </div>
  );
}
