"use server";

import { getURL } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import crypto from "crypto";
import { redirect } from "next/navigation";

export async function getUser() {
  const supabaseServer = await createClient();
  const {
    data: { user },
    error,
  } = await supabaseServer.auth.getUser();
  if (!user || error) {
    redirect("/auth/sign-in");
  }

  return user;
}

export async function getSessions(navigatorData: any) {
  function getDeviceId() {
    const dataString = navigatorData.join("-");
    const hash = crypto.createHash("sha256");
    hash.update(dataString);

    return hash.digest("hex");
  }

  const deviceId = getDeviceId();

  return deviceId;
}

export async function signOut() {
  const supabaseServer = await createClient();

  const { error } = await supabaseServer.auth.signOut();

  if (error) {
    throw new Error("Something went wrong while trying to sign out");
  }

  redirect("/auth/sign-in");
}

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const supabaseServer = await createClient();

  const { error, data } = await supabaseServer.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error("Incorrect password or email.");
  } else if (data.user) {
    return data.user;
  } else if (!data.user) {
    throw new Error("Hmm... Something went wrong. You could not be signed in.");
  }

  redirect("/dashboard");
}

export async function signUp({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  //

  const callbackURL = `${getURL()}api/auth/callback"`;

  const supabaseServer = await createClient();

  const { error, data } = await supabaseServer.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackURL,
    },
  });

  if (error) {
    throw new Error("Hmm... Something went wrong. You could not be signed up.");
  } else if (data.session) {
    return data;
  } else if (
    data.user &&
    data.user.identities &&
    data.user.identities.length == 0
  ) {
    throw new Error("Hmm... Something went wrong. You could not be signed up.");
  } else {
    throw new Error("Hmm... Something went wrong. You could not be signed up.");
  }
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password")).trim();
  const passwordConfirm = String(formData.get("passwordConfirm")).trim();
  let redirectPath: string;

  // Check that the password and confirmation match
  if (password !== passwordConfirm) {
    throw new Error("Passwords do not match");
  }

  const supabaseServer = await createClient();

  const { error, data } = await supabaseServer.auth.updateUser({
    password,
  });

  if (error) {
    throw new Error("Your password could not be updated.");
  } else if (data.user) {
    return data.user;
  } else {
    throw new Error("Hmm... Something went wrong. You could not be signed up.");
  }
}

export async function updateEmail(formData: FormData) {
  // Get form data
  const newEmail = String(formData.get("newEmail")).trim();

  const supabaseServer = await createClient();

  const { error, data } = await supabaseServer.auth.updateUser(
    { email: newEmail },
    {
      emailRedirectTo: "/account",
    }
  );

  if (error) {
    throw new Error("Your email could not be updated.");
  } else {
    return data;
  }
}

export async function requestPasswordReset(email: string) {
  const supabaseServer = await createClient();

  const myUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/auth/reset-password"
      : "https://admin.lvlx.org/auth/reset-password";

  const { error } = await supabaseServer.auth.resetPasswordForEmail(email, {
    //
    redirectTo: myUrl,
  });

  if (error) {
    console.log(error);
    throw new Error("Something went wrong while requesting a password reset.");
  }
}

export async function resetPassword(newPassword: string) {
  // Simulate API call delay

  const supabaseServer = await createClient();

  const { error } = await supabaseServer.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.log(error);
    throw new Error("Something went wrong while resetting your password.");
  }
}
