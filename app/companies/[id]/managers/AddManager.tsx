"use client";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import React, { startTransition, useState } from "react";
import { toast } from "react-toastify";
import { supabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDisclosure } from "@mantine/hooks";
import { Input } from "@/components/ui/input";
import { validateEmail } from "@/lib/utils";

const AddManager = ({ id }: { id: string }) => {
  //

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, { toggle }] = useDisclosure();
  const [email, setEmail] = useState("");

  const submit = async () => {
    const validEmail = validateEmail(email);
    if (!validEmail) {
      toast.error("Email is not valid");
      return;
    }
    setLoading(true);

    let { data, error } = await supabaseClient.rpc("get_user_id_by_email", {
      email,
    });
    if (error) {
      toast.error(error.message);
    }
    console.log("DATA", data);
    if (data) {
      const { error } = await supabaseClient.from("company_manager").insert({
        company_id: id,
        user_id: data[0].id,
      });
      if (error) {
        toast.error(error.message);
      }
      toast.success("Company manager added successfully");
      startTransition(() => {
        router.refresh();
      });
      toggle();
    } else {
      toast.error("User not found");
    }
    setLoading(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={
        loading
          ? undefined
          : () => {
              setEmail("");
              toggle();
            }
      }
      defaultOpen={open}
    >
      <DialogTrigger>
        <Button onClick={toggle} variant={"green"}>
          <User className="mr-4" size={18} /> Add Manager
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add manager</DialogTitle>
          <DialogDescription>
            Enter the email of the user you want to add as admin
          </DialogDescription>
          <br />
          <div className="mt-10 space-y-5">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
            />
            <Button loading={loading} onClick={submit} className="w-full">
              Submit
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddManager;
