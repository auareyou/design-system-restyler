"use client";

import { useProject } from "@/context/ProjectContext";
import UrlInput from "@/components/url-input/UrlInput";
import Comparator from "@/components/comparator/Comparator";
import VariationControls from "@/components/comparator/VariationControls";
import TokenInspector from "@/components/token-inspector/TokenInspector";
import styles from "./layout.module.css";

export default function Home() {
  const { state } = useProject();

  const hasProject = state.baseTokens && state.components.length > 0;

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

      {!hasProject ? (
        /* Landing: URL input */
        <UrlInput />
      ) : (
        /* Workspace: controls + comparator */
        <>
          <VariationControls />
          <Comparator />
          <TokenInspector />
        </>
      )}
    </main>
  );
}
