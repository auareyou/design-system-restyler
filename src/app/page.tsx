"use client";

import { useProject } from "@/context/ProjectContext";
import UrlInput from "@/components/url-input/UrlInput";
import Comparator from "@/components/comparator/Comparator";
import VariationControls from "@/components/comparator/VariationControls";
import TokenInspector from "@/components/token-inspector/TokenInspector";
import ErrorBoundary from "@/components/error-boundary/ErrorBoundary";
import styles from "./layout.module.css";

function LandingPage() {
  return (
    <div className={styles.landing}>
      <div className={styles.landingHero}>
        <h1 className={styles.landingTitle}>
          Explore visual directions for your design system
        </h1>
        <p className={styles.landingSubtitle}>
          Paste a Storybook URL to extract your components and tokens, then
          generate AI-powered style variations to see how your system could
          evolve.
        </p>
      </div>
      <UrlInput />
      <div className={styles.landingFeatures}>
        <div className={styles.landingFeature}>
          <div className={styles.featureNumber}>1</div>
          <div className={styles.featureText}>
            <strong>Extract</strong> — Point at a Storybook instance and
            automatically pull components and design tokens
          </div>
        </div>
        <div className={styles.landingFeature}>
          <div className={styles.featureNumber}>2</div>
          <div className={styles.featureText}>
            <strong>Generate</strong> — Describe a visual direction and let AI
            remap your token palette
          </div>
        </div>
        <div className={styles.landingFeature}>
          <div className={styles.featureNumber}>3</div>
          <div className={styles.featureText}>
            <strong>Compare</strong> — See original and restyled components
            side by side in a kitchen sink view
          </div>
        </div>
      </div>
    </div>
  );
}

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
        <LandingPage />
      ) : (
        <ErrorBoundary fallbackMessage="Something went wrong rendering the workspace. Try reloading the page.">
          <VariationControls />
          <Comparator />
          <TokenInspector />
        </ErrorBoundary>
      )}
    </main>
  );
}
