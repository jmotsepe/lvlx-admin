"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useFullscreen } from "@mantine/hooks";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/actions/auth";
import { profiles } from "@/prisma/generated/zod";
import { cn } from "@/lib/utils";
import {
  adminMenu,
  companyMenu,
  sponsorMenu,
  youthMenu,
} from "@/lib/constants/menu";

import { Separator } from "@/components/ui/separator";
import { Button, buttonVariants } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CardContent, CardDescription, Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Expand, MenuIcon, User, User2 } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
  profile: profiles | null;
}

export default function AppShell({ children, profile }: AppShellProps) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { toggle } = useFullscreen();
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    setShowing(true);
  }, []);

  if (!showing) return null;

  if (
    pathname === "/" ||
    pathname.startsWith("/auth/") ||
    pathname === "/interviews/live" ||
    pathname.startsWith("/docs")
  ) {
    return <>{children}</>;
  }

  if (profile && profile.status !== "Approved") {
    return <PendingApprovalMessage />;
  }

  const menuItems = getMenuItems(profile?.role);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-xs supports-backdrop-filter:bg-background/60 shadow-2xs">
        <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MobileMenu menuItems={menuItems} />
            <Logo theme={theme} />
            <DesktopMenu menuItems={menuItems} pathname={pathname} />
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="hidden lg:flex"
              onClick={toggle}
              variant="ghost"
              size="icon"
            >
              <Expand className="h-[1.2rem] w-[1.2rem]" />
            </Button>
            <ThemeToggle />
            <UserMenu profile={profile} />
          </div>
        </div>
        <Separator />
      </nav>
      <main className="w-full mx-auto max-w-7xl p-4">{children}</main>
    </>
  );
}

function PendingApprovalMessage() {
  return (
    <div className="mx-auto my-10 max-w-lg">
      <Card>
        <CardContent className="mt-5 space-y-5">
          <div>
            <Badge>Oops🥲</Badge>
            <h1 className="text-3xl font-black mt-2">Account Under Review</h1>
          </div>
          <CardDescription>
            Your account is currently being reviewed by our team. <br /> You
            will be notified as soon as your account is active.
          </CardDescription>
          <br />
          <a
            href="https://lvlx.org"
            className={buttonVariants({ variant: "secondary" })}
            target="_blank"
            rel="noopener noreferrer"
          >
            Back to Website
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

function MobileMenu({ menuItems }: any) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <MenuIcon className="h-6 w-6 mr-2 lg:hidden" />
      </SheetTrigger>
      <SheetContent side="left">
        <h6 className="font-bold mb-8">Menu</h6>
        <div className="flex flex-col w-full gap-5">
          {menuItems?.map((item: any) => (
            <Link key={item.label} className="text-sm" href={item.link}>
              {item.label}
            </Link>
          ))}
        </div>
        <Button onClick={signOut} className="w-full mt-4" variant="destructive">
          Sign Out
        </Button>
      </SheetContent>
    </Sheet>
  );
}

function Logo({ theme }: any) {
  const logoSrc = theme === "dark" ? "/lvlx-dark.png" : "/lvlx-light.png";
  return <Image alt="logo" src={logoSrc} height={44} width={44} />;
}

function DesktopMenu({ menuItems, pathname }: any) {
  return (
    <div className="lg:flex items-center gap-4 hidden ml-8">
      {menuItems?.map((item: any) => {
        const isActive = pathname.split("/")[1] === item.link.split("/")[1];
        return (
          <Link
            key={item.label}
            className={cn(
              "text-sm",
              isActive &&
                "underline underline-offset-[20px] decoration-primary decoration-4"
            )}
            href={item.link}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

function UserMenu({ profile }: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm">
          {profile?.role} <User className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/docs/introduction" className="flex items-center gap-4">
            <User2 className="mr-2 h-4 w-4" />
            <span>Documentation</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-4">
            <User2 className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button
            type="submit"
            className="w-full"
            variant="destructive"
            onClick={async () => {
              await signOut();
            }}
          >
            Sign Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getMenuItems(role: any) {
  switch (role) {
    case "Admin":
      return adminMenu;
    case "Employer":
      return companyMenu;
    case "Sponsor":
      return sponsorMenu;
    case "Youth":
      return youthMenu;
    default:
      return [];
  }
}
