"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabaseClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { validateCompanyRegistrationNumber } from "@/lib/utils";
import { company, companyOptionalDefaultsSchema } from "@/prisma/generated/zod";
import { addNewCompany } from "../actions";
import { Upload } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function CreateNewCompany({
  userID,
  role,
}: {
  userID: string;
  role: string | undefined;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const form = useForm<company>({
    // resolver: zodResolver(companyOptionalDefaultsSchema),
    mode: "all",
  });

  async function onSubmit(data: company) {
    if (!validateCompanyRegistrationNumber(data.reg_no)) {
      toast.warning("Company registration number is not formatted correctly.");
      return;
    }
    setLoading(true);
    const company = await toast.promise(addNewCompany(data), {
      error: "Failed to create company.",
      pending: "Creating company...",
      success: "Company created successfully.",
    });

    if (company) {
      const path = `/companies/${company.id}`;
      router.push(path);
    }
    setLoading(false);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setUploadError(null);
    } else {
      setFile(null);
      setUploadError("Please select a valid PDF file.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError("Please select a file to upload.");
      return;
    }
    setUploading(true);
    setUploadError(null);

    try {
      const { data, error } = await supabaseClient.storage
        .from("companyRegCert")
        .upload(`${Date.now()}-${file.name}`, file, {
          cacheControl: "3600",
        });

      if (error) {
        setUploadError("Error uploading file to Supabase.");
      } else {
        toast.success("Registration certificate uploaded successfully");
        form.setValue("regCertificate", data.fullPath);
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      setUploadError("Error uploading file to Supabase.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <Card className="bg-card text-card-foreground rounded-lg shadow-lg p-6">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Upload Registration Certificate
          </h2>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="grow"
            />
            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
          {uploadError && (
            <p className="text-destructive mt-2">{uploadError}</p>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="SoImagine Systems"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Software"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Sandton"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reg_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        {...field}
                        placeholder="YYYY/NNNNN/LL"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Employees</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="How many employees does your company have?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-10">1 - 10</SelectItem>
                        <SelectItem value="10 - 100">10 - 100</SelectItem>
                        <SelectItem value="Over 100">Over 100</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose company type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Private">Private Company</SelectItem>
                        <SelectItem value="Public">Public Company</SelectItem>
                        <SelectItem value="Organisation">
                          Organisation
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="About the company"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? "Creating..." : "Create Company"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
