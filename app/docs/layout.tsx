import { DocsSidebar } from "@/components/docs-nav";
import type { ReactNode } from "react";
import { sidebarGroups } from "@/lib/docs";

export default function DocsLayout({ children }: { children: ReactNode }) {
  const groups = sidebarGroups();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="lg:flex lg:gap-10">
        <DocsSidebar groups={groups} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
