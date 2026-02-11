"use client";

import UrlInput from "@/components/url-input/UrlInput";
import styles from "./layout.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.landing}>
        <div className={styles.landingHero}>
          <div className={styles.logoArea}>
            <div className={styles.logoMark}>R</div>
            <span className={styles.logoText}>
              Restyler
              <span className={styles.logoSub}>Design System Explorer</span>
            </span>
          </div>
        </div>
        <div className={styles.landingHero}>
          <h1 className={styles.landingTitle}>
            Explore visual directions for your design system
          </h1>
          <p className={styles.landingSubtitle}>
            Paste a Storybook URL to extract your components and tokens, then
            generate AI-powered style variations on a spatial canvas.
          </p>
        </div>
        <UrlInput />
      </div>
    </main>
  );
}
