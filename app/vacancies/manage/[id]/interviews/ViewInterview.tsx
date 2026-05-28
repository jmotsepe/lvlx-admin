"use client";
import { interview, profiles } from "@prisma/client";
import React from "react";

const ViewInterview = ({
  interview,
}: {
  interview: interview & {
    application: {
      user: profiles | null;
    };
  };
}) => {
  return <></>;
};

export default ViewInterview;
