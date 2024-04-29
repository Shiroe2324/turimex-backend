import fs from 'fs';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import logger from '@managers/logger.manager';
import config from '@utils/config';

const { email } = config;

async function getHtmlTemplate() {
  try {
    return await fs.promises.readFile('src/assets/email.html', 'utf8');
  } catch (error) {
    logger.error('Error reading email template:', error);
    throw new Error('Failed to load email template');
  }
}

const transporter = createTransport({
  host: email.host,
  port: email.port,
  secure: true,
  auth: { user: email.user, pass: email.pass },
});

async function processTemplate(data: Record<string, string>) {
  const htmlTemplate = await getHtmlTemplate();
  const pattern = /\{\{([^}]+)\}\}/g;
  return htmlTemplate.replace(pattern, (_substring, key) => data[key]);
}

async function isSmtpHostDown() {
  try {
    await transporter.verify();
    return false;
  } catch (error) {
    logger.error('Error verifying SMTP host:', error);
    return true;
  }
}

async function sendVerificationEmail(to: string, name: string, token: string) {
  const verifyUrl = new URL(email.verificationUrl);
  verifyUrl.searchParams.append('token', token);

  const processedHtmlData = {
    name,
    verifyUrl: verifyUrl.toString(),
    year: new Date().getFullYear().toString(),
  };

  const processedHtml = await processTemplate(processedHtmlData);

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

function emailManager() {
  return {
    isSmtpHostDown,
    sendVerificationEmail,
  };
}

export default emailManager;
