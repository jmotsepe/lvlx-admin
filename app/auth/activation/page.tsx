import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import React from "react";

export const revalidate = 0;

const ActivationPage = () => {
  return (
    <div className="mx-auto my-10 max-w-lg">
      <Card>
        <CardContent className="mt-5 space-y-5">
          <div>
            <Badge>Oops🥲</Badge>
            <h1 className="text-3xl font-black mt-2">Account Under Review</h1>
          </div>
          <CardDescription>
            Your account is currently being reviewed by our team. <br /> You
            will be notified as soon as your account is active.
          </CardDescription>
          <br />

          <a
            href="https://lvlx.org"
            className={buttonVariants({ variant: "secondary" })}
            target="_blank"
          >
            Back to Website
          </a>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivationPage;
