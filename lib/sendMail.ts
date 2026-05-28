"use server";

import mailer from "./nodeMailer";

export type EmailData = {
  to: string;
  message: string;
  subject: string;
};

export async function sendEmail(data: EmailData) {
  const msg = {
    to: data.to,
    from: process.env.SMTP_USER,
    subject: data.subject,
    html: data.message,
  };

  mailer.sendMail(msg, (err, info) => {
    if (err) {
      console.log(err.message);
      throw new Error(err.message);
    } else {
      console.log("Response: ", info);
    }
  });
}
