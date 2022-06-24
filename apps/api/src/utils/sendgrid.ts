import { HttpException } from "@nestjs/common";
import * as client from "@sendgrid/mail";
import axios from "axios";
import { config } from ".";
client.setApiKey(config.SENDGRID_API_KEY);

interface MailPayload {
  email: string;
  subject: string;
  html: string;
}

const baseUrl = "https://api.sendgrid.com";
export const sendgrid = {
  sendMail: async (payload: MailPayload) => {
    const mailOptions: client.MailDataRequired = {
      from: config.MAIL_SENDER,
      to: {
        email: payload.email,
      },
      subject: payload.subject,
      html: payload.html,
    };
    await client.send(mailOptions).catch((err) => {
      throw new HttpException(err, 500);
    });
  },
  retrieveApi: async () => {
    try {
      const { data } = await axios.get(
        `${baseUrl}/v3/api_keys/${config.SENDGRID_API_KEY_ID}`,
        {
          headers: {
            "on-behalf-of": "pin4eva",
            Authorization: `Bearer ${config.SENDGRID_API_KEY}`,
          },
        },
      );
      console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  },
};
