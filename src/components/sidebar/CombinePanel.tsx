"use client";

import { useState, useCallback, useMemo } from "react";
import { useProject } from "@/context/ProjectContext";
import { combineTokenSets, TOKEN_CATEGORIES, CombineRecipe } from "@/lib/tokens/combiner";
import { TokenSet } from "@/lib/types/token";
import { Variation } from "@/lib/types/project";
import styles from "./CombinePanel.module.css";

let combineCounter = 0;

export default function CombinePanel() {
  const { state, dispatch, getTokenSet } = useProject();
  const { selection, frames, combineMode, baseTokens } = state;

  const selectedFrames = useMemo(
    () => frames.filter((f) => selection.frameIds.includes(f.id)),
    [frames, selection.frameIds]
  );

  // Initialize recipe: all categories default to first selected frame's token set
  const defaultSourceId = selectedFrames[0]?.tokenSetId ?? "";
  const [recipe, setRecipe] = useState<CombineRecipe>(() => {
    const r: CombineRecipe = {};
    for (const cat of TOKEN_CATEGORIES) {
      r[cat] = defaultSourceId;
    }
    return r;
  });

  const handleToggleCombine = useCallback(() => {
    dispatch({ type: "TOGGLE_COMBINE_MODE" });
  }, [dispatch]);

  const handleCategoryChange = useCallback(
    (category: string, tokenSetId: string) => {
      setRecipe((prev) => ({ ...prev, [category]: tokenSetId }));
    },
    []
  );

  const handleCreate = useCallback(() => {
    if (!baseTokens) return;

    const tokenSetsMap = new Map<string, TokenSet>();
    for (const frame of selectedFrames) {
      const ts = getTokenSet(frame.tokenSetId);
      if (ts) tokenSetsMap.set(ts.id, ts);
    }

    const mergedTokens = combineTokenSets(recipe, tokenSetsMap, baseTokens);
    const id = `combine-${++combineCounter}`;

    const sourceLabels = Array.from(new Set(
      TOKEN_CATEGORIES.map((cat) => {
        const frame = selectedFrames.find((f) => f.tokenSetId === recipe[cat]);
        return frame?.label ?? "?";
      })
    ));

    const direction = `Combined: ${sourceLabels.join(" + ")}`;
    const tokenSet: TokenSet = {
      id: `tokens-${id}`,
      label: direction,
      tokens: mergedTokens,
      source: "generated",
      direction,
      parentId: baseTokens.id,
    };

    const variation: Variation = {
      id,
      direction,
      tokenSet,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: "ADD_VARIATION", variation });
    dispatch({ type: "TOGGLE_COMBINE_MODE" });
  }, [baseTokens, selectedFrames, recipe, getTokenSet, dispatch]);

  // Show combine button when 2+ frames selected but combine mode not active
  if (selectedFrames.length >= 2 && !combineMode) {
    return (
      <div className={styles.container}>
        <button className={styles.combineButton} onClick={handleToggleCombine}>
          Combine {selectedFrames.length} frames
        </button>
      </div>
    );
  }

  // Show combine panel when active
  if (!combineMode || selectedFrames.length < 2) return null;

  return (
    <div className={styles.container}>
      <div className={styles.title}>Combine</div>
      <p className={styles.hint}>
        Pick which frame to source each token category from.
      </p>
      <div className={styles.categories}>
        {TOKEN_CATEGORIES.map((category) => (
          <div key={category} className={styles.categoryRow}>
            <span className={styles.categoryLabel}>{category}</span>
            <select
              className={styles.select}
              value={recipe[category]}
              onChange={(e) => handleCategoryChange(category, e.target.value)}
            >
              {selectedFrames.map((frame) => (
                <option key={frame.id} value={frame.tokenSetId}>
                  {frame.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className={styles.actions}>
        <button className={styles.createButton} onClick={handleCreate}>
          Create combined frame
        </button>
        <button className={styles.cancelButton} onClick={handleToggleCombine}>
          Cancel
        </button>
      </div>
    </div>
  );
}
