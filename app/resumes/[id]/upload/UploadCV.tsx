"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, FileUp, Check, X, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { supabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ResumeUpload({ id }: { id: string }) {
  //

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const validateFile = (file: File) => {
    if (file.type !== "application/pdf") {
      return "Please upload a PDF file.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size exceeds 5MB limit.";
    }
    return null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const validationError = validateFile(selectedFile);
      if (validationError) {
        setFile(null);
        setError(validationError);
      } else {
        setFile(selectedFile);
        setError(null);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
      setUploading(true);
      setUploadProgress(0);
      await handleUpload();
      setUploading(false);
      setSuccess(true);
      setFile(null);
    } else {
      setError("Please select a file to upload.");
    }
  };

  const resetForm = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setUploading(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
      console.log("FILE", file);
      const { data, error } = await supabaseClient.storage
        .from("cv") // Replace with your Supabase storage bucket name
        .upload(`${Date.now()}-${file.name}`, file, {
          cacheControl: "3600", // Optional cache control setting
          upsert: false,
        });

      console.log("DATA", data);
      console.log("ERROR", error);

      if (error) {
        setUploadError("Error uploading file to Supabase.");
        return; // Added return to prevent further execution
      }

      // Check if data is valid before proceeding
      if (!data || !data.fullPath) {
        setUploadError("Upload failed, no data returned.");
        return; // Added return to prevent further execution
      }

      await supabaseClient
        .from("resume")
        .update({
          url: data.fullPath,
        })
        .eq("id", id);

      router.refresh();

      toast.success("Registration certificate uploaded successfully");
    } catch (error) {
      console.error("Error during file upload:", error);
      setUploadError("Error uploading file to Supabase.");
      toast.error("Error uploading file to Supabase.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Upload Your Resume</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label
            htmlFor="resume"
            className="block text-sm font-medium text-gray-700"
          >
            Resume (PDF only, max 5MB)
          </Label>
          <Input
            id="resume"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="mt-1"
            ref={fileInputRef}
            disabled={uploading || success}
          />
        </div>
        {file && (
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <span>{file.name}</span>
            <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={!file || uploading || success}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
            </>
          ) : success ? (
            <>
              <Check className="mr-2 h-4 w-4" /> Uploaded
            </>
          ) : (
            <>
              <FileUp className="mr-2 h-4 w-4" /> Upload Resume
            </>
          )}
        </Button>
      </form>
      {uploading && (
        <div className="mt-4">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-gray-500 mt-2">
            Uploading: {uploadProgress}%
          </p>
        </div>
      )}
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mt-4">
          <Check className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Your resume has been uploaded successfully!
          </AlertDescription>
        </Alert>
      )}
      {(error || success) && (
        <Button onClick={resetForm} variant="outline" className="mt-4 w-full">
          <X className="mr-2 h-4 w-4" /> Reset
        </Button>
      )}
    </div>
  );
}
