import { IProfile } from "@app/common";
import { Injectable } from "@nestjs/common";
import { LoggedInDTO } from "./dtos/mail.dto";
import { Sendgrid } from "./utils/sendgrid";

const { CLIENT_URL } = process.env;
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

  async inviteUser(user: IProfile) {
    await this.sendgrid.sendMail({
      email: user.email,
      subject: "Create your profile",
      name: user.name,
      html: `
        <h1>Hello </h1>
        <p>You have been invited to join <strong>BDMIS Portal</strong>. Click <a href='${CLIENT_URL}/auth/signup/${user.id}'>here</a> to create your profile on BDMIS Portal </p>
        `,
    });
  }

  async resetAuth(user: IProfile) {
    try {
      await this.sendgrid.sendMail({
        email: user.email,
        name: user.name,
        subject: "Account Reset",
        html: `Your account was reset. Please click here to create another one <a href='${CLIENT_URL}/auth/signup/${user.id}'>here</a> to create your profile on BDMIS Portal </p>`,
      });
    } catch (error) {
      throw error;
    }
  }
}
