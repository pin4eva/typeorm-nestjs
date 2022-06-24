import { Module } from "@nestjs/common";
import { MailController } from "./mail.controller";
import { MailService } from "./mail.service";
import { Sendgrid } from "./utils/sendgrid";

@Module({
  imports: [],
  controllers: [MailController],
  providers: [MailService, Sendgrid],
})
export class MailModule {}
