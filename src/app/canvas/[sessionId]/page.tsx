"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProject } from "@/context/ProjectContext";
import CanvasLayout from "@/components/canvas/CanvasLayout";

export default function CanvasPage() {
  const { state } = useProject();
  const router = useRouter();

  const hasProject = state.baseTokens && state.components.length > 0;

  useEffect(() => {
    if (!hasProject) {
      router.replace("/");
    }
  }, [hasProject, router]);

  if (!hasProject) return null;

  return <CanvasLayout />;
}
