import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const validateCompanyRegistrationNumber = (
  registrationNumber: string
) => {
  const pattern = /^\d{4}\/\d{6}\/\d{2}$/;
  const result = pattern.test(registrationNumber);
  return result;
};

export function validateEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// function for generating the initials of a user, given fullname. e.g John Doe, initials: JD
export default function getInitials(fullName: string) {
  let initials = "";

  fullName.split(" ").forEach((name) => {
    initials += name[0]?.toUpperCase();
  });

  return initials;
}

export const trimSnackBarText = (text: string) => {
  const maxLength = 52;

  return text.length > maxLength ? `${text.substr(0, maxLength - 5)}...` : text;
};

export const nameTructed = (name: string, tructedLength: number) => {
  if (name?.length > tructedLength) {
    if (tructedLength === 15) {
      return `${name.substr(0, 12)}...`;
    } else {
      return `${name.substr(0, tructedLength)}...`;
    }
  } else {
    return name;
  }
};

export const json_verify = (s: any) => {
  try {
    JSON.parse(s);
    return true;
  } catch (e) {
    return false;
  }
};

export function formatAMPM(date: any) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
  return url;
};

export function generateOTP(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[randomIndex];
  }

  return otp;
}

export function fileUrl() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const normalizedUrl = supabaseUrl.endsWith("/")
    ? supabaseUrl.slice(0, -1)
    : supabaseUrl;

  return `${normalizedUrl}/storage/v1/object/public/`;
}
