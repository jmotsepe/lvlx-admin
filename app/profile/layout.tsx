import { Metadata } from "next";

import { Separator } from "@/components/ui/separator";
import PageTitle from "@/components/main/PageTitle";
import Sidebar from "@/components/main/Sidebar";

export const revalidate = 0;

const menuItems = [
  {
    title: "Profile",
    href: "/profile",
  },
  // {
  //   title: "Account",
  //   href: "/profile/account",
  // },
  {
    title: "Appearance",
    href: "/profile/appearance",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div>
        <PageTitle
          title="Profile"
          description="Manage your account settings and set e-mail preferences."
        />
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <Sidebar items={menuItems} />
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  );
}
