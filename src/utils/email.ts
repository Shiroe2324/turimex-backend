import fs from 'fs';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import config from './config';

const { email } = config;

const verifyUrl = new URL(email.verificationUrl);
const htmlTemplate = fs.readFileSync('src/assets/email.html', 'utf8');

const transporter = nodemailer.createTransport({
  host: email.host,
  port: email.port,
  secure: true,
  auth: { user: email.user, pass: email.pass },
});

function processTemplate(data: Record<string, string>) {
  const pattern = /\{\{([^}]+)\}\}/g;
  return htmlTemplate.replace(pattern, (_, key) => data[key]);
}

export function isSmtpHostDown() {
  let isDown = false;

  transporter.verify((error) => {
    if (error) {
      isDown = true;
    } else {
      isDown = false;
    }
  });

  return isDown;
}

async function sendVerificationEmail(to: string, name: string, token: string) {
  verifyUrl.searchParams.append('token', token);

  const processedHtmlData = {
    name,
    verifyUrl: verifyUrl.toString(),
    year: new Date().getFullYear().toString(),
  };

  const processedHtml = processTemplate(processedHtmlData);

  const mailOptions: Mail.Options = {
    from: email.sender,
    to,
    subject: 'Verificación de correo electrónico',
    text: 'Verifica tu correo electrónico',
    html: processedHtml,
  };

  const mail = await transporter.sendMail(mailOptions);

  return mail;
}

export default sendVerificationEmail;
