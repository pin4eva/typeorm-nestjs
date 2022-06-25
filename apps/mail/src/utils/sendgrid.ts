import { config } from "@app/common/utils/config";
import { BadGatewayException, Logger } from "@nestjs/common";
import * as client from "@sendgrid/mail";
client.setApiKey(config.SENDGRID_API_KEY);

const logger = new Logger("Sendgrid");

interface MailPayload {
  email: string;
  subject: string;
  html: string;
  name?: string;
  dynamicTemplate?: string;
}

export class Sendgrid {
  async sendMail(payload: MailPayload) {
    const mailOptions: client.MailDataRequired = {
      from: config.MAIL_SENDER,
      to: { email: payload.email, name: payload.name },
      subject: payload.subject,
      html: payload.html,
    };

    try {
      await client.send(mailOptions).catch((err) => {
        throw new BadGatewayException(err);
        logger.log(err);
      });
    } catch (error) {
      throw error;
    }
  }
}
