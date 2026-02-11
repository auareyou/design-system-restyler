import { ComponentGroup } from "./component";
import { TokenSet } from "./token";

export interface Variation {
  id: string;
  direction: string;
  tokenSet: TokenSet;
  createdAt: string;
  brandContext?: string;
}

export interface Project {
  id: string;
  storybookUrl: string;
  components: ComponentGroup[];
  baseTokens: TokenSet;
  variations: Variation[];
  createdAt: string;
}
