import {
  ComponentGroup,
  TokenSet,
  Variation,
  CanvasFrame,
  CanvasViewport,
  CanvasSelection,
  FramePosition,
} from "@/lib/types";

// ─── Constants ─────────────────────────────────────────────────────

export const FRAME_WIDTH = 380;
const FRAME_GAP = 60;

// ─── State ────────────────────────────────────────────────────────

export interface ProjectState {
  loading: {
    active: boolean;
    phase: string;
    progress?: { done: number; total: number };
  };
  storybookUrl: string | null;
  components: ComponentGroup[];
  baseTokens: TokenSet | null;
  variations: Variation[];
  /** Token set IDs currently shown in comparator panels (legacy, kept for compat) */
  activePanels: string[];
  scrollSync: boolean;
  /** Which variation is shown in the token inspector (null = closed) */
  inspectorTarget: string | null;
  /** Token set to use as fork source for the next AI generation (null = use baseTokens) */
  forkSource: TokenSet | null;
  error: string | null;

  // Canvas state
  frames: CanvasFrame[];
  viewport: CanvasViewport;
  selection: CanvasSelection;
  combineMode: boolean;
}

export const initialState: ProjectState = {
  loading: { active: false, phase: "" },
  storybookUrl: null,
  components: [],
  baseTokens: null,
  variations: [],
  activePanels: [],
  scrollSync: true,
  inspectorTarget: null,
  forkSource: null,
  error: null,

  frames: [],
  viewport: { panX: 0, panY: 0, zoom: 1 },
  selection: { frameIds: [] },
  combineMode: false,
};

// ─── Actions ──────────────────────────────────────────────────────

export type Action =
  | { type: "SET_LOADING"; phase: string; progress?: { done: number; total: number } }
  | { type: "CLEAR_LOADING" }
  | { type: "SET_COMPONENTS"; components: ComponentGroup[] }
  | { type: "SET_BASE_TOKENS"; tokens: TokenSet }
  | { type: "ADD_VARIATION"; variation: Variation }
  | { type: "REMOVE_VARIATION"; variationId: string }
  | { type: "UPDATE_VARIATION_TOKENS"; variationId: string; tokens: TokenSet }
  | { type: "SET_ACTIVE_PANELS"; panels: string[] }
  | { type: "TOGGLE_SCROLL_SYNC" }
  | { type: "SET_INSPECTOR_TARGET"; variationId: string | null }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "SET_FORK_SOURCE"; tokenSet: TokenSet | null }
  | { type: "INIT_PROJECT"; components: ComponentGroup[]; tokens: TokenSet; url?: string }
  // Canvas actions
  | { type: "ADD_FRAME"; frame: CanvasFrame }
  | { type: "REMOVE_FRAME"; frameId: string }
  | { type: "MOVE_FRAME"; frameId: string; position: FramePosition }
  | { type: "SET_VIEWPORT"; viewport: Partial<CanvasViewport> }
  | { type: "SELECT_FRAME"; frameId: string; additive: boolean }
  | { type: "CLEAR_SELECTION" }
  | { type: "TOGGLE_COMBINE_MODE" };

// ─── Helpers ──────────────────────────────────────────────────────

function nextFramePosition(frames: CanvasFrame[]): FramePosition {
  if (frames.length === 0) return { x: 100, y: 100 };
  const lastFrame = frames[frames.length - 1];
  return { x: lastFrame.position.x + FRAME_WIDTH + FRAME_GAP, y: lastFrame.position.y };
}

// ─── Reducer ──────────────────────────────────────────────────────

