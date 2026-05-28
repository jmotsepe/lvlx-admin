import { Textarea } from "@/components/ui/textarea";
import { career_objectives, cover_letter } from "@prisma/client";
import React from "react";
import NoData from "../NoData";

const Objectives = ({ letter }: { letter: career_objectives | null }) => {
  if (!letter) return <NoData />;
  return (
    <div className="mt-5">
      <Textarea
        value={letter.objectives}
        rows={10}
        placeholder="Career Objectives"
      />
    </div>
  );
};

export default Objectives;
