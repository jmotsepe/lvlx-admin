"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { handleDownloadClick } from "@/lib/handleDownloadClick";
import { fileUrl } from "@/lib/utils";

const Download = ({ url }: { url: string | null }) => {
  return (
    <Card className="my-5 p-5 shadow-lg rounded-lg">
      {" "}
      <h1 className="font-bold text-2xl">Download uploaded CV</h1>
      <p className="text-gray-600 mb-4">
        Please click the button below to download your CV.
      </p>
      <p>
        {url ? (
          <Button onClick={() => handleDownloadClick(`${fileUrl()}${url}`)}>
            Download CV
          </Button>
        ) : (
          <p className="text-red-500">No CV uploaded yet.</p>
        )}
      </p>
    </Card>
  );
};

export default Download;
