import { Textarea } from "@/components/ui/textarea";
import { cover_letter } from "@prisma/client";
import React from "react";
import NoData from "../NoData";

const CoverLetter = ({ letter }: { letter: cover_letter | null }) => {
  if (!letter) return <NoData />;
  return (
    <div className="mt-5">
      <Textarea value={letter.letter} rows={10} placeholder="Cover letter" />
    </div>
  );
};

export default CoverLetter;
