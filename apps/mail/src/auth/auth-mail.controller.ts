import { IAuth, IProfile, MailEventsEnum } from "@app/common";
import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { LoggedInDTO } from "./dtos/mail.dto";
import { AuthMailService } from "./auth-mail.service";

@Controller()
export class AuthMailController {
  constructor(private readonly mailService: AuthMailService) {}

  @EventPattern(MailEventsEnum.LOGGED_IN)
  login(@Payload() data: LoggedInDTO) {
    this.mailService.login(data);
  }

  @EventPattern(MailEventsEnum.INVITE_USER)
  inviteUser(@Payload() data: IProfile) {
    return this.mailService.inviteUser(data);
  }

  @EventPattern(MailEventsEnum.RESET_AUTH)
  resetAuth(@Payload() data: IProfile) {
    return this.mailService.resetAuth(data);
  }

  @EventPattern(MailEventsEnum.RESET_PASSWORD)
  resetPassword(@Payload() data: IAuth) {
    return this.mailService.resetPassword(data);
  }

  @EventPattern(MailEventsEnum.CHANGED_PASSWORD)
  changedPassword(@Payload() user: IProfile) {
    return this.mailService.changedPassword(user);
  }
}
