import { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <div className="w-full flex items-center gap-3">
        <img src="/lvlx-dark.png" className="h-8 w-full object-contain" />
        <h5 className="whitespace-nowrap">LVLX Docs</h5>
      </div>
    ),
  },
  themeSwitch: {
    mode: "light-dark",
    enabled: true,
  },
};
