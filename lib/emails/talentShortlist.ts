import { sendEmail } from "../sendMail";

export async function talentShortlist({
  name,
  email,
  company,
  role,
}: {
  name: string;
  company: string;
  role: string;
  email: string;
}) {
  const template = `
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Sponsored Youth - Shortlisted 🎉</title>
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
          <h1>Good day</h1>
          
          <p>Your sponsored youth ${name} has been selected as one of the shortlisted candidates for a ${role} position at ${company} company.</p>

          <p>If you have any questions or need any assistance, feel free to contact us at support@lvlx.com.</p>
                    
          <p>Best regards,</p>
          <p>The LVLX Team</p>
        </body>
      </html>
    `;
  await sendEmail({
    message: template,
    subject: "Sponsored Youth - Shortlisted 🎉",
    to: email,
  });
}
