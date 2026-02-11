"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useProject } from "@/context/ProjectContext";
import { inferLevers, applyLevers } from "@/lib/tokens/levers";
import LeverSlider from "./LeverSlider";
import styles from "./FrameLevers.module.css";

export default function FrameLevers() {
  const { state, dispatch, getTokenSet } = useProject();
  const { selection, frames, variations } = state;

  // Only show for single non-base frame selection
  const selectedFrame = selection.frameIds.length === 1
    ? frames.find((f) => f.id === selection.frameIds[0])
    : null;

  const variation = selectedFrame && !selectedFrame.isBase
    ? variations.find((v) => v.tokenSet.id === selectedFrame.tokenSetId)
    : null;

  const tokenSet = selectedFrame ? getTokenSet(selectedFrame.tokenSetId) : null;

  // Store the "pristine" token values (before lever adjustments)
  const pristineTokensRef = useRef(tokenSet?.tokens);

  // Update pristine ref when a different variation is selected
  useEffect(() => {
    if (tokenSet && variation) {
      // Only reset pristine when switching to a different variation
      pristineTokensRef.current = tokenSet.tokens;
    }
  }, [variation?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const levers = useMemo(
    () => (selectedFrame ? inferLevers(selectedFrame.prompt) : []),
    [selectedFrame]
  );

  const [leverValues, setLeverValues] = useState<Record<string, number>>({});

  // Reset lever values when selection changes
  useEffect(() => {
    setLeverValues({});
  }, [selection.frameIds[0]]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLeverChange = useCallback(
    (leverId: string, value: number) => {
      if (!variation || !pristineTokensRef.current) return;

      const newValues = { ...leverValues, [leverId]: value };
      setLeverValues(newValues);

      // Apply all levers from pristine tokens
      const adjusted = applyLevers(pristineTokensRef.current, levers, newValues);

      dispatch({
        type: "UPDATE_VARIATION_TOKENS",
        variationId: variation.id,
        tokens: { ...variation.tokenSet, tokens: adjusted },
      });
    },
    [variation, leverValues, levers, dispatch]
  );

  if (!selectedFrame || selectedFrame.isBase || !variation) return null;

  return (
    <div className={styles.container}>
      <div className={styles.title}>Adjust</div>
      <div className={styles.levers}>
        {levers.map((lever) => (
          <LeverSlider
            key={lever.id}
            label={lever.label}
            min={lever.min}
            max={lever.max}
            step={lever.step}
            value={leverValues[lever.id] ?? lever.defaultValue}
            defaultValue={lever.defaultValue}
            onChange={(val) => handleLeverChange(lever.id, val)}
          />
        ))}
      </div>
    </div>
  );
}
