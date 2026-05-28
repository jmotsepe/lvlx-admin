import { sendEmail } from "../sendMail";

export async function sendRemovalEmail({
  name,
  user,
  email,
}: {
  name: string;
  user: string;
  email: string;
}) {
  const template = `
      <html>
        <head>
          <meta charset="UTF-8">
          <title>LVLX Invitation Removal</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.5;
            }
            
            h1 {
              color: #333;
              font-size: 24px;
            }
            
            p {
              color: #888;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <h1>Dear ${name},</h1>
          
          <p>We regret to inform you that your invitation to join the LVLX group as a Youth has been removed.</p>
          
          <p>The invitation from ${user} has been retracted. We apologize for any inconvenience caused.</p>
          
          <p>If you have any questions or concerns, please feel free to reach out to our support team at support@lvlx.com.</p>
          
          <p>Thank you for your understanding.</p>
          
          <p>Sincerely,</p>
          <p>The LVLX Team</p>
        </body>
      </html>
    `;

  // Send the email using the generated template
  await sendEmail({
    message: template,
    subject: "LVLX Invitation Removed",
    to: email,
  });
}
