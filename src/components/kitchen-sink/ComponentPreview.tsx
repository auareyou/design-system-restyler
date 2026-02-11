import { CSSProperties, useMemo } from "react";
import { ExtractedComponent } from "@/lib/types";
import { TokenSet } from "@/lib/types/token";
import { tokenSetToStyleOverrides } from "@/lib/tokens/serializer";
import styles from "./ComponentPreview.module.css";

interface Props {
  component: ExtractedComponent;
  tokenSet: TokenSet;
}

export default function ComponentPreview({ component, tokenSet }: Props) {
  const styleOverrides = useMemo(
    () => tokenSetToStyleOverrides(tokenSet) as unknown as CSSProperties,
    [tokenSet]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.componentName}>{component.name}</div>
      <div
        className={styles.preview}
        style={styleOverrides}
        dangerouslySetInnerHTML={{ __html: component.html }}
      />
    </div>
  );
}
