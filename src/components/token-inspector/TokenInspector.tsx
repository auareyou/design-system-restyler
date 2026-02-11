"use client";

import { useMemo, useCallback, useEffect } from "react";
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

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
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

  // Keyboard: Escape to close
  useEffect(() => {
    if (!state.inspectorTarget) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dispatch({ type: "SET_INSPECTOR_TARGET", variationId: null });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [state.inspectorTarget, dispatch]);

  const handleCopyCss = useCallback(() => {
    if (!variation) return;
    const css = tokenSetToCss(variation.tokenSet);
    navigator.clipboard.writeText(css);
  }, [variation]);

  const handleCopyJson = useCallback(() => {
    if (!variation) return;
    const json = JSON.stringify(variation.tokenSet.tokens, null, 2);
    navigator.clipboard.writeText(json);
  }, [variation]);

  const handleDownloadCss = useCallback(() => {
    if (!variation) return;
    const css = tokenSetToCss(variation.tokenSet);
    const slug = variation.direction
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
    downloadFile(css, `tokens-${slug || "variation"}.css`, "text/css");
  }, [variation]);

  const handleDownloadJson = useCallback(() => {
    if (!variation) return;
    const json = JSON.stringify(variation.tokenSet.tokens, null, 2);
    const slug = variation.direction
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
    downloadFile(json, `tokens-${slug || "variation"}.json`, "application/json");
  }, [variation]);

  if (!state.inspectorTarget || !variation || !diff) return null;

  const sortedCategories = Object.keys(diff.byCategory).sort(
    (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
  );

  return (
    <div className={styles.overlay}>
      <div className={styles.header}>
        <span className={styles.title}>Token Inspector</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span className={styles.hint}>esc</span>
          <button
            className={styles.closeButton}
            onClick={() =>
              dispatch({ type: "SET_INSPECTOR_TARGET", variationId: null })
            }
          >
            ×
          </button>
        </div>
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
        <div className={styles.exportRow}>
          <button className={styles.exportButton} onClick={handleCopyCss}>
            Copy CSS
          </button>
          <button className={styles.exportButton} onClick={handleCopyJson}>
            Copy JSON
          </button>
        </div>
        <div className={styles.exportRow}>
          <button className={styles.exportButtonPrimary} onClick={handleDownloadCss}>
            ↓ Download .css
          </button>
          <button className={styles.exportButtonPrimary} onClick={handleDownloadJson}>
            ↓ Download .json
          </button>
        </div>
      </div>
    </div>
  );
}
