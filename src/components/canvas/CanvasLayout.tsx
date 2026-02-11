"use client";

import Canvas from "./Canvas";
import CanvasHeader from "./CanvasHeader";
import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./CanvasLayout.module.css";

export default function CanvasLayout() {
  return (
    <div className={styles.page}>
      <CanvasHeader />
      <div className={styles.body}>
        <Canvas />
        <Sidebar />
      </div>
    </div>
  );
}
