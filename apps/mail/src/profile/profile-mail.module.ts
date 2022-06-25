import { Module } from "@nestjs/common";
import { ProfileMailController } from "./profile-mail.controller";
import { ProfileMailService } from "./profile-mail.service";

import { Sendgrid } from "../utils/sendgrid";

@Module({
  imports: [],
  controllers: [ProfileMailController],
  providers: [ProfileMailService, Sendgrid],
})
export class AuthMailModule {}
