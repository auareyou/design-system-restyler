"use client";

import { useState, useCallback } from "react";
import { useProject } from "@/context/ProjectContext";
import { cssToTokens } from "@/lib/tokens/serializer";
import { Token, TokenSet } from "@/lib/types/token";
import { Variation } from "@/lib/types/project";
import styles from "./VariationControls.module.css";

let variationCounter = 0;

function mergeTokens(base: Token[], overrides: Token[]): Token[] {
  const overrideMap = new Map(overrides.map((t) => [t.name, t.value]));
  return base.map((token) => ({
    ...token,
    value: overrideMap.get(token.name) ?? token.value,
  }));
}

const CSS_PRESETS: { label: string; direction: string; css: string }[] = [
  {
    label: "Dark mode",
    direction: "Dark mode",
    css: `--color-canvas-default: #0d1117;
--color-canvas-subtle: #161b22;
--color-canvas-inset: #010409;
--color-canvas-overlay: #1c2128;
--color-fg-default: #e6edf3;
--color-fg-muted: #8b949e;
--color-fg-subtle: #6e7681;
--color-fg-on-emphasis: #ffffff;
--color-border-default: #30363d;
--color-border-muted: #21262d;
--color-border-subtle: rgba(240,246,252,0.1);
--color-accent-fg: #58a6ff;
--color-accent-emphasis: #1f6feb;
--color-accent-muted: rgba(56,139,253,0.4);
--color-accent-subtle: rgba(56,139,253,0.1);
--color-success-fg: #3fb950;
--color-success-emphasis: #238636;
--color-success-subtle: rgba(46,160,67,0.15);
--color-danger-fg: #f85149;
--color-danger-emphasis: #da3633;
--color-danger-subtle: rgba(248,81,73,0.1);
--color-warning-fg: #d29922;
--color-warning-emphasis: #9e6a03;
--color-warning-subtle: rgba(187,128,9,0.15);
--color-neutral-emphasis-plus: #6e7681;
--color-neutral-emphasis: #6e7681;
--color-neutral-muted: rgba(110,118,129,0.4);
--color-neutral-subtle: rgba(110,118,129,0.1);
--color-btn-bg: #21262d;
--color-btn-border: rgba(240,246,252,0.1);
--color-btn-hover-bg: #30363d;
--color-btn-primary-bg: #238636;
--color-btn-primary-hover-bg: #2ea043;
--color-btn-primary-text: #ffffff;
--color-btn-danger-bg: #da3633;
--color-btn-danger-hover-bg: #b62324;
--shadow-sm: 0 0 transparent;
--shadow-md: 0 3px 6px rgba(0,0,0,0.3);
--shadow-lg: 0 8px 24px rgba(0,0,0,0.4);
--shadow-xl: 0 12px 28px rgba(0,0,0,0.5);`,
  },
  {
    label: "Warm & rounded",
    direction: "Warmer palette, more rounded, softer",
    css: `--color-canvas-default: #fffbf5;
--color-canvas-subtle: #fef7ee;
--color-canvas-inset: #fdf2e4;
--color-canvas-overlay: #ffffff;
--color-fg-default: #3d2c1e;
--color-fg-muted: #8a7462;
--color-fg-subtle: #a69480;
--color-border-default: #e6d5c3;
--color-border-muted: #f0e2d0;
--color-border-subtle: #f5ece0;
--color-accent-fg: #c26522;
--color-accent-emphasis: #c26522;
--color-accent-muted: rgba(194,101,34,0.3);
--color-accent-subtle: #fff0e0;
--color-success-fg: #4a8c3f;
--color-success-emphasis: #4a8c3f;
--color-success-subtle: #edf7eb;
--color-danger-fg: #c93c3c;
--color-danger-emphasis: #c93c3c;
--color-danger-subtle: #fef0f0;
--color-warning-fg: #b8860b;
--color-warning-emphasis: #b8860b;
--color-warning-subtle: #fff8e7;
--color-btn-bg: #fef7ee;
--color-btn-border: rgba(61,44,30,0.12);
--color-btn-hover-bg: #fdf2e4;
--color-btn-primary-bg: #c26522;
--color-btn-primary-hover-bg: #a8561d;
--color-btn-primary-text: #ffffff;
--color-btn-danger-bg: #c93c3c;
--color-btn-danger-hover-bg: #a83232;
--radius-1: 6px;
--radius-2: 12px;
--radius-3: 20px;
--shadow-sm: 0 1px 3px rgba(61,44,30,0.06);
--shadow-md: 0 4px 12px rgba(61,44,30,0.08);
--shadow-lg: 0 8px 24px rgba(61,44,30,0.1);`,
  },
  {
    label: "High contrast",
    direction: "Maximum contrast, bold, accessible",
    css: `--color-canvas-default: #ffffff;
--color-canvas-subtle: #f0f0f0;
--color-canvas-inset: #e8e8e8;
--color-canvas-overlay: #ffffff;
--color-fg-default: #000000;
--color-fg-muted: #333333;
--color-fg-subtle: #555555;
--color-fg-on-emphasis: #ffffff;
--color-border-default: #000000;
--color-border-muted: #666666;
--color-border-subtle: #cccccc;
--color-accent-fg: #0550ae;
--color-accent-emphasis: #0550ae;
--color-accent-muted: rgba(5,80,174,0.4);
--color-accent-subtle: #dce9f8;
--color-success-fg: #116329;
--color-success-emphasis: #116329;
--color-success-subtle: #d4edda;
--color-danger-fg: #a40e26;
--color-danger-emphasis: #a40e26;
--color-danger-subtle: #f8d7da;
--color-warning-fg: #6a4700;
--color-warning-emphasis: #6a4700;
--color-warning-subtle: #fff3cd;
--color-btn-bg: #f0f0f0;
--color-btn-border: #000000;
--color-btn-primary-bg: #0550ae;
--color-btn-primary-text: #ffffff;
--color-btn-danger-bg: #a40e26;
--border-width: 2px;
--font-weight-semibold: 700;
--font-weight-bold: 800;`,
  },
  {
    label: "Monochrome",
    direction: "Monochrome, desaturated, editorial",
    css: `--color-canvas-default: #fafafa;
--color-canvas-subtle: #f2f2f2;
--color-canvas-inset: #eaeaea;
--color-canvas-overlay: #ffffff;
--color-fg-default: #171717;
--color-fg-muted: #6b6b6b;
--color-fg-subtle: #8a8a8a;
--color-fg-on-emphasis: #ffffff;
--color-border-default: #d4d4d4;
--color-border-muted: #e0e0e0;
--color-border-subtle: #ebebeb;
--color-accent-fg: #171717;
--color-accent-emphasis: #171717;
--color-accent-muted: rgba(23,23,23,0.2);
--color-accent-subtle: #f2f2f2;
--color-success-fg: #4a4a4a;
--color-success-emphasis: #4a4a4a;
--color-success-subtle: #f2f2f2;
--color-danger-fg: #6b6b6b;
--color-danger-emphasis: #4a4a4a;
--color-danger-subtle: #f2f2f2;
--color-warning-fg: #6b6b6b;
--color-warning-emphasis: #6b6b6b;
--color-warning-subtle: #f2f2f2;
--color-neutral-emphasis-plus: #171717;
--color-neutral-emphasis: #6b6b6b;
--color-neutral-muted: rgba(23,23,23,0.08);
--color-neutral-subtle: rgba(23,23,23,0.04);
--color-btn-bg: #f2f2f2;
--color-btn-border: rgba(23,23,23,0.15);
--color-btn-hover-bg: #e8e8e8;
--color-btn-primary-bg: #171717;
--color-btn-primary-hover-bg: #333333;
--color-btn-primary-text: #ffffff;
--color-btn-danger-bg: #4a4a4a;
--color-btn-danger-hover-bg: #333333;
--radius-1: 0px;
--radius-2: 0px;
--radius-3: 0px;
--radius-full: 0px;`,
  },
];

