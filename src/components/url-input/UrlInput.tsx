"use client";

import { useState, useCallback } from "react";
import { useProject } from "@/context/ProjectContext";
import { primerComponents, primerBaseTokens } from "@/lib/mocks/github-primer";
import styles from "./UrlInput.module.css";

interface ScrapeProgress {
  phase: string;
  done: number;
  total: number;
}

const PHASE_LABELS: Record<string, string> = {
  fetching_index: "Fetching story index",
  extracting_stories: "Extracting components",
  building_tokens: "Building token set",
};

export default function UrlInput() {
  const { dispatch } = useProject();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<ScrapeProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScrape = useCallback(async () => {
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setProgress(null);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      // Read SSE stream
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Parse SSE events from buffer
        const events = buffer.split("\n\n");
        buffer = events.pop() || ""; // Keep incomplete event in buffer

        for (const event of events) {
          const lines = event.split("\n");
          let eventType = "";
          let eventData = "";

          for (const line of lines) {
            if (line.startsWith("event: ")) eventType = line.slice(7);
            if (line.startsWith("data: ")) eventData = line.slice(6);
          }

          if (!eventType || !eventData) continue;

          const data = JSON.parse(eventData);

          if (eventType === "progress") {
            setProgress(data);
          } else if (eventType === "complete") {
            dispatch({
              type: "INIT_PROJECT",
              components: data.components,
              tokens: data.tokens,
              url: url.trim(),
            });
            setLoading(false);
            return;
          } else if (eventType === "error") {
            throw new Error(data.message);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }, [url, dispatch]);

  const handleLoadMock = useCallback(() => {
    dispatch({
      type: "INIT_PROJECT",
      components: primerComponents,
      tokens: primerBaseTokens,
      url: "https://primer.style/storybook/",
    });
  }, [dispatch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !loading) {
        handleScrape();
      }
    },
    [loading, handleScrape]
  );

  const progressPercent =
    progress && progress.total > 0
      ? Math.round((progress.done / progress.total) * 100)
      : 0;

  return (
    <div className={styles.container}>
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="url"
          placeholder="Paste a Storybook URL (e.g. https://primer.style/storybook/)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className={styles.button}
          onClick={handleScrape}
          disabled={loading || !url.trim()}
        >
          {loading ? "Scraping..." : "Scrape"}
        </button>
      </div>

      {loading && progress && (
        <div className={styles.progress}>
          <div className={styles.progressLabel}>
            {PHASE_LABELS[progress.phase] || progress.phase}
            {progress.total > 1 && ` (${progress.done}/${progress.total})`}
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.mockNote}>
        <span>or</span>
        <button className={styles.mockButton} onClick={handleLoadMock}>
          Load GitHub Primer mock data
        </button>
        <span>to try the tool without scraping</span>
      </div>
    </div>
  );
}
