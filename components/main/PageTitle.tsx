"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const PageTitle = ({
  title,
  goBack,
  description,
}: {
  title: string;
  goBack?: boolean;
  description?: string;
}) => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-4">
      <div className="space-y-0.5">
        <div className="flex items-center gap-4">
          {goBack && (
            <ArrowLeft
              onClick={() => router.back()}
              className="cursor-pointer"
            />
          )}
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default PageTitle;