export default function VariationControls() {
  const { state, dispatch } = useProject();
  const [cssText, setCssText] = useState("");
  const [label, setLabel] = useState("");
  const [aiDirection, setAiDirection] = useState("");
  const [aiBrandContext, setAiBrandContext] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showBrandContext, setShowBrandContext] = useState(false);
  const [showManual, setShowManual] = useState(false);

  const createVariation = useCallback(
    (direction: string, overrideCss: string, customLabel?: string) => {
      if (!state.baseTokens) return;

      const parsedOverrides = cssToTokens(overrideCss);
      if (parsedOverrides.length === 0) return;

      const mergedTokens = mergeTokens(state.baseTokens.tokens, parsedOverrides);
      const id = `variation-${++variationCounter}`;

      const tokenSet: TokenSet = {
        id: `tokens-${id}`,
        label: customLabel ?? direction,
        tokens: mergedTokens,
        source: "generated",
        direction,
        parentId: state.baseTokens.id,
      };

      const variation: Variation = {
        id,
        direction,
        tokenSet,
        createdAt: new Date().toISOString(),
      };

      dispatch({ type: "ADD_VARIATION", variation });
      setCssText("");
      setLabel("");
    },
    [state.baseTokens, dispatch]
  );

  const handleAiGenerate = useCallback(async () => {
    if (!state.baseTokens || !aiDirection.trim()) return;

    setAiLoading(true);
    setAiError(null);

    try {
      const res = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseTokens: state.baseTokens,
          direction: aiDirection.trim(),
          brandContext: aiBrandContext.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      const tokenSet: TokenSet = data.variation;
      const id = `variation-${++variationCounter}`;

      const variation: Variation = {
        id,
        direction: aiDirection.trim(),
        tokenSet: { ...tokenSet, id: `tokens-${id}` },
        createdAt: new Date().toISOString(),
        brandContext: aiBrandContext.trim() || undefined,
      };

      dispatch({ type: "ADD_VARIATION", variation });
      setAiDirection("");
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setAiLoading(false);
    }
  }, [state.baseTokens, aiDirection, aiBrandContext, dispatch]);

  const handleApplyCustom = useCallback(() => {
    createVariation(label || "Custom override", cssText, label || undefined);
  }, [cssText, label, createVariation]);

  const handlePreset = useCallback(
    (preset: (typeof CSS_PRESETS)[0]) => {
      createVariation(preset.direction, preset.css, preset.label);
    },
    [createVariation]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && !aiLoading && aiDirection.trim()) {
        e.preventDefault();
        handleAiGenerate();
      }
    },
    [aiLoading, aiDirection, handleAiGenerate]
  );

  return (
    <div className={styles.container}>
      {/* AI Direction input — primary action */}
      <div>
        <div className={styles.sectionTitle}>Visual direction</div>
        <div className={styles.inputRow}>
          <input
            className={styles.textInput}
            type="text"
            placeholder="e.g. &quot;dark mode with a tint of blue&quot; or &quot;more expressive, rounder, warmer&quot;"
            value={aiDirection}
            onChange={(e) => setAiDirection(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={aiLoading}
          />
          <button
            className={styles.submitButton}
            disabled={aiLoading || !aiDirection.trim()}
            onClick={handleAiGenerate}
          >
            {aiLoading ? (
              <>
                <span className={styles.spinner} />
                Generating...
              </>
            ) : (
              "Generate"
            )}
          </button>
        </div>

        {/* Brand context toggle */}
        <div style={{ marginTop: 8 }}>
          <button
            className={styles.toggleLink}
            onClick={() => setShowBrandContext(!showBrandContext)}
          >
            {showBrandContext ? "- Hide brand context" : "+ Add brand context"}
          </button>
          {showBrandContext && (
            <textarea
              className={styles.textarea}
              style={{ marginTop: 8, minHeight: 80 }}
              placeholder="Paste brand guidelines, color references, or describe the brand personality..."
              value={aiBrandContext}
              onChange={(e) => setAiBrandContext(e.target.value)}
              disabled={aiLoading}
            />
          )}
        </div>

        {aiError && (
          <div className={styles.errorMessage}>{aiError}</div>
        )}
      </div>

      {/* Presets */}
      <div>
        <div className={styles.sectionTitle}>Quick presets</div>
        <div className={styles.presets}>
          {CSS_PRESETS.map((preset) => (
            <button
              key={preset.label}
              className={styles.preset}
              onClick={() => handlePreset(preset)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Manual CSS toggle */}
      <div>
        <button
          className={styles.toggleLink}
          onClick={() => setShowManual(!showManual)}
        >
          {showManual ? "- Hide manual CSS input" : "+ Paste custom CSS tokens"}
        </button>

        {showManual && (
          <div style={{ marginTop: 12 }}>
            <div className={styles.inputRow} style={{ marginBottom: 8 }}>
              <input
                className={styles.textInput}
                type="text"
                placeholder="Label (e.g. &quot;Blue tint dark mode&quot;)"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>
            <textarea
              className={styles.textarea}
              placeholder={`Paste CSS custom properties:\n\n--color-canvas-default: #0d1117;\n--color-fg-default: #e6edf3;\n--radius-2: 12px;`}
              value={cssText}
              onChange={(e) => setCssText(e.target.value)}
            />
            <button
              className={styles.applyButton}
              disabled={cssText.trim().length === 0}
              onClick={handleApplyCustom}
              style={{ marginTop: 8 }}
            >
              Apply as variation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
