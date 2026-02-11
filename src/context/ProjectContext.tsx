"use client";

import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type ReactNode,
  type Dispatch,
} from "react";
import {
  ProjectState,
  Action,
  initialState,
  projectReducer,
} from "./reducer";
import { TokenSet } from "@/lib/types/token";

// ─── Context ──────────────────────────────────────────────────────

interface ProjectContextValue {
  state: ProjectState;
  dispatch: Dispatch<Action>;
  /** Resolve a token set ID to the actual TokenSet (base or variation) */
  getTokenSet: (id: string) => TokenSet | undefined;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  const getTokenSet = useMemo(() => {
    return (id: string): TokenSet | undefined => {
      if (state.baseTokens?.id === id) return state.baseTokens;
      return state.variations.find((v) => v.tokenSet.id === id)?.tokenSet;
    };
  }, [state.baseTokens, state.variations]);

  const value = useMemo(
    () => ({ state, dispatch, getTokenSet }),
    [state, dispatch, getTokenSet]
  );

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────

export function useProject(): ProjectContextValue {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return ctx;
}
