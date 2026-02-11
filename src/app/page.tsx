"use client";

import { useEffect } from "react";
import { useProject } from "@/context/ProjectContext";
import { primerComponents, primerBaseTokens } from "@/lib/mocks/github-primer";
import Comparator from "@/components/comparator/Comparator";
import VariationControls from "@/components/comparator/VariationControls";
import TokenInspector from "@/components/token-inspector/TokenInspector";
import styles from "./layout.module.css";

export default function Home() {
  const { state, dispatch } = useProject();

  // Initialize with mock data on mount
  useEffect(() => {
    if (!state.baseTokens) {
      dispatch({
        type: "INIT_PROJECT",
        components: primerComponents,
        tokens: primerBaseTokens,
        url: "https://primer.style/storybook/",
      });
    }
  }, [state.baseTokens, dispatch]);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.logoArea}>
          <div className={styles.logoMark}>R</div>
          <span className={styles.logoText}>
            Restyler
            <span className={styles.logoSub}>Design System Explorer</span>
          </span>
        </div>
        {state.storybookUrl && (
          <span className={styles.sourceTag}>
            {new URL(state.storybookUrl).hostname}
          </span>
        )}
      </header>

      {/* Variation controls */}
      <VariationControls />

      {/* Side-by-side comparator */}
      <Comparator />

      {/* Token inspector sidebar (renders when target is set) */}
      <TokenInspector />
    </main>
  );
}
