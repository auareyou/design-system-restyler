"use client";

import { useCallback, useState, memo } from "react";
import { useProject } from "@/context/ProjectContext";
import { CanvasFrame as CanvasFrameType } from "@/lib/types/canvas";
import { FRAME_WIDTH } from "@/context/reducer";
import KitchenSink from "@/components/kitchen-sink/KitchenSink";
import FrameMenu from "./FrameMenu";
import styles from "./CanvasFrame.module.css";
import canvasStyles from "./Canvas.module.css";

interface Props {
  frame: CanvasFrameType;
}

function CanvasFrameComponent({ frame }: Props) {
  const { state, dispatch, getTokenSet } = useProject();
  const isSelected = state.selection.frameIds.includes(frame.id);
  const tokenSet = getTokenSet(frame.tokenSetId);
  const [isDragging, setIsDragging] = useState(false);
  const [localPos, setLocalPos] = useState(frame.position);

  // Sync local position when frame position changes externally
  const pos = isDragging ? localPos : frame.position;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch({
        type: "SELECT_FRAME",
        frameId: frame.id,
        additive: e.shiftKey,
      });
    },
    [dispatch, frame.id]
  );

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      // Don't drag from buttons or menu
      if ((e.target as HTMLElement).closest("button")) return;
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startY = e.clientY;
      const startPos = { ...frame.position };
      const zoom = state.viewport.zoom;

      setIsDragging(true);

      const handleMove = (moveEvent: MouseEvent) => {
        const dx = (moveEvent.clientX - startX) / zoom;
        const dy = (moveEvent.clientY - startY) / zoom;
        setLocalPos({ x: startPos.x + dx, y: startPos.y + dy });
      };

      const handleUp = () => {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleUp);
        setIsDragging(false);
        // Commit final position
        setLocalPos((current) => {
          dispatch({ type: "MOVE_FRAME", frameId: frame.id, position: current });
          return current;
        });
      };

      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleUp);
    },
    [frame.id, frame.position, state.viewport.zoom, dispatch]
  );

  if (!tokenSet) return null;

  return (
    <div
      className={`${canvasStyles.frame} ${styles.frame} ${isSelected ? styles.selected : ""} ${isDragging ? styles.dragging : ""}`}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: FRAME_WIDTH,
      }}
      onClick={handleClick}
    >
      <div
        className={styles.header}
        onMouseDown={handleDragStart}
      >
        <div className={styles.headerInfo}>
          <span className={styles.label}>{frame.label}</span>
          {frame.isBase && <span className={styles.badge}>Original</span>}
        </div>
        <FrameMenu frame={frame} />
      </div>
      <div className={styles.body}>
        <KitchenSink groups={state.components} tokenSet={tokenSet} />
      </div>
    </div>
  );
}

export default memo(CanvasFrameComponent);
