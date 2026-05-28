import AppShell from "@/components/main/AppShell";
import AuthProvider from "@/components/main/AuthProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { prisma } from "@/prisma/prisma";
import { createClient } from "@/utils/supabase/server";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import React from "react";

export const revalidate = 0;

const RootTemplate = async ({ children }: { children: React.ReactNode }) => {
  //
  const getProfile = async () => {
    const supabaseServer = await createClient();
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();
    if (!user) return null;
    const profile = await prisma.profiles.findUnique({
      where: { id: user.id },
    });
    return profile;
  };

  const profile = await getProfile();

  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <AppShell profile={profile}>
          {children}
          <ToastContainer />
        </AppShell>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default RootTemplate;
