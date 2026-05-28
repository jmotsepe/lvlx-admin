"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getURL } from "@/lib/utils";
import { point_tiers } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BuyPoints = ({
  company,
  tiers,
  tier,
  token,
  payfastReceiverId,
  payfastProcessUrl,
}: {
  company: string;
  tiers: point_tiers[];
  tier: string;
  token: string;
  payfastReceiverId: string;
  payfastProcessUrl: string;
}) => {
  const url = getURL();

  const selectedTier = tiers.find((t) => t.id === tier);

  return (
    <form
      name="PayFastPayNowForm"
      action={payfastProcessUrl}
      method="post"
    >
      <input required type="hidden" name="cmd" value="_paynow" />

      <input
        required
        type="hidden"
        name="receiver"
        pattern="[0-9]"
        value={payfastReceiverId}
      />

      <input
        type="hidden"
        name="return_url"
        value={`${url}/companies/${company}/return?tier=${selectedTier?.id}?token=${token}`}
      />

      <input
        type="hidden"
        name="cancel_url"
        value={`${url}/companies/${company}/cancel?tier=${selectedTier?.id}?token=${token}`}
      />

      <input required type="hidden" name="amount" value={selectedTier?.cost} />

      <input
        required
        type="hidden"
        name="item_name"
        maxLength={255}
        value="LVL X Youth Tokens"
      />

      <input
        type="hidden"
        name="item_description"
        maxLength={255}
        value="LVL X Youth Tokens"
      />

      <table>
        <tr>
          <td colSpan={2} align="center">
            <input
              type="image"
              src="https://my.payfast.io/images/buttons/BuyNow/Primary-Large-BuyNow.png"
              alt="Buy Now"
              disabled={!selectedTier || !token}
              title="Buy Now with Payfast"
            />
          </td>
        </tr>
      </table>
    </form>
  );
};

export default function BuyCreditsModal({
  company,
  tiers,
  token,
  payfastReceiverId,
  payfastProcessUrl,
}: {
  company: string;
  tiers: point_tiers[];
  token: string;
  payfastReceiverId: string;
  payfastProcessUrl: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tier, setTier] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"black"}>Buy Credits</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy LVLX Credits</DialogTitle>
          <DialogDescription>
            Purchase LVLX Credits for your account.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Select value={tier} onValueChange={(e) => setTier(e)}>
            <SelectTrigger>
              <SelectValue placeholder="Select credits" />
            </SelectTrigger>
            <SelectContent className="mb-2">
              {tiers.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.points} credits - R{c.cost || 0}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <br />
          <BuyPoints
            token={token}
            tier={tier}
            tiers={tiers}
            company={company}
            payfastReceiverId={payfastReceiverId}
            payfastProcessUrl={payfastProcessUrl}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
