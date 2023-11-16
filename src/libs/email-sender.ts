import * as nodemailer from 'nodemailer';

type EmailSenderInterface = {
  subject: string;
  token: string;
  from: string;
  to: string;
  html: string;
};

export const EmailSender = async ({ email, token }): Promise<any> => {
  const data: EmailSenderInterface = {
    subject: 'Email Verification',
    from: process.env.MAIL_SENDER_EMAIL,
    to: email,
    html: await GenerateEmailHtmlBody(token),
    token: token,
  };

  const mailOptions = {
    from: data.from,
    to: data.to, // list of receivers (separated by ,)
    subject: data.subject,
    html: data.html,
  };

  const transporter = nodemailer.createTransport({
    // host: 'smtp-mail.outlook.com', // hostname
    // secureConnection: false, // TLS requires secureConnection to be false
    // port: 587, // port for secure SMTP
    service: 'Gmail',
    auth: {
      user: process.env.MAIL_SENDER_EMAIL,
      pass: process.env.MAIL_SENDER_PASSWORD,
    },
  });

  await transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.log(`Message sent: ${error}`);
    }
    console.log(`Message sent ${info.messageId}`);
  });
};

const GenerateEmailHtmlBody = async (token: string): Promise<string> => {
  return `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">

</head>
<body>
    <div style="font-family: 'Roboto', sans-serif;width: 400px;padding: 8px;background-color: #22668D;border-radius: 10px;color: white;">
        <div style="background-color: white;color : #22668D;padding: 10px;border-top-right-radius: 10px;border-top-left-radius: 10px;display: flex;justify-content: space-between;align-items: center;">
            <div>
                <h3>Email Verification</h3>
            </div>
            <div>
                <img src="https://www.nyilynnhtwe.ninja/poneyateyaung.png" alt="" width="30px" height="30px">
            </div>
        </div>
        <h5>Welcome to Pone Yate Yaung</h5>
        <h6>To activate your Pone Yate Yaung account you must first verify your email address by clicking <a style="text-decoration: none;color: #FFCC70;font-weight: bold;font-size: 15px;" href="http://localhost:3000/api/auth/verify/token=${token}"> &nbsp;&nbsp; this link</a>.<h6>
    </div>
</body>

</html>`;
};
