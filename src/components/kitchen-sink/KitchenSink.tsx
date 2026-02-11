import { ComponentGroup as ComponentGroupType } from "@/lib/types";
import { TokenSet } from "@/lib/types/token";
import ComponentGroup from "./ComponentGroup";
import styles from "./KitchenSink.module.css";

interface Props {
  groups: ComponentGroupType[];
  tokenSet: TokenSet;
}

export default function KitchenSink({ groups, tokenSet }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Kitchen Sink</h2>
        <span className={styles.tokenLabel}>{tokenSet.label}</span>
      </div>
      {groups.map((group) => (
        <ComponentGroup
          key={group.name}
          group={group}
          tokenSet={tokenSet}
        />
      ))}
    </div>
  );
}
