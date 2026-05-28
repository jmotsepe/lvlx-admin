import { Separator } from "@/components/ui/separator";
import AccountForm from "./AccountForm";
import getProfile from "@/actions/user";
import { redirect } from "next/navigation";
import { prisma } from "@/prisma/prisma";

export const revalidate = 0;

export default async function SettingsAccountPage() {
  //

  const user = await getProfile();

  const profile = await prisma.profiles.findUnique({ where: { id: user.id } });
  if (!profile) redirect("/auth/get-started");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings. Set your preferred language and
          timezone.
        </p>
      </div>
      <Separator />
      <AccountForm profile={profile} user={user.id} />
    </div>
  );
}
