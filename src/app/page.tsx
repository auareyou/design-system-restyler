"use client";

import { primerComponents, primerBaseTokens } from "@/lib/mocks/github-primer";
import KitchenSink from "@/components/kitchen-sink/KitchenSink";
import styles from "./layout.module.css";

export default function Home() {
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
        <span className={styles.sourceTag}>primer/react (mock)</span>
      </header>

      <KitchenSink
        groups={primerComponents}
        tokenSet={primerBaseTokens}
      />
    </main>
  );
}
