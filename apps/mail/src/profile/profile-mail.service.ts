import { IProfile } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";

import { Sendgrid } from "../utils/sendgrid";

const { CLIENT_URL } = process.env;
@Injectable()
export class ProfileMailService {
  private logger = new Logger(ProfileMailService.name);
  constructor(private sendgrid: Sendgrid) {}

  /**
  @description Invite user to create a auth profile
  @params IProfile
  @returns void
 */

  async invite(user: IProfile) {
    try {
      await this.sendgrid.sendMail({
        email: user.email,
        name: user.name,
        subject: "Invitation from Brighter Dawn",
        html: `
      <h1>Hello ${user?.firstName}</h1>,

  <p>You have been invited to create a portal account with Brighter Dawn Portal. Follow this link to complete your registration </p>
<p> <a href='${CLIENT_URL}/auth/signup/${user.id}'>Register now</a> </p>
`,
      });
      this.logger.log(`Sent email to ${user.email}`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**
  @description Profile Created
  @params IProfile
  @returns void
 */

  async signupCompleted(user: IProfile) {
    try {
      await this.sendgrid.sendMail({
        email: user.email,
        name: user.name,
        subject: "Signup process completed",
        html: `<p>You are now registered and can log in to your account <a href='${CLIENT_URL}/auth/login'>portal.bdmis.org</a></p>`,
      });
      this.logger.log(`Sent email to ${user.email}`);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
