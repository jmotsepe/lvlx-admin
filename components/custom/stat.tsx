import React, { FC } from "react";
import { Card, CardHeader } from "../ui/card";
import { buttonVariants } from "../ui/button";
import { Link2Icon, LucideIcon } from "lucide-react";
import Link from "next/link";

export type StatProps = {
  title: string;
  value: number | null;
  Icon: LucideIcon;
  color?: string;
  link?: string;
};

const Stat: FC<StatProps> = ({ Icon, title, value, color, link }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-5 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <div
                className={buttonVariants({ size: "icon", variant: "outline" })}
              >
                <Icon
                  className="text-white"
                  color={color || "yellow"}
                  size={18}
                />
              </div>
              <h1 className="text-3xl font-bold">{value || 0}</h1>
            </div>
            <h1 className="text-sm">{title}</h1>
          </div>
          {link && (
            <Link
              href={link}
              className={buttonVariants({ variant: "secondary" })}
            >
              View
            </Link>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

export default Stat;
