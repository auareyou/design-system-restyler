import { ComponentGroup } from "../types/component";
import { TokenSet } from "../types/token";

/**
 * Mock data representing GitHub's Primer design system.
 * All HTML uses CSS custom properties so the kitchen sink
 * can be restyled by swapping token values.
 */

// ─── BASE TOKEN SET (Primer Light) ────────────────────────────────

export const primerBaseTokens: TokenSet = {
  id: "primer-light",
  label: "Primer Light (Original)",
  source: "extracted",
  tokens: [
    // ── Canvas / Background ──
    { name: "--color-canvas-default", value: "#ffffff", category: "color" },
    { name: "--color-canvas-subtle", value: "#f6f8fa", category: "color" },
    { name: "--color-canvas-inset", value: "#eff2f5", category: "color" },
    { name: "--color-canvas-overlay", value: "#ffffff", category: "color" },

    // ── Foreground / Text ──
    { name: "--color-fg-default", value: "#1f2328", category: "color" },
    { name: "--color-fg-muted", value: "#656d76", category: "color" },
    { name: "--color-fg-subtle", value: "#6e7781", category: "color" },
    { name: "--color-fg-on-emphasis", value: "#ffffff", category: "color" },

    // ── Border ──
    { name: "--color-border-default", value: "#d0d7de", category: "color" },
    { name: "--color-border-muted", value: "#d8dee4", category: "color" },
    { name: "--color-border-subtle", value: "#eaeef2", category: "color" },

    // ── Accent ──
    { name: "--color-accent-fg", value: "#0969da", category: "color" },
    { name: "--color-accent-emphasis", value: "#0969da", category: "color" },
    { name: "--color-accent-muted", value: "rgba(84,174,255,0.4)", category: "color" },
    { name: "--color-accent-subtle", value: "#ddf4ff", category: "color" },

    // ── Success ──
    { name: "--color-success-fg", value: "#1a7f37", category: "color" },
    { name: "--color-success-emphasis", value: "#1f883d", category: "color" },
    { name: "--color-success-subtle", value: "#dafbe1", category: "color" },

    // ── Danger ──
    { name: "--color-danger-fg", value: "#d1242f", category: "color" },
    { name: "--color-danger-emphasis", value: "#cf222e", category: "color" },
    { name: "--color-danger-subtle", value: "#ffebe9", category: "color" },

    // ── Warning ──
    { name: "--color-warning-fg", value: "#9a6700", category: "color" },
    { name: "--color-warning-emphasis", value: "#bf8700", category: "color" },
    { name: "--color-warning-subtle", value: "#fff8c5", category: "color" },

    // ── Neutral ──
    { name: "--color-neutral-emphasis-plus", value: "#24292f", category: "color" },
    { name: "--color-neutral-emphasis", value: "#6e7781", category: "color" },
    { name: "--color-neutral-muted", value: "rgba(175,184,193,0.2)", category: "color" },
    { name: "--color-neutral-subtle", value: "rgba(234,238,242,0.5)", category: "color" },

    // ── Button ──
    { name: "--color-btn-bg", value: "#f6f8fa", category: "color" },
    { name: "--color-btn-border", value: "rgba(31,35,40,0.15)", category: "color" },
    { name: "--color-btn-hover-bg", value: "#f3f4f6", category: "color" },
    { name: "--color-btn-primary-bg", value: "#1f883d", category: "color" },
    { name: "--color-btn-primary-hover-bg", value: "#1a7f37", category: "color" },
    { name: "--color-btn-primary-text", value: "#ffffff", category: "color" },
    { name: "--color-btn-danger-bg", value: "#cf222e", category: "color" },
    { name: "--color-btn-danger-hover-bg", value: "#a40e26", category: "color" },

    // ── Spacing ──
    { name: "--spacing-0", value: "0", category: "spacing" },
    { name: "--spacing-1", value: "4px", category: "spacing" },
    { name: "--spacing-2", value: "8px", category: "spacing" },
    { name: "--spacing-3", value: "16px", category: "spacing" },
    { name: "--spacing-4", value: "24px", category: "spacing" },
    { name: "--spacing-5", value: "32px", category: "spacing" },
    { name: "--spacing-6", value: "40px", category: "spacing" },

    // ── Radius ──
    { name: "--radius-1", value: "3px", category: "radius" },
    { name: "--radius-2", value: "6px", category: "radius" },
    { name: "--radius-3", value: "12px", category: "radius" },
    { name: "--radius-full", value: "100px", category: "radius" },

    // ── Shadow ──
    { name: "--shadow-sm", value: "0 1px 0 rgba(31,35,40,0.04)", category: "shadow" },
    { name: "--shadow-md", value: "0 3px 6px rgba(140,149,159,0.15)", category: "shadow" },
    { name: "--shadow-lg", value: "0 8px 24px rgba(140,149,159,0.2)", category: "shadow" },
    { name: "--shadow-xl", value: "0 12px 28px rgba(140,149,159,0.3)", category: "shadow" },

    // ── Typography ──
    { name: "--font-family", value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif", category: "typography" },
    { name: "--font-family-mono", value: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace", category: "typography" },
    { name: "--font-size-sm", value: "12px", category: "typography" },
    { name: "--font-size-md", value: "14px", category: "typography" },
    { name: "--font-size-lg", value: "16px", category: "typography" },
    { name: "--font-size-xl", value: "20px", category: "typography" },
    { name: "--font-size-xxl", value: "26px", category: "typography" },
    { name: "--font-weight-normal", value: "400", category: "typography" },
    { name: "--font-weight-semibold", value: "600", category: "typography" },
    { name: "--font-weight-bold", value: "700", category: "typography" },
    { name: "--line-height-default", value: "1.5", category: "typography" },
    { name: "--line-height-tight", value: "1.25", category: "typography" },

    // ── Border ──
    { name: "--border-width", value: "1px", category: "border" },
    { name: "--border-style", value: "solid", category: "border" },

    // ── Transition ──
    { name: "--duration-fast", value: "80ms", category: "transition" },
    { name: "--duration-normal", value: "160ms", category: "transition" },
    { name: "--easing-default", value: "cubic-bezier(0.33, 1, 0.68, 1)", category: "transition" },
  ],
};

// ─── SHARED STYLES (injected once, referenced by all components) ──

const sharedStyles = `
  /* Reset inside previews */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* Base text */
  .ds-root {
    font-family: var(--font-family);
    font-size: var(--font-size-md);
    line-height: var(--line-height-default);
    color: var(--color-fg-default);
    -webkit-font-smoothing: antialiased;
  }
`;

// ─── COMPONENT HTML ───────────────────────────────────────────────

const buttonHtml = `
<div class="ds-root" style="display: flex; gap: var(--spacing-3); flex-wrap: wrap; align-items: flex-start;">
  <!-- Primary -->
  <button style="
    display: inline-flex; align-items: center; justify-content: center;
    padding: 5px 16px; font-size: var(--font-size-md);
    font-weight: var(--font-weight-semibold); font-family: var(--font-family);
    line-height: 20px; cursor: pointer;
    border: var(--border-width) var(--border-style) rgba(31,35,40,0.15);
    border-radius: var(--radius-2);
    background-color: var(--color-btn-primary-bg);
    color: var(--color-btn-primary-text);
    box-shadow: var(--shadow-sm);
    transition: background-color var(--duration-fast) var(--easing-default);
  ">Primary</button>

  <!-- Default -->
  <button style="
    display: inline-flex; align-items: center; justify-content: center;
    padding: 5px 16px; font-size: var(--font-size-md);
    font-weight: var(--font-weight-semibold); font-family: var(--font-family);
    line-height: 20px; cursor: pointer;
    border: var(--border-width) var(--border-style) var(--color-btn-border);
    border-radius: var(--radius-2);
    background-color: var(--color-btn-bg);
    color: var(--color-fg-default);
    box-shadow: var(--shadow-sm);
  ">Default</button>

  <!-- Danger -->
  <button style="
    display: inline-flex; align-items: center; justify-content: center;
    padding: 5px 16px; font-size: var(--font-size-md);
    font-weight: var(--font-weight-semibold); font-family: var(--font-family);
    line-height: 20px; cursor: pointer;
    border: var(--border-width) var(--border-style) rgba(31,35,40,0.15);
    border-radius: var(--radius-2);
    background-color: var(--color-btn-danger-bg);
    color: var(--color-fg-on-emphasis);
    box-shadow: var(--shadow-sm);
  ">Danger</button>

  <!-- Outline -->
  <button style="
    display: inline-flex; align-items: center; justify-content: center;
    padding: 5px 16px; font-size: var(--font-size-md);
    font-weight: var(--font-weight-semibold); font-family: var(--font-family);
    line-height: 20px; cursor: pointer;
    border: var(--border-width) var(--border-style) var(--color-accent-fg);
    border-radius: var(--radius-2);
    background-color: transparent;
    color: var(--color-accent-fg);
  ">Outline</button>

  <!-- Disabled -->
  <button disabled style="
    display: inline-flex; align-items: center; justify-content: center;
    padding: 5px 16px; font-size: var(--font-size-md);
    font-weight: var(--font-weight-semibold); font-family: var(--font-family);
    line-height: 20px; cursor: not-allowed; opacity: 0.5;
    border: var(--border-width) var(--border-style) var(--color-btn-border);
    border-radius: var(--radius-2);
    background-color: var(--color-btn-bg);
    color: var(--color-fg-default);
  ">Disabled</button>

  <!-- Small -->
  <button style="
    display: inline-flex; align-items: center; justify-content: center;
    padding: 3px 12px; font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold); font-family: var(--font-family);
    line-height: 20px; cursor: pointer;
    border: var(--border-width) var(--border-style) var(--color-btn-border);
    border-radius: var(--radius-2);
    background-color: var(--color-btn-bg);
    color: var(--color-fg-default);
    box-shadow: var(--shadow-sm);
  ">Small</button>

  <!-- Large -->
  <button style="
    display: inline-flex; align-items: center; justify-content: center;
    padding: 10px 24px; font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold); font-family: var(--font-family);
    line-height: 24px; cursor: pointer;
    border: var(--border-width) var(--border-style) rgba(31,35,40,0.15);
    border-radius: var(--radius-2);
    background-color: var(--color-btn-primary-bg);
    color: var(--color-btn-primary-text);
    box-shadow: var(--shadow-sm);
  ">Large</button>
</div>
`;

const inputHtml = `
<div class="ds-root" style="display: flex; flex-direction: column; gap: var(--spacing-4); max-width: 400px;">
  <!-- Standard input -->
  <div>
    <label style="
      display: block; font-size: var(--font-size-md); font-weight: var(--font-weight-semibold);
      color: var(--color-fg-default); margin-bottom: var(--spacing-1);
    ">Input label <span style="color: var(--color-danger-fg);">*</span></label>
    <input type="text" placeholder="Placeholder here..." style="
      width: 100%; padding: 5px 12px; font-size: var(--font-size-md);
      font-family: var(--font-family);
      line-height: 20px; color: var(--color-fg-default);
      background-color: var(--color-canvas-default);
      border: var(--border-width) var(--border-style) var(--color-border-default);
      border-radius: var(--radius-2);
      outline: none;
      box-shadow: inset 0 1px 0 rgba(208,215,222,0.2);
    " />
    <p style="
      font-size: var(--font-size-sm); color: var(--color-fg-muted);
      margin-top: var(--spacing-1);
    ">Helper text or footnote</p>
  </div>

  <!-- Validation error -->
  <div>
    <label style="
      display: block; font-size: var(--font-size-md); font-weight: var(--font-weight-semibold);
      color: var(--color-fg-default); margin-bottom: var(--spacing-1);
    ">Email address</label>
    <input type="email" value="not-an-email" style="
      width: 100%; padding: 5px 12px; font-size: var(--font-size-md);
      font-family: var(--font-family);
      line-height: 20px; color: var(--color-fg-default);
      background-color: var(--color-canvas-default);
      border: var(--border-width) var(--border-style) var(--color-danger-fg);
      border-radius: var(--radius-2);
      outline: none;
    " />
    <p style="
      font-size: var(--font-size-sm); color: var(--color-danger-fg);
      margin-top: var(--spacing-1);
    ">Please enter a valid email address</p>
  </div>

  <!-- Textarea -->
  <div>
    <label style="
      display: block; font-size: var(--font-size-md); font-weight: var(--font-weight-semibold);
      color: var(--color-fg-default); margin-bottom: var(--spacing-1);
    ">Description</label>
    <textarea rows="3" placeholder="Leave a comment..." style="
      width: 100%; padding: 8px 12px; font-size: var(--font-size-md);
      font-family: var(--font-family);
      line-height: var(--line-height-default); color: var(--color-fg-default);
      background-color: var(--color-canvas-default);
      border: var(--border-width) var(--border-style) var(--color-border-default);
      border-radius: var(--radius-2);
      outline: none; resize: vertical;
    "></textarea>
  </div>
</div>
`;

const checkboxRadioHtml = `
<div class="ds-root" style="display: flex; gap: var(--spacing-6);">
  <!-- Checkboxes -->
  <div style="display: flex; flex-direction: column; gap: var(--spacing-2);">
    <label style="display: flex; align-items: center; gap: var(--spacing-2); font-size: var(--font-size-md); color: var(--color-fg-default); cursor: pointer;">
      <span style="
        width: 16px; height: 16px; border-radius: var(--radius-1);
        border: var(--border-width) var(--border-style) var(--color-border-default);
        background: var(--color-canvas-default);
        display: inline-flex; align-items: center; justify-content: center;
      "></span>
      Item 1
    </label>
    <label style="display: flex; align-items: center; gap: var(--spacing-2); font-size: var(--font-size-md); color: var(--color-fg-default); cursor: pointer;">
      <span style="
        width: 16px; height: 16px; border-radius: var(--radius-1);
        border: var(--border-width) var(--border-style) var(--color-accent-emphasis);
        background: var(--color-accent-emphasis);
        display: inline-flex; align-items: center; justify-content: center;
        color: var(--color-fg-on-emphasis); font-size: 11px;
      ">&#10003;</span>
      Item 2
    </label>
    <label style="display: flex; align-items: center; gap: var(--spacing-2); font-size: var(--font-size-md); color: var(--color-fg-default); cursor: pointer;">
      <span style="
        width: 16px; height: 16px; border-radius: var(--radius-1);
        border: var(--border-width) var(--border-style) var(--color-border-default);
        background: var(--color-canvas-default);
        display: inline-flex; align-items: center; justify-content: center;
      "></span>
      Item 3
    </label>
    <label style="display: flex; align-items: center; gap: var(--spacing-2); font-size: var(--font-size-md); color: var(--color-fg-muted); cursor: not-allowed; opacity: 0.5;">
      <span style="
        width: 16px; height: 16px; border-radius: var(--radius-1);
        border: var(--border-width) var(--border-style) var(--color-border-muted);
        background: var(--color-canvas-subtle);
        display: inline-flex; align-items: center; justify-content: center;
      "></span>
      Disabled
    </label>
  </div>

  <!-- Radio buttons -->
  <div style="display: flex; flex-direction: column; gap: var(--spacing-2);">
    <label style="display: flex; align-items: center; gap: var(--spacing-2); font-size: var(--font-size-md); color: var(--color-fg-default); cursor: pointer;">
      <span style="
        width: 16px; height: 16px; border-radius: var(--radius-full);
        border: var(--border-width) var(--border-style) var(--color-border-default);
        background: var(--color-canvas-default);
        display: inline-flex; align-items: center; justify-content: center;
      "></span>
      Choice 1
    </label>
    <label style="display: flex; align-items: center; gap: var(--spacing-2); font-size: var(--font-size-md); color: var(--color-fg-default); cursor: pointer;">
      <span style="
        width: 16px; height: 16px; border-radius: var(--radius-full);
        border: 2px solid var(--color-accent-emphasis);
        background: var(--color-canvas-default);
        display: inline-flex; align-items: center; justify-content: center;
      "><span style="width: 8px; height: 8px; border-radius: var(--radius-full); background: var(--color-accent-emphasis);"></span></span>
      Choice 2
    </label>
    <label style="display: flex; align-items: center; gap: var(--spacing-2); font-size: var(--font-size-md); color: var(--color-fg-default); cursor: pointer;">
      <span style="
        width: 16px; height: 16px; border-radius: var(--radius-full);
        border: var(--border-width) var(--border-style) var(--color-border-default);
        background: var(--color-canvas-default);
        display: inline-flex; align-items: center; justify-content: center;
      "></span>
      Choice 3
    </label>
  </div>
</div>
`;

const tabsHtml = `
<div class="ds-root">
  <nav style="
    display: flex; border-bottom: var(--border-width) var(--border-style) var(--color-border-muted);
    gap: var(--spacing-2);
  ">
    <a style="
      display: inline-flex; align-items: center; gap: var(--spacing-2);
      padding: var(--spacing-2) var(--spacing-3);
      font-size: var(--font-size-md); font-weight: var(--font-weight-semibold);
      color: var(--color-fg-default);
      border-bottom: 2px solid var(--color-accent-fg);
      text-decoration: none; cursor: pointer;
    ">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1.75 1.5a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V1.75a.25.25 0 00-.25-.25H1.75zM0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0114.25 16H1.75A1.75 1.75 0 010 14.25V1.75zM6.25 6a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z"/></svg>
      Code
    </a>
    <a style="
      display: inline-flex; align-items: center; gap: var(--spacing-2);
      padding: var(--spacing-2) var(--spacing-3);
      font-size: var(--font-size-md); color: var(--color-fg-muted);
      border-bottom: 2px solid transparent;
      text-decoration: none; cursor: pointer;
    ">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/><path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/></svg>
      Issues
    </a>
    <a style="
      display: inline-flex; align-items: center; gap: var(--spacing-2);
      padding: var(--spacing-2) var(--spacing-3);
      font-size: var(--font-size-md); color: var(--color-fg-muted);
      border-bottom: 2px solid transparent;
      text-decoration: none; cursor: pointer;
    ">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1.5 3.25a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zm5.677-.177L9.573.677A.25.25 0 0110 .854V2.5h1A2.5 2.5 0 0113.5 5v5.628a2.251 2.251 0 11-1.5 0V5a1 1 0 00-1-1h-1v1.646a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354z"/></svg>
      Pull requests
    </a>
    <a style="
      display: inline-flex; align-items: center; gap: var(--spacing-2);
      padding: var(--spacing-2) var(--spacing-3);
      font-size: var(--font-size-md); color: var(--color-fg-muted);
      border-bottom: 2px solid transparent;
      text-decoration: none; cursor: pointer;
    ">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8.2 8.2 0 015.534 2.13 8.087 8.087 0 011.553 2.406A7.94 7.94 0 0116 8.017 7.98 7.98 0 0114.25 13.6a8 8 0 01-12.5 0A7.98 7.98 0 010 8.017a7.94 7.94 0 01.913-3.48 8.09 8.09 0 011.553-2.407A8.2 8.2 0 018 0zM1.5 8.017a6.48 6.48 0 001.348 3.974L4.9 9.938a2.753 2.753 0 01-.4-1.44 2.74 2.74 0 01.815-1.954 2.74 2.74 0 011.955-.815 2.74 2.74 0 011.954.815 2.74 2.74 0 01.815 1.955 2.75 2.75 0 01-.4 1.44l2.052 2.052A6.48 6.48 0 0014.5 8.017a6.47 6.47 0 00-.744-2.83 6.59 6.59 0 00-1.266-1.96A6.7 6.7 0 008 1.5a6.7 6.7 0 00-4.49 1.727 6.59 6.59 0 00-1.266 1.96A6.47 6.47 0 001.5 8.017z"/></svg>
      Actions
    </a>
  </nav>
</div>
`;

const tableHtml = `
<div class="ds-root">
  <table style="
    width: 100%; border-collapse: separate; border-spacing: 0;
    font-size: var(--font-size-md); font-family: var(--font-family);
    border: var(--border-width) var(--border-style) var(--color-border-default);
    border-radius: var(--radius-2); overflow: hidden;
  ">
    <thead>
      <tr>
        <th style="
          text-align: left; padding: var(--spacing-2) var(--spacing-3);
          font-weight: var(--font-weight-semibold); color: var(--color-fg-default);
          background-color: var(--color-canvas-subtle);
          border-bottom: var(--border-width) var(--border-style) var(--color-border-default);
        ">Name</th>
        <th style="
          text-align: left; padding: var(--spacing-2) var(--spacing-3);
          font-weight: var(--font-weight-semibold); color: var(--color-fg-default);
          background-color: var(--color-canvas-subtle);
          border-bottom: var(--border-width) var(--border-style) var(--color-border-default);
        ">Last commit message</th>
        <th style="
          text-align: right; padding: var(--spacing-2) var(--spacing-3);
          font-weight: var(--font-weight-semibold); color: var(--color-fg-default);
          background-color: var(--color-canvas-subtle);
          border-bottom: var(--border-width) var(--border-style) var(--color-border-default);
        ">Updated</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: var(--spacing-2) var(--spacing-3); border-bottom: var(--border-width) var(--border-style) var(--color-border-subtle);">
          <a style="color: var(--color-accent-fg); text-decoration: none; font-weight: var(--font-weight-semibold);">.github</a>
        </td>
        <td style="padding: var(--spacing-2) var(--spacing-3); color: var(--color-fg-muted); border-bottom: var(--border-width) var(--border-style) var(--color-border-subtle);">Update stale.yml</td>
        <td style="padding: var(--spacing-2) var(--spacing-3); color: var(--color-fg-muted); text-align: right; border-bottom: var(--border-width) var(--border-style) var(--color-border-subtle);">3 days ago</td>
      </tr>
      <tr style="background-color: var(--color-canvas-subtle);">
        <td style="padding: var(--spacing-2) var(--spacing-3); border-bottom: var(--border-width) var(--border-style) var(--color-border-subtle);">
          <a style="color: var(--color-accent-fg); text-decoration: none; font-weight: var(--font-weight-semibold);">hack-house</a>
        </td>
        <td style="padding: var(--spacing-2) var(--spacing-3); color: var(--color-fg-muted); border-bottom: var(--border-width) var(--border-style) var(--color-border-subtle);">Update agenda.md</td>
        <td style="padding: var(--spacing-2) var(--spacing-3); color: var(--color-fg-muted); text-align: right; border-bottom: var(--border-width) var(--border-style) var(--color-border-subtle);">5 days ago</td>
      </tr>
      <tr>
        <td style="padding: var(--spacing-2) var(--spacing-3); border-bottom: var(--border-width) var(--border-style) var(--color-border-subtle);">
          <a style="color: var(--color-accent-fg); text-decoration: none; font-weight: var(--font-weight-semibold);">meetings</a>
        </td>
        <td style="padding: var(--spacing-2) var(--spacing-3); color: var(--color-fg-muted); border-bottom: var(--border-width) var(--border-style) var(--color-border-subtle);">Update components-in-dotcom.md</td>
        <td style="padding: var(--spacing-2) var(--spacing-3); color: var(--color-fg-muted); text-align: right; border-bottom: var(--border-width) var(--border-style) var(--color-border-subtle);">last week</td>
      </tr>
      <tr>
        <td style="padding: var(--spacing-2) var(--spacing-3);">
          <a style="color: var(--color-accent-fg); text-decoration: none; font-weight: var(--font-weight-semibold);">planning</a>
        </td>
        <td style="padding: var(--spacing-2) var(--spacing-3); color: var(--color-fg-muted);">add link and update roles</td>
        <td style="padding: var(--spacing-2) var(--spacing-3); color: var(--color-fg-muted); text-align: right;">last month</td>
      </tr>
    </tbody>
  </table>
</div>
`;

const dropdownHtml = `
<div class="ds-root" style="position: relative; width: 240px;">
  <div style="
    background: var(--color-canvas-overlay);
    border: var(--border-width) var(--border-style) var(--color-border-default);
    border-radius: var(--radius-3);
    box-shadow: var(--shadow-lg);
    padding: var(--spacing-1) 0;
    overflow: hidden;
  ">
    <div style="padding: var(--spacing-2) var(--spacing-3); color: var(--color-fg-default); cursor: pointer;">List item 1</div>
    <div style="padding: var(--spacing-2) var(--spacing-3); color: var(--color-fg-default); background: var(--color-canvas-subtle); cursor: pointer;">List item 2</div>
    <div style="padding: var(--spacing-2) var(--spacing-3); color: var(--color-fg-default); cursor: pointer;">List item 3</div>
    <div style="padding: var(--spacing-2) var(--spacing-3); color: var(--color-fg-default); cursor: pointer;">List item 4</div>
    <div style="height: 1px; background: var(--color-border-muted); margin: var(--spacing-1) 0;"></div>
    <div style="padding: var(--spacing-2) var(--spacing-3); color: var(--color-fg-on-emphasis); background: var(--color-accent-emphasis); cursor: pointer;">List item 5</div>
  </div>
</div>
`;

const alertHtml = `
<div class="ds-root" style="display: flex; flex-direction: column; gap: var(--spacing-3); max-width: 480px;">
  <!-- Info -->
  <div style="
    padding: var(--spacing-3); border-radius: var(--radius-2);
    background-color: var(--color-accent-subtle);
    border: var(--border-width) var(--border-style) var(--color-accent-muted);
    color: var(--color-fg-default); font-size: var(--font-size-md);
  ">
    <strong style="font-weight: var(--font-weight-semibold); color: var(--color-accent-fg);">Note:</strong>
    This is an informational alert with accent color.
  </div>

  <!-- Success -->
  <div style="
    padding: var(--spacing-3); border-radius: var(--radius-2);
    background-color: var(--color-success-subtle);
    border: var(--border-width) var(--border-style) rgba(74,194,107,0.4);
    color: var(--color-fg-default); font-size: var(--font-size-md);
  ">
    <strong style="font-weight: var(--font-weight-semibold); color: var(--color-success-fg);">Success:</strong>
    Changes have been saved successfully.
  </div>

  <!-- Warning -->
  <div style="
    padding: var(--spacing-3); border-radius: var(--radius-2);
    background-color: var(--color-warning-subtle);
    border: var(--border-width) var(--border-style) rgba(212,167,44,0.4);
    color: var(--color-fg-default); font-size: var(--font-size-md);
  ">
    <strong style="font-weight: var(--font-weight-semibold); color: var(--color-warning-fg);">Warning:</strong>
    You have unsaved changes that will be lost.
  </div>

  <!-- Danger -->
  <div style="
    padding: var(--spacing-3); border-radius: var(--radius-2);
    background-color: var(--color-danger-subtle);
    border: var(--border-width) var(--border-style) rgba(255,129,130,0.4);
    color: var(--color-fg-default); font-size: var(--font-size-md);
  ">
    <strong style="font-weight: var(--font-weight-semibold); color: var(--color-danger-fg);">Error:</strong>
    This action cannot be undone. This will permanently delete the repository.
  </div>
</div>
`;

const avatarBadgeHtml = `
<div class="ds-root" style="display: flex; gap: var(--spacing-4); align-items: center; flex-wrap: wrap;">
  <!-- Avatars -->
  <div style="display: flex; gap: var(--spacing-2); align-items: center;">
    <div style="
      width: 40px; height: 40px; border-radius: var(--radius-full);
      background: var(--color-accent-subtle); border: 2px solid var(--color-border-default);
      display: flex; align-items: center; justify-content: center;
      font-weight: var(--font-weight-semibold); color: var(--color-accent-fg); font-size: var(--font-size-md);
    ">AU</div>
    <div style="
      width: 32px; height: 32px; border-radius: var(--radius-full);
      background: var(--color-success-subtle); border: 2px solid var(--color-border-default);
      display: flex; align-items: center; justify-content: center;
      font-weight: var(--font-weight-semibold); color: var(--color-success-fg); font-size: var(--font-size-sm);
    ">GH</div>
    <div style="
      width: 24px; height: 24px; border-radius: var(--radius-full);
      background: var(--color-neutral-muted); border: 2px solid var(--color-border-default);
      display: flex; align-items: center; justify-content: center;
      font-weight: var(--font-weight-semibold); color: var(--color-fg-muted); font-size: 10px;
    ">JS</div>
  </div>

  <!-- Badges / Labels -->
  <div style="display: flex; gap: var(--spacing-2); flex-wrap: wrap;">
    <span style="
      display: inline-flex; padding: 2px 8px; font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold); border-radius: var(--radius-full);
      background: var(--color-accent-subtle); color: var(--color-accent-fg);
      border: var(--border-width) var(--border-style) var(--color-accent-muted);
    ">enhancement</span>
    <span style="
      display: inline-flex; padding: 2px 8px; font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold); border-radius: var(--radius-full);
      background: var(--color-danger-subtle); color: var(--color-danger-fg);
      border: var(--border-width) var(--border-style) rgba(255,129,130,0.4);
    ">bug</span>
    <span style="
      display: inline-flex; padding: 2px 8px; font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold); border-radius: var(--radius-full);
      background: var(--color-success-subtle); color: var(--color-success-fg);
      border: var(--border-width) var(--border-style) rgba(74,194,107,0.4);
    ">good first issue</span>
    <span style="
      display: inline-flex; padding: 2px 8px; font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold); border-radius: var(--radius-full);
      background: var(--color-warning-subtle); color: var(--color-warning-fg);
      border: var(--border-width) var(--border-style) rgba(212,167,44,0.4);
    ">needs triage</span>
  </div>

  <!-- Counters -->
  <div style="display: flex; gap: var(--spacing-2);">
    <span style="
      display: inline-flex; align-items: center; justify-content: center;
      min-width: 20px; padding: 0 6px; height: 20px;
      font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
      border-radius: var(--radius-full);
      background: var(--color-neutral-muted); color: var(--color-fg-default);
    ">12</span>
    <span style="
      display: inline-flex; align-items: center; justify-content: center;
      min-width: 20px; padding: 0 6px; height: 20px;
      font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
      border-radius: var(--radius-full);
      background: var(--color-accent-emphasis); color: var(--color-fg-on-emphasis);
    ">3</span>
    <span style="
      display: inline-flex; align-items: center; justify-content: center;
      min-width: 20px; padding: 0 6px; height: 20px;
      font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
      border-radius: var(--radius-full);
      background: var(--color-danger-emphasis); color: var(--color-fg-on-emphasis);
    ">!</span>
  </div>
</div>
`;

const toggleHtml = `
<div class="ds-root" style="display: flex; flex-direction: column; gap: var(--spacing-3);">
  <!-- Toggle on -->
  <label style="display: flex; align-items: center; gap: var(--spacing-2); cursor: pointer;">
    <span style="
      width: 48px; height: 24px; border-radius: var(--radius-full);
      background: var(--color-success-emphasis);
      display: inline-flex; align-items: center;
      padding: 2px;
      transition: background-color var(--duration-normal) var(--easing-default);
    ">
      <span style="
        width: 20px; height: 20px; border-radius: var(--radius-full);
        background: white; transform: translateX(24px);
        box-shadow: var(--shadow-sm);
        transition: transform var(--duration-normal) var(--easing-default);
      "></span>
    </span>
    <span style="font-size: var(--font-size-md); color: var(--color-fg-default);">Enabled</span>
  </label>

  <!-- Toggle off -->
  <label style="display: flex; align-items: center; gap: var(--spacing-2); cursor: pointer;">
    <span style="
      width: 48px; height: 24px; border-radius: var(--radius-full);
      background: var(--color-neutral-muted);
      display: inline-flex; align-items: center;
      padding: 2px;
    ">
      <span style="
        width: 20px; height: 20px; border-radius: var(--radius-full);
        background: white;
        box-shadow: var(--shadow-sm);
      "></span>
    </span>
    <span style="font-size: var(--font-size-md); color: var(--color-fg-default);">Disabled</span>
  </label>

  <!-- Toggle disabled -->
  <label style="display: flex; align-items: center; gap: var(--spacing-2); cursor: not-allowed; opacity: 0.5;">
    <span style="
      width: 48px; height: 24px; border-radius: var(--radius-full);
      background: var(--color-neutral-muted);
      display: inline-flex; align-items: center;
      padding: 2px;
    ">
      <span style="
        width: 20px; height: 20px; border-radius: var(--radius-full);
        background: white;
        box-shadow: var(--shadow-sm);
      "></span>
    </span>
    <span style="font-size: var(--font-size-md); color: var(--color-fg-muted);">Not available</span>
  </label>
</div>
`;

const progressHtml = `
<div class="ds-root" style="display: flex; flex-direction: column; gap: var(--spacing-3); max-width: 400px;">
  <!-- Standard progress -->
  <div>
    <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-1);">
      <span style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-fg-default);">Progress</span>
      <span style="font-size: var(--font-size-sm); color: var(--color-fg-muted);">72%</span>
    </div>
    <div style="
      height: 8px; border-radius: var(--radius-2);
      background: var(--color-neutral-muted); overflow: hidden;
    ">
      <div style="
        width: 72%; height: 100%; border-radius: var(--radius-2);
        background: var(--color-accent-emphasis);
        transition: width var(--duration-normal) var(--easing-default);
      "></div>
    </div>
  </div>

  <!-- Success progress -->
  <div>
    <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-1);">
      <span style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-fg-default);">Complete</span>
      <span style="font-size: var(--font-size-sm); color: var(--color-success-fg);">100%</span>
    </div>
    <div style="
      height: 8px; border-radius: var(--radius-2);
      background: var(--color-neutral-muted); overflow: hidden;
    ">
      <div style="
        width: 100%; height: 100%; border-radius: var(--radius-2);
        background: var(--color-success-emphasis);
      "></div>
    </div>
  </div>

  <!-- Segmented progress (issues style) -->
  <div>
    <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-1);">
      <span style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-fg-default);">Issues</span>
      <span style="font-size: var(--font-size-sm); color: var(--color-fg-muted);">8 open, 24 closed</span>
    </div>
    <div style="
      height: 8px; border-radius: var(--radius-2);
      background: var(--color-neutral-muted); overflow: hidden;
      display: flex;
    ">
      <div style="width: 75%; height: 100%; background: var(--color-success-emphasis);"></div>
      <div style="width: 25%; height: 100%; background: var(--color-neutral-muted);"></div>
    </div>
  </div>
</div>
`;

// ─── ASSEMBLE COMPONENT GROUPS ────────────────────────────────────

export const primerComponents: ComponentGroup[] = [
  {
    name: "Actions",
    components: [
      {
        id: "button",
        name: "Button",
        group: "Actions",
        html: buttonHtml,
        inlineStyles: sharedStyles,
        stories: [
          { id: "btn-primary", name: "Primary", html: buttonHtml, storyId: "components-button--primary" },
        ],
      },
      {
        id: "toggle",
        name: "Toggle",
        group: "Actions",
        html: toggleHtml,
        inlineStyles: sharedStyles,
        stories: [
          { id: "toggle-default", name: "Default", html: toggleHtml, storyId: "components-toggle--default" },
        ],
      },
    ],
  },
  {
    name: "Forms",
    components: [
      {
        id: "input",
        name: "Input",
        group: "Forms",
        html: inputHtml,
        inlineStyles: sharedStyles,
        stories: [
          { id: "input-default", name: "Default", html: inputHtml, storyId: "components-input--default" },
        ],
      },
      {
        id: "checkbox-radio",
        name: "Checkbox & Radio",
        group: "Forms",
        html: checkboxRadioHtml,
        inlineStyles: sharedStyles,
        stories: [
          { id: "checkbox-radio-default", name: "Default", html: checkboxRadioHtml, storyId: "components-selection--default" },
        ],
      },
    ],
  },
  {
    name: "Navigation",
    components: [
      {
        id: "tabs",
        name: "UnderlineNav",
        group: "Navigation",
        html: tabsHtml,
        inlineStyles: sharedStyles,
        stories: [
          { id: "tabs-default", name: "Default", html: tabsHtml, storyId: "components-underlinenav--default" },
        ],
      },
    ],
  },
  {
    name: "Data Display",
    components: [
      {
        id: "table",
        name: "Table",
        group: "Data Display",
        html: tableHtml,
        inlineStyles: sharedStyles,
        stories: [
          { id: "table-default", name: "Default", html: tableHtml, storyId: "components-table--default" },
        ],
      },
    ],
  },
  {
    name: "Feedback",
    components: [
      {
        id: "alert",
        name: "Flash / Alert",
        group: "Feedback",
        html: alertHtml,
        inlineStyles: sharedStyles,
        stories: [
          { id: "alert-default", name: "Default", html: alertHtml, storyId: "components-flash--default" },
        ],
      },
      {
        id: "progress",
        name: "ProgressBar",
        group: "Feedback",
        html: progressHtml,
        inlineStyles: sharedStyles,
        stories: [
          { id: "progress-default", name: "Default", html: progressHtml, storyId: "components-progressbar--default" },
        ],
      },
    ],
  },
  {
    name: "Overlays",
    components: [
      {
        id: "dropdown",
        name: "ActionMenu",
        group: "Overlays",
        html: dropdownHtml,
        inlineStyles: sharedStyles,
        stories: [
          { id: "dropdown-default", name: "Default", html: dropdownHtml, storyId: "components-actionmenu--default" },
        ],
      },
    ],
  },
  {
    name: "Primitives",
    components: [
      {
        id: "avatar-badge",
        name: "Avatar, Label & Counter",
        group: "Primitives",
        html: avatarBadgeHtml,
        inlineStyles: sharedStyles,
        stories: [
          { id: "avatar-badge-default", name: "Default", html: avatarBadgeHtml, storyId: "components-avatar--default" },
        ],
      },
    ],
  },
];
