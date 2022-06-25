import { IProfile, MailEventsEnum } from "@app/common";
import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { LoggedInDTO } from "./dtos/mail.dto";
import { MailService } from "./mail.service";

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @EventPattern(MailEventsEnum.LOGGED_IN)
  login(@Payload() data: LoggedInDTO) {
    this.mailService.sendMail(data);
  }

  @EventPattern(MailEventsEnum.INVITE_USER)
  inviteUser(@Payload() data: IProfile) {
    return this.mailService.inviteUser(data);
  }

  @EventPattern(MailEventsEnum.RESET_AUTH)
  resetAuth(@Payload() data: IProfile) {
    return this.mailService.resetAuth(data);
  }
}
