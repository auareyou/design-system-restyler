import { ComponentGroup, TokenSet, Variation } from "@/lib/types";

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
  /** Token set IDs currently shown in comparator panels */
  activePanels: string[];
  scrollSync: boolean;
  /** Which variation is shown in the token inspector (null = closed) */
  inspectorTarget: string | null;
  /** Token set to use as fork source for the next AI generation (null = use baseTokens) */
  forkSource: TokenSet | null;
  error: string | null;
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
  | { type: "INIT_PROJECT"; components: ComponentGroup[]; tokens: TokenSet; url?: string };

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

    case "ADD_VARIATION":
      return {
        ...state,
        variations: [...state.variations, action.variation],
        activePanels: [
          state.baseTokens?.id ?? "",
          action.variation.tokenSet.id,
        ].filter(Boolean),
      };

    case "REMOVE_VARIATION": {
      const next = state.variations.filter((v) => v.id !== action.variationId);
      const removedTokenId = state.variations.find(
        (v) => v.id === action.variationId
      )?.tokenSet.id;
      return {
        ...state,
        variations: next,
        activePanels: state.activePanels.filter((id) => id !== removedTokenId),
        inspectorTarget:
          state.inspectorTarget === action.variationId
            ? null
            : state.inspectorTarget,
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

    case "INIT_PROJECT":
      return {
        ...state,
        components: action.components,
        baseTokens: action.tokens,
        storybookUrl: action.url ?? null,
        activePanels: [action.tokens.id],
        loading: { active: false, phase: "" },
        error: null,
      };

    default:
      return state;
  }
}
