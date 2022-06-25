import { IProfile, MailEventsEnum } from "@app/common";
import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { ProfileMailService } from "./profile-mail.service";

@Controller()
export class ProfileMailController {
  constructor(private readonly profileService: ProfileMailService) {}

  @EventPattern(MailEventsEnum.INVITE_USER)
  inviteUser(@Payload() user: IProfile) {
    return this.profileService.invite(user);
  }

  @EventPattern(MailEventsEnum.INVITE_USER)
  profileCreated(@Payload() user: IProfile) {
    return this.profileService.signupCompleted(user);
  }
}
