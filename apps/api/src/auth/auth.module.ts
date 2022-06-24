import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Auth } from "./entities/auth.entity";
import { Profile } from "../profile/entities/profile.entity";
import { ProfileModule } from "../profile/profile.module";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MAIL_CLIENT, MAIL_PORT } from "@app/common";

@Module({
  providers: [AuthResolver, AuthService],
  imports: [
    ClientsModule.register([
      {
        name: MAIL_CLIENT,
        transport: Transport.TCP,
        options: { port: +MAIL_PORT },
      },
    ]),
    TypeOrmModule.forFeature([Auth, Profile]),
    ProfileModule,
  ],
})
export class AuthModule {}
