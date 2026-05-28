import { sendEmail } from "../sendMail";

export async function sendAcceptanceEmail({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const template = `
      <html>
        <head>
          <meta charset="UTF-8">
          <title>LVLX Invitation Acceptance</title>
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
          <h1>Good day😎</h1>
          
          <p>We are thrilled to inform you that your invitation for ${name} join the LVLX group as a Youth has been accepted!</p>
          
          <p>${name} is now a member of the LVLX family.</p>
          
          <p>If you have any questions or need any assistance, feel free to contact us at support@lvlx.com.</p>
          
          <p>Welcome to LVLX and enjoy your journey with us!</p>
          
          <p>Best regards,</p>
          <p>The LVLX Team</p>
        </body>
      </html>
    `;
  await sendEmail({
    message: template,
    subject: "LVLX Invitation Acceptance",
    to: email,
  });
}
