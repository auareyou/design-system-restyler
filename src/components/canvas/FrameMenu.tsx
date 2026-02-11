"use client";

import { useState, useCallback } from "react";
import { useProject } from "@/context/ProjectContext";
import { CanvasFrame } from "@/lib/types/canvas";
import { tokenSetToCss } from "@/lib/tokens/serializer";
import styles from "./FrameMenu.module.css";

interface Props {
  frame: CanvasFrame;
}

export default function FrameMenu({ frame }: Props) {
  const { state, dispatch, getTokenSet } = useProject();
  const [open, setOpen] = useState(false);

  const tokenSet = getTokenSet(frame.tokenSetId);

  const handleDelete = useCallback(() => {
    if (frame.isBase) return;
    const variation = state.variations.find(
      (v) => v.tokenSet.id === frame.tokenSetId
    );
    if (variation) {
      dispatch({ type: "REMOVE_VARIATION", variationId: variation.id });
    }
    setOpen(false);
  }, [frame, state.variations, dispatch]);

  const handleExportCss = useCallback(() => {
    if (!tokenSet) return;
    const css = tokenSetToCss(tokenSet);
    navigator.clipboard.writeText(css);
    setOpen(false);
  }, [tokenSet]);

  const handleExportJson = useCallback(() => {
    if (!tokenSet) return;
    const json = JSON.stringify(tokenSet.tokens, null, 2);
    navigator.clipboard.writeText(json);
    setOpen(false);
  }, [tokenSet]);

  const handleDuplicate = useCallback(() => {
    if (!tokenSet) return;
    const newId = `dup-${Date.now()}`;
    const newVariation = {
      id: newId,
      direction: `${frame.label} (copy)`,
      tokenSet: {
        ...tokenSet,
        id: `ts-${newId}`,
        label: `${tokenSet.label} (copy)`,
        source: "generated" as const,
      },
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_VARIATION", variation: newVariation });
    setOpen(false);
  }, [frame.label, tokenSet, dispatch]);

  return (
    <div className={styles.container}>
      <button
        className={styles.trigger}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        ...
      </button>
      {open && (
        <>
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
          <div className={styles.menu}>
            <button className={styles.menuItem} onClick={handleDuplicate}>
              Duplicate
            </button>
            <button className={styles.menuItem} onClick={handleExportCss}>
              Copy CSS
            </button>
            <button className={styles.menuItem} onClick={handleExportJson}>
              Copy JSON
            </button>
            {!frame.isBase && (
              <button
                className={`${styles.menuItem} ${styles.danger}`}
                onClick={handleDelete}
              >
                Delete
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
