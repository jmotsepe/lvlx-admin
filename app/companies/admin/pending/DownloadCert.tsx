"use client";
import { handleDownloadClick } from "@/lib/handleDownloadClick";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fileUrl } from "@/lib/utils";
import React from "react";

const DownloadCert = ({ url }: { url: string }) => {
  return (
    <Card className="my-5 p-5 shadow-lg rounded-lg">
      {" "}
      <h1 className="font-bold">Download uploaded certificate</h1>
      <p className="text-gray-600 mb-4 text-sm">
        Please click the button below to download.
      </p>
      <p>
        <Button onClick={() => handleDownloadClick(`${fileUrl()}${url}`)}>
          Download Certificate
        </Button>
      </p>
    </Card>
  );
};

export default DownloadCert;
