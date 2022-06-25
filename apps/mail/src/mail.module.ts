import { Module } from "@nestjs/common";
import { AuthMailModule } from "./auth/auth-mail.module";
import { MailController } from "./mail.controller";
import { MailService } from "./mail.service";

@Module({
  controllers: [MailController],
  providers: [MailService],
  imports: [AuthMailModule],
})
export class MailModule {}
