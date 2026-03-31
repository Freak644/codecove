import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {renderTemplate} from './tamplateHandler.js' // fixed typo

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port:465,
  secure:true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendTheMail(to, subject, templateName, templateData = {}) {
  try {
    const html = await renderTemplate(templateName, templateData);

    const info = await transporter.sendMail({
      from: `"CodeCove" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.log(err.message)
    console.error("❌ Error sending email:", err);
    throw err;
  }
}

export { sendTheMail };
