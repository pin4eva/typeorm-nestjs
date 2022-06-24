import { MailEventsEnum } from "@app/common";
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
}
