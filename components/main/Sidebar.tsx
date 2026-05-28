"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "../ui/separator";

export type SidebarMenu = {
  href: string;
  title: string | React.JSX.Element;
  type?: "button" | "link";
};
interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: SidebarMenu[];
}

export default function Sidebar({
  className,
  items,
  ...props
}: SidebarNavProps) {
  //
  const pathname = usePathname();

  const lastSlashIndex = pathname.lastIndexOf("/");
  const strippedPathname = pathname.substring(0, lastSlashIndex);

  return (
    <nav className="lg:w-[240px] lg:sticky top-20">
      <aside
        className={cn(
          "flex overflow-x-auto space-x-1.5 lg:flex-col lg:space-x-0 lg:space-y-2",
          className
        )}
        {...props}
      >
        {items.map((item) => {
          return (
            <>
              {item.href === "linebreak" ? (
                <Separator className="hidden lg:inline" />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    buttonVariants({
                      variant: item.type === "button" ? "black" : "ghost",
                      size: "sm",
                    }),
                    pathname === item.href && item.type !== "button"
                      ? "bg-gray-300 dark:bg-gray-900 border"
                      : "hover:bg-transparent ",
                    "w-full justify-start text-sm whitespace-nowrap",
                    item.type !== "button"
                      ? "hover:underline"
                      : "text-center justify-center"
                  )}
                >
                  {item.title}
                </Link>
              )}
            </>
          );
        })}
      </aside>
    </nav>
  );
}
