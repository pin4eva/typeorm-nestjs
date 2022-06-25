import { Module } from "@nestjs/common";
import { AuthMailController } from "./auth-mail.controller";
import { AuthMailService } from "./auth-mail.service";

import { Sendgrid } from "../utils/sendgrid";

@Module({
  imports: [],
  controllers: [AuthMailController],
  providers: [AuthMailService, Sendgrid],
})
export class AuthMailModule {}
