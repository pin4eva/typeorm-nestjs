import * as dotenv from "dotenv";
dotenv.config();

export const MailConfigVars = {
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  MAIL_SENDER: {
    email: process.env.SENDGRID_EMAIL || "info.bdmis@gmail.com",
    name: process.env.SENDGRID_NAME || "Brighter Dawn Montessori School",
  },
};
