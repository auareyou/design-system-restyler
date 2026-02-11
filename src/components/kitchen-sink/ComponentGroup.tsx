import { ComponentGroup as ComponentGroupType } from "@/lib/types";
import { TokenSet } from "@/lib/types/token";
import ComponentPreview from "./ComponentPreview";
import styles from "./KitchenSink.module.css";

interface Props {
  group: ComponentGroupType;
  tokenSet: TokenSet;
}

export default function ComponentGroup({ group, tokenSet }: Props) {
  return (
    <section className={styles.group}>
      <h3 className={styles.groupTitle}>{group.name}</h3>
      <div className={styles.groupGrid}>
        {group.components.map((component) => (
          <ComponentPreview
            key={component.id}
            component={component}
            tokenSet={tokenSet}
          />
        ))}
      </div>
    </section>
  );
}