export function projectReducer(state: ProjectState, action: Action): ProjectState {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: { active: true, phase: action.phase, progress: action.progress },
        error: null,
      };

    case "CLEAR_LOADING":
      return { ...state, loading: { active: false, phase: "" } };

    case "SET_COMPONENTS":
      return { ...state, components: action.components };

    case "SET_BASE_TOKENS":
      return {
        ...state,
        baseTokens: action.tokens,
        activePanels: [action.tokens.id],
      };

    case "ADD_VARIATION": {
      const newFrame: CanvasFrame = {
        id: `frame-${action.variation.id}`,
        label: action.variation.direction,
        prompt: action.variation.direction,
        position: nextFramePosition(state.frames),
        tokenSetId: action.variation.tokenSet.id,
        isBase: false,
      };
      return {
        ...state,
        variations: [...state.variations, action.variation],
        activePanels: [
          state.baseTokens?.id ?? "",
          action.variation.tokenSet.id,
        ].filter(Boolean),
        frames: [...state.frames, newFrame],
      };
    }

    case "REMOVE_VARIATION": {
      const next = state.variations.filter((v) => v.id !== action.variationId);
      const removedTokenId = state.variations.find(
        (v) => v.id === action.variationId
      )?.tokenSet.id;
      const frameId = `frame-${action.variationId}`;
      return {
        ...state,
        variations: next,
        activePanels: state.activePanels.filter((id) => id !== removedTokenId),
        inspectorTarget:
          state.inspectorTarget === action.variationId
            ? null
            : state.inspectorTarget,
        frames: state.frames.filter((f) => f.id !== frameId),
        selection: {
          frameIds: state.selection.frameIds.filter((id) => id !== frameId),
        },
        combineMode: state.selection.frameIds.filter((id) => id !== frameId).length < 2
          ? false
          : state.combineMode,
      };
    }

    case "UPDATE_VARIATION_TOKENS":
      return {
        ...state,
        variations: state.variations.map((v) =>
          v.id === action.variationId
            ? { ...v, tokenSet: action.tokens }
            : v
        ),
      };

    case "SET_ACTIVE_PANELS":
      return { ...state, activePanels: action.panels };

    case "TOGGLE_SCROLL_SYNC":
      return { ...state, scrollSync: !state.scrollSync };

    case "SET_INSPECTOR_TARGET":
      return { ...state, inspectorTarget: action.variationId };

    case "SET_ERROR":
      return { ...state, error: action.error };

    case "SET_FORK_SOURCE":
      return { ...state, forkSource: action.tokenSet };

    case "INIT_PROJECT": {
      const baseFrame: CanvasFrame = {
        id: "frame-base",
        label: "Original",
        prompt: "Extracted from source",
        position: { x: 100, y: 100 },
        tokenSetId: action.tokens.id,
        isBase: true,
      };
      return {
        ...state,
        components: action.components,
        baseTokens: action.tokens,
        storybookUrl: action.url ?? null,
        activePanels: [action.tokens.id],
        loading: { active: false, phase: "" },
        error: null,
        frames: [baseFrame],
        viewport: { panX: 0, panY: 0, zoom: 1 },
        selection: { frameIds: [] },
        combineMode: false,
      };
    }

    // ─── Canvas actions ─────────────────────────────────────────

    case "ADD_FRAME":
      return { ...state, frames: [...state.frames, action.frame] };

    case "REMOVE_FRAME":
      return {
        ...state,
        frames: state.frames.filter((f) => f.id !== action.frameId),
        selection: {
          frameIds: state.selection.frameIds.filter((id) => id !== action.frameId),
        },
        combineMode: state.selection.frameIds.filter((id) => id !== action.frameId).length < 2
          ? false
          : state.combineMode,
      };

    case "MOVE_FRAME":
      return {
        ...state,
        frames: state.frames.map((f) =>
          f.id === action.frameId ? { ...f, position: action.position } : f
        ),
      };

    case "SET_VIEWPORT":
      return {
        ...state,
        viewport: { ...state.viewport, ...action.viewport },
      };

    case "SELECT_FRAME":
      if (action.additive) {
        const already = state.selection.frameIds.includes(action.frameId);
        const newIds = already
          ? state.selection.frameIds.filter((id) => id !== action.frameId)
          : [...state.selection.frameIds, action.frameId];
        return {
          ...state,
          selection: { frameIds: newIds },
          combineMode: newIds.length < 2 ? false : state.combineMode,
        };
      }
      return {
        ...state,
        selection: { frameIds: [action.frameId] },
        combineMode: false,
      };

    case "CLEAR_SELECTION":
      return {
        ...state,
        selection: { frameIds: [] },
        combineMode: false,
      };

    case "TOGGLE_COMBINE_MODE":
      if (state.selection.frameIds.length < 2) return state;
      return { ...state, combineMode: !state.combineMode };

    default:
      return state;
  }
}
