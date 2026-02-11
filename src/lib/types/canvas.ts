import { Token } from "./token";

export interface FramePosition {
  x: number;
  y: number;
}

export interface CanvasFrame {
  id: string;
  label: string;
  prompt: string;
  position: FramePosition;
  tokenSetId: string;
  isBase: boolean;
}

export interface CanvasViewport {
  panX: number;
  panY: number;
  zoom: number;
}

export interface CanvasSelection {
  frameIds: string[];
}

export interface LeverDefinition {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  tokenTransform: (tokens: Token[], value: number) => Token[];
}

export interface LeverState {
  [leverId: string]: number;
}
