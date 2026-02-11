"use client";

import PromptInput from "./PromptInput";
import VersionList from "./VersionList";
import FrameLevers from "./FrameLevers";
import CombinePanel from "./CombinePanel";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <PromptInput />
      <div className={styles.divider} />
      <VersionList />
      <FrameLevers />
      <CombinePanel />
    </aside>
  );
}
