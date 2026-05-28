import React, { ReactNode } from "react";

export const revalidate = 0;

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className="h-full min-h-screen bg-center bg-fixed bg-cover bg-blend-overlay py-10 px-4 bg-black/50"
      style={{
        backgroundImage: 'url("/images/auth-bg.png")',
      }}
    >
      {children}
    </div>
  );
};

export default AuthLayout;
