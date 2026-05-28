import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";
import { File, Grid2X2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "LVLX Docs",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      sidebar={{
        tabs: [
          {
            title: (
              <div className="flex items-center gap-3">
                <Button size="icon" variant={"black"}>
                  <File size={18} />
                </Button>
                <div>
                  <h5>Documentation</h5>
                  <div className="text-xs text-muted-foreground">
                    LVLX Documentation
                  </div>
                </div>
              </div>
            ),
            url: "/docs/introduction",
          },
          {
            title: (
              <div className="flex items-center gap-3">
                <Button size="icon" variant={"green"}>
                  <Grid2X2 size={18} />
                </Button>
                <div>
                  <h5>Dashboard</h5>
                  <div className="text-xs text-muted-foreground">
                    Back to the dashboard
                  </div>
                </div>
              </div>
            ),
            url: "/dashboard",
          },
        ],
      }}
      tree={source.pageTree}
      {...baseOptions}
    >
      {children}
    </DocsLayout>
  );
}
