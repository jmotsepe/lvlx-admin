import React from "react";
import { Skeleton } from "../ui/skeleton";

const Loading = () => {
  return (
    <>
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton className="h-20 w-20 border rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 border w-[250px]" />
          <Skeleton className="h-8 border w-[200px]" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5 mb-4">
        <Skeleton className="h-10 border w-full" />
        <Skeleton className="h-10 border w-full" />
      </div>
      <div className="grid grid-cols-3 gap-5 mb-4">
        <Skeleton className="h-10 w-full border" />
        <Skeleton className="h-10 w-full border" />
        <Skeleton className="h-10 w-full border" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-10 border w-full" />
        <Skeleton className="h-10 border w-full" />
        <Skeleton className="h-10 border w-full" />
      </div>
    </>
  );
};

export default Loading;
