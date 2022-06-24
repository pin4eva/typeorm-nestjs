import { Injectable } from "@nestjs/common";
import { LoggedInDTO } from "./dtos/mail.dto";
import { Sendgrid } from "./utils/sendgrid";

@Injectable()
export class MailService {
  constructor(private sendgrid: Sendgrid) {}

  async sendMail(input: LoggedInDTO) {
    try {
      const html = `You just logged in to your account`;
      const subject = "New login";
      await this.sendgrid.sendMail({
        email: input.email,
        name: input.name,
        html,
        subject,
      });

      return `SENT MAIL TO ${input.email}`;
    } catch (error) {
      throw error;
    }
  }
}
