import type { Metadata } from "next";
import "@/styles/globals.css";
import { ProjectProvider } from "@/context/ProjectContext";

export const metadata: Metadata = {
  title: "Design System Restyler",
  description: "Explore visual directions on existing design systems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ProjectProvider>{children}</ProjectProvider>
      </body>
    </html>
  );
}
