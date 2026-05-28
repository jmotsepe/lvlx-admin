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
import { Card, CardContent } from "@/components/ui/card";
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
import { startTransition, useState } from "react";
import { fileUrl, validateCompanyRegistrationNumber } from "@/lib/utils";
import { company, companyOptionalDefaultsSchema } from "@/prisma/generated/zod";
import { handleDownloadClick } from "@/lib/handleDownloadClick";

const UpdateCompany = ({ currentCompany }: { currentCompany: company }) => {
  //
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const form = useForm<company>({
    // resolver: zodResolver(companyOptionalDefaultsSchema),
    mode: "all",
    defaultValues: {
      address: currentCompany.address,
      department: currentCompany.department,
      description: currentCompany.description,
      employees: currentCompany.employees,
      name: currentCompany.name,
      reg_no: currentCompany.reg_no,
      type: currentCompany.type,
    },
  });

  async function onSubmit(data: company) {
    const valid = validateCompanyRegistrationNumber(data.reg_no);

    if (!valid) {
      toast.warning("Company registration number is not formatted correctly.");
      return;
    }
    setLoading(true);

    const { error } = await supabaseClient
      .from("company")
      .upsert({
        id: currentCompany.id,
        address: data.address,
        department: data.department,
        description: data.description,
        employees: data.employees,
        name: data.name,
        reg_no: data.reg_no,
        type: data.type,
        status: "Pending",
        regCertificate: data.regCertificate,
      })

      .select("*");
    if (error) {
      toast.error(error.message);
    } else {
      startTransition(() => {
        router.refresh();
      });
    }
    setLoading(false);
  }

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
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
        .from("companyRegCert") // Replace with your Supabase storage bucket name
        .upload(`${Date.now()}-${file.name}`, file, {
          cacheControl: "3600", // Optional cache control setting
        });

      if (error) {
        setUploadError("Error uploading file to Supabase.");
      } else {
        toast.success("Registration certificate uploaded successfully");
        console.log("DATA", data);
        form.setValue("regCertificate", data.fullPath);
        const { error } = await supabaseClient.from("company").upsert({
          id: currentCompany.id,
          regCertificate: data.fullPath,
          address: currentCompany.address,
          department: currentCompany.department,
          description: currentCompany.description,
          employees: currentCompany.employees,
          name: currentCompany.name,
          reg_no: currentCompany.reg_no,
          type: currentCompany.type,
        });
        startTransition(() => {
          router.refresh();
        });

        console.log("FILE ERROR", error);
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      setUploadError("Error uploading file to Supabase.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <CardContent>
        <h6 className="text-sm mb-2 font-bold">
          Upload Registration Certificate
        </h6>
        <div className="max-w-md flex items-center gap-4 mb-4 shadow-md rounded-md">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="p-1 border border-gray-300 rounded-md"
          />

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
              uploading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
        {uploadError && <p className="text-red-500 mb-4">{uploadError}</p>}
        {currentCompany.regCertificate ? (
          <Card className="my-5 p-5 shadow-lg rounded-lg">
            {" "}
            <h1 className="font-bold text-2xl">
              Download uploaded certificate
            </h1>
            <p className="text-gray-600 mb-4">
              Please click the button below to download.
            </p>
            <p>
              <Button
                onClick={() =>
                  handleDownloadClick(
                    `${fileUrl()}${currentCompany.regCertificate}`
                  )
                }
              >
                Download Certificate
              </Button>
            </p>
          </Card>
        ) : null}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
            className="space-y-5"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
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
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button loading={loading} type="submit" disabled={loading}>
              Update Company
            </Button>
          </form>
        </Form>
      </CardContent>
    </>
  );
};

export default UpdateCompany;
