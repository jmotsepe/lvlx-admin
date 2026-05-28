import { sendEmail } from "../sendMail";

export async function sendInviteEmail({
  name,
  user,
  code,
  email,
  message,
  company,
}: {
  name: string;
  user: string;
  email: string;
  code: string;
  message?: string | null;
  company: string;
}) {
  const template = `
    <html>
      <head>
        <meta charset="UTF-8">
        <title>LVLX Invitation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.5;
          }
          
          h1 {
            color: #333;
            font-size: 24px;
          }
          
          h2 {
            color: #666;
            font-size: 20px;
          }
          h3 {
            color: #666;
            font-size: 18px;
          }
          
          p {
            color: #888;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <h1>Good day ${name},</h1>
        
        <p>You have been invited to join the LVLX group as a Youth.</p>
        
        <p>Your invitation comes from ${company} company, and was sent by ${user}. Below are the details:</p>
        
        <h3>Invitation Code:</h3>
        <h1>${code}</h1>
        
        <h2>Message from ${user}:</h2>
        <p>${message}</p>
        
        <p>Please use the provided invitation code to proceed with the sign-up process. We look forward to having you on board!</p>
            
        <p>Thank you,</p>
        <p>The LVLX Team</p>
      </body>
    </html>
  `;

  await sendEmail({ message: template, subject: "LVLX Invitation", to: email });
}
